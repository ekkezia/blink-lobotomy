import React from "react";
import Scoreboard from "./scoreboard";

const ScoreboardColumn = ({ isSubmitting }) => {
  return (
    <div
      className="column"
      style={{
        position: "relative",
        right: 0,
        padding: "1rem",
        width: "20vw",
        borderBox: "content-box",
      }}
    >
      <Scoreboard isSubmitting={isSubmitting} />
    </div>
  );
};

export default ScoreboardColumn;
