import { useState, useEffect } from "react";
import Board from "../Board";
import Error from "../Error";
import Help from "../Help";
import KeyBoard from "../KeyBoard";
import Modal from "../Modal";
import NavBar from "../NavBar";
import styles from "./style.module.css";

function Game(props) {
  const [letter, setLetter] = useState();
  const [changed, setChanged] = useState(false);
  const [letters, setLetters] = useState({});
  const [help, setHelp] = useState(false);
  const [clicked, setClicked] = useState(0);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);
  const [keyPresses, setKeyPresses] = useState([]);

  const onClickDown = (event) => {
    if (event.key === "Enter") {
      setLetter("ENTER");
      setClicked(clicked + 1);
      handleEnterPress();
    } else if (event.key === "Backspace") {
      // If "Backspace" is pressed, remove the last key press entry
      // setKeyPresses((prevKeyPresses) => prevKeyPresses.slice(0, -1));
      // setLetter("DEL");
      // setClicked(clicked - 1);
    } else if ("abcdefghijklmnopqrstuvwxyz".includes(event.key.toLowerCase())) {
      const newKeyPress = {
        type: "entry_function_payload",
        function: `0x0fc6f90cffc13c8eb5312cfe1ed45f716a59cdfe524deef655bc1fe94408a2d8::test5::pressedKey`,
        arguments: [1, Math.floor(clicked/6), clicked%6, event.key.charCodeAt(0)],
        type_arguments: [],
      };
      // console.log(newKeyPress);
      // Otherwise, add a new key press entry
      setLetter(event.key.toUpperCase());
      setClicked(clicked + 1);
      setKeyPresses([...keyPresses, newKeyPress]);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onClickDown);

    return () => window.removeEventListener("keydown", onClickDown);
  }, [keyPresses]);

  useEffect(() => {
    props.darkness(dark);
  }, [dark]);

  const keyHandler = (letterValue) => {
    setLetter(letterValue);
    setClicked(clicked + 1);
  };

  const LettersHandler = (lettersValue) => {
    setLetters(lettersValue);
    setChanged(!changed);
  };

  const handleEnterPress = async () => {
    // Loop through key presses and send transactions
    for (const keyPress of keyPresses) {
      try {
        console.log(keyPress)
        const key = await window.aptos.signAndSubmitTransaction(keyPress);
        console.log(key);
        // Handle the result as needed
      } catch (err) {
        console.error(err);
      }
    }

    // Clear key presses after handling them
    setKeyPresses([]);
  };

  return (
    <>
      {help && (
        <Modal title="How to play!" help={setHelp}>
          {" "}
          <Help />{" "}
        </Modal>
      )}
      {/* {clicked} */}
      {error && <Error>{error}</Error>}
      <div className={styles.game}>
        <NavBar help={setHelp} darkness={setDark} dark={dark} />
        <hr />
        <Board
          letter={letter}
          clicks={clicked}
          letters={LettersHandler}
          error={setError}
        />
        <KeyBoard keyHandler={keyHandler} letters={letters} changed={changed} />
        <button onClick={handleEnterPress}>Submit</button>
      </div>
    </>
  );
}

export default Game;
