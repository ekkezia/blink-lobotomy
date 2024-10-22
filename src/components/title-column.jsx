import React, { useState } from "react";

const TitleColumn = () => {
  // mouse
  const [hide, setHide] = useState(false);

  return (
    <>
      <div
        style={{
          position: "relative",
          left: 0,
          padding: "1rem",
          width: "20vw",
          borderBox: "content-box",
        }}
      >
        <h2>Blink Lobotomy</h2>
      </div>
      {/* <div
        onClick={() => setHide(!hide)}
        style={{
          position: "absolute",
          left: "200px",
          background: "grey",
          width: 20,
          height: 60,
          zIndex: 3,
          borderRadius: "0 0.5rem 0.5rem 0",
        }}
      >
        👁️
      </div> */}
    </>
  );
};

export default TitleColumn;
