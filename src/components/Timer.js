import React, { useEffect, useState } from "react";

const zFormat = (string) => {
  let res = string.toString();
  if (res.length < 2) {
    res = "0" + res;
  }
  return res;
};

const Timer = ({ style, start }) => {

    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);

  useEffect( () => {
    let myVar = setInterval(() => {
      let d = new Date(Date.now() - start);
      setHours(d.getHours() - 1);
      setMinutes(d.getMinutes());
      setSeconds(d.getSeconds());
      }, 1000);
    return clearInterval(myVar)
  } , [start])

  return (
    <div style={style}>
      {`${zFormat(hours)}:${zFormat(minutes)}:${zFormat(seconds)}`}
    </div>
  );
};

export default Timer;
