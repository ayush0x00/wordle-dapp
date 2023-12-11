import { useEffect, useState } from "react";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { Provider, Network } from "aptos";

const address =
  "0x0fc6f90cffc13c8eb5312cfe1ed45f716a59cdfe524deef655bc1fe94408a2d8";

const keyboard = {
  line1: "QWERTYUIOP",
  line2: "ASDFGHJKL",
  line3: "ZXCVBNM",
};

let defaultLetters = [];

"abcdefjhijklmnopqrstuvwxyz".split("").forEach((i) => {
  defaultLetters[i] = "";
});

function Key(props) {
  const [state, setState] = useState("bg-gray-200 hover:bg-gray-300 dark:bg-zinc-400 dark:text-white dark:hover:bg-zinc-500");

  const x = props.value.length === 1 ? "w-7 sm:w-10 " : "p-2 sm:p-4 ";
  const returnKey = () => {
    props.getKey(props.value);
  };

  useEffect(() => {
    setTimeout(() => {
      if (props.state === "C") setState("bg-correct text-white");
      if (props.state === "E") setState("bg-exist text-white");
      if (props.state === "N") setState("bg-wrong text-white dark:bg-gray-600");
    }, 350);
  }, [props.state]);

  return (
    <button
      className={
        x +
        state +
        " h-14 300 grid items-center rounded font-semibold cursor-pointer"
      }
      onClick={returnKey}
    >
      {props.value === "DEL" ? <BackspaceIcon /> : props.value}
    </button>
  );
}

function KeyBoard(props) {
  const [letters, setletters] = useState(defaultLetters);
  const [keyPresses, setKeyPresses] = useState([]);
  useEffect(() => {
    setletters(props.letters);
  }, [props.changed]);

  const keyHandler = (value) => {
    if (value === "DEL") {
      // If "DEL" is pressed, remove the last key press entry
      setKeyPresses((prevKeyPresses) => prevKeyPresses.slice(0, -1));
    } else {
      // Otherwise, add a new key press entry
      setKeyPresses((prevKeyPresses) => [...prevKeyPresses, value]);
    }
  };

  const handleEnterPress = async () => {
    // Loop through key presses and send transactions
    for (const pressedKey of keyPresses) {
      const keyPressTransaction = {
        type: "entry_function_payload",
        function: `${props.address}::test4::pressedKey`,
        arguments: [1, 0, 0, pressedKey.charCodeAt(0)],
        type_arguments: [],
      };
      try {
        const key = await window.aptos.signAndSubmitTransaction(keyPressTransaction);
      } catch (err) {
        console.error(err);
      }
    }
    const provider = new Provider(Network.DEVNET);

    const res2 = await provider.getAccountResource(
      address,
      "0x0fc6f90cffc13c8eb5312cfe1ed45f716a59cdfe524deef655bc1fe94408a2d8::test5::IdToWordle"
    );
    console.log(res2);


    // Clear key presses after handling them
    setKeyPresses([]);
  };

  return (
    <div className="flex flex-col items-center w-100 pb-5">
      <div className="flex gap-1 my-0.5 w-fit">
        {keyboard.line1.split("").map((value, key) => (
          <Key
            getKey={keyHandler}
            value={value}
            key={key}
            state={letters[value]}
          />
        ))}
      </div>
      <div className="flex gap-1 my-0.5 w-fit">
        {keyboard.line2.split("").map((value, key) => (
          <Key
            getKey={keyHandler}
            value={value}
            key={key}
            state={letters[value]}
          />
        ))}
      </div>
      <div className="flex gap-1 my-0.5 w-fit">
        <Key value="ENTER" getKey={keyHandler} />
        {keyboard.line3.split("").map((value, key) => (
          <Key
            getKey={keyHandler}
            value={value}
            key={key}
            state={letters[value]}
          />
        ))}
        <Key value="DEL" getKey={keyHandler} />
      </div>
    </div>
  );
}

export default KeyBoard;
