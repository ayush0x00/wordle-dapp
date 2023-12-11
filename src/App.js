import React, { useState, useEffect } from "react";
import "./App.css";
import Game from "./components/Game";
import { Types, AptosClient } from "aptos";
import { Provider, Network } from "aptos";

// Create an AptosClient to interact with devnet.
const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");
const provider = new Provider(Network.DEVNET);

const address =
  "0x0fc6f90cffc13c8eb5312cfe1ed45f716a59cdfe524deef655bc1fe94408a2d8";


function App() {
  const [address, setAddress] = useState(null);
  const [account, setAccount] = useState(null);

  const darkHandler = (dark) => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const testContract = async () => {
    const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");
    const provider = new Provider(Network.DEVNET);

    const transaction = {
      type: "entry_function_payload",
      function: `${address}::test5::populate_word`,
      arguments: [5, [97, 112, 116, 111, 115]],
      type_arguments: [],
    };

    const keyPress = {
      type: "entry_function_payload",
      function: `${address}::test5::pressedKey`,
      arguments: [1, 0, 0, 117],
      type_arguments: [],
    };

    try {
      await window.aptos.signAndSubmitTransaction(transaction);
      const key = await window.aptos.signAndSubmitTransaction(keyPress);
      console.log(key);
      const res2 = await provider.getAccountResource(
        "0x0fc6f90cffc13c8eb5312cfe1ed45f716a59cdfe524deef655bc1fe94408a2d8",
        `${address}::test5::IdToWordle`
      );
      console.log(res2);
    } catch (err) {
      console.log(err);
    }
  };

  const init = async () => {
    try {
      const { address: connectedAddress } = await window.aptos.connect();
      setAddress(connectedAddress);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!address) return;
    const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");
    client.getAccount(address).then(setAccount);
  }, [address]);

  return (
    <div className={`app dark:bg-zinc-800`}>
      <Game darkness={darkHandler} />
      <div className="App">
        <p>
          Account Address: <code>{address}</code>
        </p>
        <p>
          Sequence Number: <code>{account?.sequence_number}</code>
        </p>
        <button onClick={testContract}>Click meeee</button>
      </div>
    </div>
  );
}

export default App;
