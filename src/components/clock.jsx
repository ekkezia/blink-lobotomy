import React, { useState } from "react";

const Clock = () => {
  let time = new Date().toLocaleTimeString();
  let [ctime, setCTime] = useState();
  const updateTime = () => {
    time = new Date().toLocaleTimeString();
    setCTime(time);
  };
  setInterval(updateTime, 1000);
  return (
    <>
      <p> {ctime}.</p>
    </>
  );
};
export default Clock;
