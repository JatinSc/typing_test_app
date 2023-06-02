import React, { useState, useEffect } from "react";
import "./App.css";
import Alert from "react-bootstrap/Alert";

const App = () => {
  const [key, setKey] = useState(
    ["a", "s", "d", "f", "j", "k", "l", ";"].sort((a, b) => 0.5 - Math.random())
  );
  const [buttonState, setButtonState] = useState(
    Array(key.length).fill("default")
  );
  const [end, setEnd] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [enterKey, setEnterKey] = useState();
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState({ min: 0, sec: 0 });
  const [startTime, setStartTime] = useState(false);

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
      }, 300);
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
            endTest();
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
    setEnd(true)
    setStartTime(false);
    setEnterKey("");
    setButtonState(Array(key.length).fill("default"));
    setIndex(0);
    setTime({ min: 0, sec: 0 });
    setIsPause(false)
  };

  const restartTest = () => {
    setEnd(false)
    setStartTime(false);
    setKey(key.sort(() => 0.5 - Math.random()));
    setEnterKey("");
    setButtonState(Array(key.length).fill("default"));
    setIndex(0);
    setTime({ min: 0, sec: 0 });
    setCorrect(0);
    setWrong(0);
    setIsPause(false)
  };
  return (
    <main className="container">
      <div className="head">
        <div class="tooltip">
          <span class="tooltiptext">Case sensitive</span>
          <i className="bi bi-info-circle"></i>
        </div>

        <h1>Typing Test</h1>
        {time.sec <= 0 ? (
          <i class="bi bi-hearts"></i>
        ) : isPause ? (
          <i
            class="bi bi-caret-right-square"
            onClick={() => {
              setIsPause(false), setStartTime(true);
            }}
          ></i>
        ) : (
          <i
            class="bi bi-pause-circle"
            onClick={() => {
              setIsPause(true), setStartTime(false);
            }}
          ></i>
        )}
      </div>
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
        disabled={end}
        autoFocus
        placeholder="start typing"
        onChange={(e) => checkCharacters(e.target.value)}
        value={enterKey}
      ></input>
      <div style={{ display: "flex", gap: "20px" }}>
        <button className="button" onClick={() => restartTest()}>
          Restart
        </button>
        <button
          className="button"
          disabled={time.sec <= 0}
          onClick={() => endTest()}
        >
          End
        </button>
      </div>
      <div className="results">
        <p>{`accuracy : ${
          correct + wrong > 1
            ? ((correct / (correct + wrong)) * 100).toFixed(2)
            : "0"
        } %`}</p>
        <p>{`Total keys Pressed : ${correct+wrong}`}</p>
      </div>
      <div></div>
    </main>
  );
};

export default App;
