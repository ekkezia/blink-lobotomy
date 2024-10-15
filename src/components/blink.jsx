import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
// const faceLandmarksDetection = require("@tensorflow-models/face-landmarks-detection");

const Blink = ({ onBlink }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [model, setModel] = useState(null);
  const [maxLeft, setMaxLeft] = useState(0);
  const [maxRight, setMaxRight] = useState(0);
  const [detecting, setDetecting] = useState("");
  const webcamRef = useRef(null);

  useEffect(() => {
    tf.setBackend("webgl");
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      const loadedModel = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
        { maxFaces: 1 }
      );
      console.log("Loaded model: ", loadedModel);
      setModel(loadedModel);
    } catch (error) {
      console.log("Loading model error:", error);
    }
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCount(0);
      setTimeout(() => {
        setDetecting("detecting...");
        detectPoints();
      }, 2000);
    } else {
      setDetecting("");
    }
  };

  const detectPoints = async () => {
    if (!model) return;

    const video = webcamRef.current.video;
    const predictions = await model.estimateFaces({
      input: video,
      returnTensors: false,
      flipHorizontal: true,
      predictIrises: true,
    });

    if (predictions.length > 0) {
      const keypoints = predictions[0].scaledMesh;
      if (detectBlink(keypoints)) {
        onBlink((prevCount) => prevCount + 1);
        setDetecting("");
      }
    } else {
      setMaxLeft(0);
      setMaxRight(0);
    }

    if (isOpen) {
      setTimeout(() => detectPoints(), 40);
    }
  };

  const detectBlink = (keypoints) => {
    const leftEyePoints = { left: 263, right: 362, top: 386, bottom: 374 };
    const rightEyePoints = { left: 133, right: 33, top: 159, bottom: 145 };

    const leftVertical = calculateDistance(
      keypoints[leftEyePoints.top][0],
      keypoints[leftEyePoints.top][1],
      keypoints[leftEyePoints.bottom][0],
      keypoints[leftEyePoints.bottom][1]
    );
    const leftHorizontal = calculateDistance(
      keypoints[leftEyePoints.left][0],
      keypoints[leftEyePoints.left][1],
      keypoints[leftEyePoints.right][0],
      keypoints[leftEyePoints.right][1]
    );
    const eyeLeft = leftVertical / (2 * leftHorizontal);

    const rightVertical = calculateDistance(
      keypoints[rightEyePoints.top][0],
      keypoints[rightEyePoints.top][1],
      keypoints[rightEyePoints.bottom][0],
      keypoints[rightEyePoints.bottom][1]
    );
    const rightHorizontal = calculateDistance(
      keypoints[rightEyePoints.left][0],
      keypoints[rightEyePoints.left][1],
      keypoints[rightEyePoints.right][0],
      keypoints[rightEyePoints.right][1]
    );
    const eyeRight = rightVertical / (2 * rightHorizontal);

    const baseCloseEye = 0.1;
    const limitOpenEye = 0.14;

    if (maxLeft < eyeLeft) setMaxLeft(eyeLeft);
    if (maxRight < eyeRight) setMaxRight(eyeRight);

    if (maxLeft > limitOpenEye && maxRight > limitOpenEye) {
      if (eyeLeft < baseCloseEye && eyeRight < baseCloseEye) {
        return true;
      }
    }
    return false;
  };

  const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  };

  const videoConstraints = {
    width: 720,
    height: 480,
    facingMode: "user",
  };

  return (
    <div style={{ margin: 20 }}>
      <button type="button" onClick={handleClick}>
        Start/Stop
      </button>
      <b> {detecting} </b>
      <b> :: Count blink = {count} </b>

      {isOpen && (
        <Webcam
          audio={false}
          height={480}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={720}
          videoConstraints={videoConstraints}
        />
      )}
    </div>
  );
};

export default Blink;
