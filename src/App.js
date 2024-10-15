import React, { useEffect, useRef, useState } from "react";
import BlinkClass from "./components/blink-class";
import Webcam from "react-webcam";
import Scoreboard from "./components/scoreboard";
import { supabase } from "./supabase/client";
import { ScoreboardContextProvider } from "./scoreboard-context";

const videoConstraints = {
  // width: 720,
  // height: 480,
  facingMode: "user",
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false); // start game
  const [blinkCount, setBlinkCount] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const webcamRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    const { data, error } = await supabase.from("blink-lobotomy").insert([
      {
        name: form.name,
        time: Math.floor(Date.now() / 1000) - form.time,
        blink_count: blinkCount,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error, form);
      setIsSubmitting(false);
    } else {
      console.log("Data inserted successfully:", data);
      setForm({ name: "", time: 0, blinkCount: 0 });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (opacity < 1) {
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
      if (!isSubmitting) {
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

  return (
    <ScoreboardContextProvider value={{ form }}>
      <div style={{ position: "relative", top: 0, left: 0, zIndex: 1 }}>
        Blink Count ➡️ {blinkCount}{" "}
        {Array.from({ length: blinkCount }).map(() => "👁️")}
        <BlinkClass
          webcamRef={webcamRef}
          isOpen={isOpen}
          toggleGame={() => {
            setIsOpen(!isOpen);
            console.log("toggle game", isOpen);
          }}
          onStartGame={handleStartGame}
          onBlink={setBlinkCount}
          opacity={opacity}
        />
        Make me disappear and appear: {opacity}
      </div>
      <Webcam
        audio={false}
        width={window.width}
        height={window.height}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          opacity: opacity,
        }}
      />

      <Scoreboard isSubmitting={isSubmitting} />
    </ScoreboardContextProvider>
  );
};

export default App;
