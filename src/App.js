import React, { useEffect, useRef, useState } from "react";
import BlinkClass from "./components/blink-class";
import Webcam from "react-webcam";
import { supabase } from "./supabase/client";
import { ScoreboardContextProvider } from "./scoreboard-context";
import useMousePosition from "./hooks/useMousePosition";
import TitleColumn from "./components/title-column";
import ScoreboardColumn from "./components/scoreboard-column";

export const SUBMIT_STATUS = {
  IDLE: 0,
  SUBMITTING: 1,
  SUCCESS: 2,
  FAIL: 3,
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false); // start game
  const [blinkCount, setBlinkCount] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const webcamRef = useRef();
  const [submitStatus, setSubmitStatus] = useState(SUBMIT_STATUS.IDLE);
  const [shadowColor, setShadowColor] = useState("black");

  // Form
  const [form, setForm] = useState({
    name: "",
    time: 0,
    blinkCount: blinkCount,
  });

  // Start Game
  const handleStartGame = (name) => {
    setForm({ ...form, name: name, time: Math.floor(Date.now() / 1000) });
  };
  // const handleEndGame = () => {
  //   setForm({ ...form, time: Math.floor(Date.now() / 1000) - form.time });
  // };

  // Submit to Supabase
  const handleInsert = async () => {
    // handleEndGame();
    setSubmitStatus(SUBMIT_STATUS.SUBMITTING);

    const { data, error } = await supabase.from("blink-lobotomy").insert([
      {
        name: form.name,
        time: Math.floor(Date.now() / 1000) - form.time,
        blink_count: blinkCount,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error, form);
      setSubmitStatus(SUBMIT_STATUS.FAIL);
    } else {
      console.log("Data inserted successfully:", data);
      setSubmitStatus(SUBMIT_STATUS.SUCCESS);
      await takeScreenshotAndUpload();
    }
  };

  const takeScreenshotAndUpload = async () => {
    if (webcamRef.current) {
      // Capture the screenshot
      const screenshot = webcamRef.current.getScreenshot();

      // Convert the screenshot to a Blob
      const response = await fetch(screenshot);
      const blob = await response.blob();

      // Create a unique filename
      const fileName = `blink_lobotomy_${form.name}.png`;

      // Upload the screenshot to Supabase storage
      const { data, error } = await supabase.storage
        .from("blink_lobotomy") // Ensure the bucket name is correct
        .upload(fileName, blob, {
          contentType: "image/png",
        });

      if (error) {
        console.error("Upload error:", error);
      } else {
        console.log("Uploaded successfully:", data);
      }
    }
  };

  useEffect(() => {
    if (opacity < 1) {
      setShadowColor("green");
      setInterval(() => setShadowColor("black"), 200);
      setOpacity((prevOpacity) =>
        Math.min(prevOpacity + (blinkCount / 1000) * 1, 1)
      );
    }
  }, [blinkCount]);

  useEffect(() => {
    if (opacity < 1) {
      const interval = setInterval(() => {
        setOpacity((prevOpacity) => Math.max(prevOpacity - 0.01, 0)); // Decrease opacity per second by default
      }, 100);

      return () => clearInterval(interval);
    } else {
      setIsOpen(false); // turn off game
      setOpacity(1);
      if (submitStatus !== SUBMIT_STATUS.SUBMITTING) {
        handleInsert();
      }
    }
  }, [opacity]);

  useEffect(() => {
    if (isOpen) {
      // reset opacity
      setOpacity(0);
      setBlinkCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (submitStatus == SUBMIT_STATUS.IDLE) {
      setOpacity(0);
    }
  }, [submitStatus]);

  // mouse
  const { x: mouseX, y: mouseY } = useMousePosition();

  const handleRestartGame = () => {
    setSubmitStatus(SUBMIT_STATUS.IDLE);
    setForm({ name: "", time: 0, blinkCount: 0 });
  };

  return (
    <ScoreboardContextProvider value={{ form }}>
      <div className="container">
        <TitleColumn />
        <div
          className="column main"
          style={{
            margin: "1rem",
            width: "60vw",
            boxShadow: `inset ${mouseX / 100}px ${
              mouseY / 100
            }px 20px ${shadowColor}`,
            transition: "all 200ms",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1.5rem",
              visibility: isOpen ? "visible" : "hidden",
              zIndex: 1,
            }}
          >
            <h1 className="pixelated-font">{blinkCount}</h1>
            <div className="flex">
              {Array.from({
                length: Math.floor((opacity / 1) * 80),
              }).map((_, idx) => (
                <div
                  style={{
                    width: "8px",
                    height: "50px",
                    background:
                      Math.floor((opacity / 1) * 80) > 20
                        ? "green"
                        : Math.floor((opacity / 1) * 80) > 10
                        ? "yellow"
                        : "red",
                  }}
                  key={idx}
                />
              ))}
            </div>
          </div>

          <div
            className="score-container"
            style={{ visibility: isOpen ? "visible" : "hidden" }}
          >
            {/* Input */}
            <div style={{ visibility: isOpen ? "hidden" : "visible" }}>
              <BlinkClass
                webcamRef={webcamRef}
                isOpen={isOpen}
                toggleGame={() => {
                  setIsOpen(!isOpen);
                }}
                onStartGame={handleStartGame}
                onBlink={setBlinkCount}
                opacity={opacity}
                submitStatus={submitStatus}
                onRestartGame={handleRestartGame}
                playerName={form.name}
              />
            </div>
          </div>

          <Webcam
            audio={false}
            ref={webcamRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `blur(${(1 - opacity) * 100}px)`,
              boxShadow: `inset ${mouseX / 100}px ${
                mouseY / 100
              }px 20px ${shadowColor}`,
              border: "4px solid white",
              transition: "all 500ms",
              transform: "rotateY(-180deg)",
              zIndex: 0,
            }}
          />
        </div>{" "}
        <ScoreboardColumn
          isSubmitting={submitStatus === SUBMIT_STATUS.SUBMITTING}
        />
      </div>
    </ScoreboardContextProvider>
  );
};

export default App;
