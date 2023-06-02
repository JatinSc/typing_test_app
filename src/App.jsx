import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [key, setKey] = useState(
    ["a", "s", "d", "f", "j", "k", "l", ";"].sort((a, b) => 0.5 - Math.random())
  );
  const [buttonState, setButtonState] = useState(
    Array(key.length).fill("default")
  );
  const [enterKey, setEnterKey] = useState();
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState({ min: 0, sec: 0 });
  const [startTime, setStartTime] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [isRestarted, setIsRestarted] = useState(false);


  const checkCharacters = (alphabets) => {
    setEnterKey(alphabets);
    setStartTime(true);
    if (key[index] === alphabets.split("")[alphabets.length - 1]) {
      setCorrect((prev) => prev + 1);
      const updatedState = [...buttonState];
      updatedState[index] = "correct";
      setButtonState(updatedState);
    } else {
      setWrong((prev) => prev + 1);
      const updatedState = [...buttonState];
      updatedState[index] = "incorrect";
      setButtonState(updatedState);
    }

    if (index === key.length - 1) {
      setTimeout(() => {
        setKey(key.sort((a, b) => 0.5 - Math.random()));
        setEnterKey("");
        setButtonState(Array(key.length).fill("default"));
        setIndex(0);
      }, 500);
    }
    setIndex((prev) => prev + 1);
    // console.log(word.split("")[word.length - 1]);
  };

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        // Update the seconds
        setTime((prevTime) => {
          let updatedSec = prevTime.sec + 1;
          let updatedMin = prevTime.min;

          if (updatedSec === 60) {
            updatedSec = 0;
            updatedMin++;
          }

          if (updatedMin === 5) {
            setSpeed(Math.round(correct / 5 / (prevTime.sec / 60)));
            clearInterval(interval);
          }
          return { min: updatedMin, sec: updatedSec };
        });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [startTime, correct, time]);

  const endTest = () => {
    setStartTime(false);
    setEnterKey("");
    setButtonState(Array(key.length).fill("default"));
    setIndex(0);
    const totalSeconds = time.min * 60 + time.sec;
    const speed = Math.round((correct/ 5 / totalSeconds) * 60); // Calculate typing speed in characters per minute (CPM)
    setSpeed(speed);
    setTime({ min: 0, sec: 0 });
  };

  const restartTest = () =>{
    setStartTime(false);
    setKey(key.sort(() => 0.5 - Math.random()));
    setEnterKey("");
    setButtonState(Array(key.length).fill("default"));
    setIndex(0);
    setTime({ min: 0, sec: 0 });
    setSpeed(0);
    setCorrect(0);
    setWrong(0);
  }
  return (
    <main className="container">
      <h1>Typing Test</h1>
      <div className="header">
        <p>{`Time : ${time.min} min  ${time.sec} sec`}</p>
        <small>{"time limit : 5min"}</small>
        <p style={{ color: "rgb(239, 33, 116)" }}>{`Correct : ${correct}`}</p>
        <p style={{ color: "red" }}>{`Wrong : ${wrong}`}</p>
      </div>
      <div className="keys">
        {key.map((alphabet, index) => (
          <button key={index} id={buttonState[index]}>
            {alphabet}
          </button>
        ))}
      </div>
      <input
        placeholder="start typing"
        onChange={(e) => checkCharacters(e.target.value)}
        value={enterKey}
      ></input>
      <div style={{display:"flex",gap:"20px"}}>
      <button className="button" onClick={() => restartTest()}>
        Restart
      </button>
      <button className="button" disabled={time.sec<=0} onClick={() => endTest()}>
        Calculate
      </button>
      </div>
      <div className="results">
        {speed > 0 ? <p>speed : {speed} CPM</p>:<p>speed : CPM</p>}</div>
    </main>
  );
};

export default App;
