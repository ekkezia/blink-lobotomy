import React from "react";
import * as tf from "@tensorflow/tfjs";
import { SUBMIT_STATUS } from "../App";
const faceLandmarksDetection = require("@tensorflow-models/face-landmarks-detection");

class BlinkClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allowStart: false,
      text: "",
      count: 0,
      model: null,
      // for face out frame
      maxLeft: 0,
      maxRight: 0,
    };

    this.nameRef = React.createRef();
  }

  componentDidMount() {
    tf.setBackend("webgl");
    this.loadModel();
  }

  loadModel() {
    // Load the MediaPipe Facemesh package.
    faceLandmarksDetection
      .load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh, {
        maxFaces: 1,
      })
      .then((model) => {
        console.log("Model loaded", model);
        this.setState({ model, allowStart: true });
      })
      .catch((err) => {
        console.log("Error loading model", err);
      });
  }

  handleClick() {
    const { count } = this.state;
    this.props.toggleGame();
    this.setState(
      {
        count: this.props.isOpen ? count : 0,
      },
      () => {
        if (this.props.isOpen) {
          setTimeout(() => {
            this.setState({ detecting: "detecting..." });
            this.detectPoints();
          }, 2000);
        }
      }
    );

    this.props.onStartGame(this.nameRef.current.value);
  }

  async detectPoints() {
    const { model, count } = this.state;
    const video = await this.props.webcamRef.current.video;
    // console.log(video);

    const predictions = await model.estimateFaces({
      input: video,
      returnTensors: false,
      flipHorizontal: true,
      predictIrises: true,
    });

    if (predictions.length > 0) {
      // Somente 1 face
      const keypoints = predictions[0].scaledMesh;
      if (this.detectBlink(keypoints)) {
        // TODO :: Found blink, do someting
        const countN = count + 1;
        this.setState({ count: countN });

        this.props.onBlink((prevCount) => prevCount + 1);

        if (!this.props.isOpen) {
          console.log("please stop detecting");
          // stop detection
          this.setState({ detecting: "" });
          return null;
        }
      }
    } else {
      this.setState({
        maxLeft: 0,
        maxRight: 0,
      });
    }

    setTimeout(async () => {
      await this.detectPoints();
    }, 40);
  }

  detectBlink(keypoints) {
    // point around left eye
    const leftEye_left = 263;
    const leftEye_right = 362;
    const leftEye_top = 386;
    const leftEye_buttom = 374;
    // point around right eye
    const rightEye_left = 133;
    const rightEye_right = 33;
    const rightEye_top = 159;
    const rightEye_buttom = 145;

    const leftVertical = this.calculateDistance(
      keypoints[leftEye_top][0],
      keypoints[leftEye_top][1],
      keypoints[leftEye_buttom][0],
      keypoints[leftEye_buttom][1]
    );
    const leftHorizontal = this.calculateDistance(
      keypoints[leftEye_left][0],
      keypoints[leftEye_left][1],
      keypoints[leftEye_right][0],
      keypoints[leftEye_right][1]
    );
    const eyeLeft = leftVertical / (2 * leftHorizontal);

    const rightVertical = this.calculateDistance(
      keypoints[rightEye_top][0],
      keypoints[rightEye_top][1],
      keypoints[rightEye_buttom][0],
      keypoints[rightEye_buttom][1]
    );
    const rightHorizontal = this.calculateDistance(
      keypoints[rightEye_left][0],
      keypoints[rightEye_left][1],
      keypoints[rightEye_right][0],
      keypoints[rightEye_right][1]
    );
    const eyeRight = rightVertical / (2 * rightHorizontal);

    // TODO :: Need more efficient implmentation
    const baseCloseEye = 0.1;
    const limitOpenEye = 0.14;
    if (this.state.maxLeft < eyeLeft) {
      this.setState({ maxLeft: eyeLeft });
    }
    if (this.state.maxRight < eyeRight) {
      this.setState({ maxRight: eyeRight });
    }

    let result = false;
    if (
      this.state.maxLeft > limitOpenEye &&
      this.state.maxRight > limitOpenEye
    ) {
      if (eyeLeft < baseCloseEye && eyeRight < baseCloseEye) {
        result = true;
      }
    }
    // console.log(result);

    return result;
  }

  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  render() {
    return (
      <div className="form-container">
        {this.state.allowStart ? (
          this.props.submitStatus === SUBMIT_STATUS.SUCCESS ? (
            <>
              <h4>
                <em>Congrats! You blinked.</em>
              </h4>
              <p>You:</p>
              <img
                src={`https://lmgbcuolwhkqoowxnaik.supabase.co/storage/v1/object/public/blink_lobotomy/blink_lobotomy_${this.props.playerName}.png`}
              />
              <button type="button" onClick={this.props.onRestartGame}>
                Restart Game
              </button>
            </>
          ) : (
            <>
              <h4>
                <em>Welcome to Blink Lobotomy</em>
              </h4>
              <p>Instructions:</p>
              <p>1. You are in a blinking competition.</p>
              <p>
                2. Your task is to look at the camera, then blink as fast as you
                can.
              </p>
              <p>3. Fill in the form below to begin the game.</p>

              <form>
                <label>Name*</label>
                <input aria-label="Name" ref={this.nameRef}></input>
                <button type="button" onClick={() => this.handleClick()}>
                  {this.props.isOpen ? "Stop" : "Submit & Start Game"}
                </button>
              </form>

              <p>
                Note: Contact{" "}
                <a href="mailto:e.kezia@gmail.com" target="_blank">
                  e.kezia@gmail.com
                </a>{" "}
                or <a href="https://instagram.com/ekezia">@ekezia</a> for
                assistance.
              </p>
            </>
          )
        ) : (
          <p>Loading... ⏳</p>
        )}
      </div>
    );
  }
}

export default BlinkClass;
