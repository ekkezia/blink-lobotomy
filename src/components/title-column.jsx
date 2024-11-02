import React from "react";
import Clock from "./clock";

const TitleColumn = () => {
  return (
    <div>
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
      <p style={{ padding: "1rem" }}>ִֶָ𓂃 ࣪˖ ִֶָInfinite Scroll ˖ ִֶָ𓂃 ࣪˖ ִ</p>
      <p style={{ padding: "1rem" }}>
        Hong Kong, 02/11/2024 <Clock />
      </p>
      <p style={{ padding: "1rem" }}>
        Oh blink, a gentle, fleeting friend,
        <br />
        In shadows soft, our eyes you tend.
        <br />
        <br />
        You bring sweet drops to parched sight, <br />
        Guarding us from the screen’s harsh light. <br />
        With every wink, a shield you weave, <br />
        A break from sights that never leave. <br />
        You stop the screen's relentless glare, <br />
        In moisture's dance, you show you care. <br />
        <br />
        So join the race—a blink is all,
        <br />
        The healthiest contest in this hall. <br />
        <br />
        Look to the lens, let lashes meet, <br />
        A blink, a beat, your task complete. <br />
        For those who stare shall surely find, <br />
        The cost of screens upon the mind.
      </p>
      {/* <div
        onClick={() => setHide(!hide)}
        style={{
          position: "absolute",
          left: "200px",
          background: "grey",
          width: 20,
          height: 60,
          zIndex: 3,
        }}
      >
        👁️
      </div> */}
    </div>
  );
};

export default TitleColumn;
