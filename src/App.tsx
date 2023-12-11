import React from "react";
import "./App.css";
import { Types, AptosClient } from "aptos";
import { Provider, Network } from "aptos";

// Create an AptosClient to interact with devnet.
const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");
const provider = new Provider(Network.DEVNET);

const address =
  "0x0fc6f90cffc13c8eb5312cfe1ed45f716a59cdfe524deef655bc1fe94408a2d8";

const testContract = async () => {
  const transaction = {
    type:"entry_function_payload",
    function: `${address}::test4::populate_word`,
    arguments: [1, [97, 112, 116, 111, 115]],
    type_arguments: [],
  };
  //98,117
//account:&signer, _wordleId:u64, attempt:u8, idx:u8, key:u8
  const keyPress = {
    type:"entry_function_payload",
    function: `${address}::test4::pressedKey`,
    arguments: [1,0,0,117],
    type_arguments: [],
  }

  //decoding the hex in python hex = "0x6170746f73". exclude 0x and then bytearray.fromhex(hex).decode()
  try {
    // const res = await window.aptos.signAndSubmitTransaction(transaction);
    // console.log(res)
    const key = await window.aptos.signAndSubmitTransaction(keyPress);
    console.log(key)
    const res2 = await provider.getAccountResource(
      address,
      `${address}::test4::IdToWordle`
    );
    console.log(res2);
  } catch (err) {
    console.log(err);
  }
};

function App() {
  // Retrieve aptos.account on initial render and store it.
  const [address, setAddress] = React.useState<string | null>(null);

  /**
   * init function
   */
  const init = async () => {
    // connect
    const { address, publicKey } = await window.aptos.connect();
    setAddress(address);
  };

  React.useEffect(() => {
    init();
  }, []);

  const [account, setAccount] = React.useState<Types.AccountData | null>(null);
  React.useEffect(() => {
    if (!address) return;
    client.getAccount(address).then(setAccount);
  }, [address]);

  return (
    <div className="App">
      <p>
        Account Address: <code>{address}</code>
      </p>
      <p>
        Sequence Number: <code>{account?.sequence_number}</code>
      </p>
      <button onClick={testContract}>Click meeee</button>
    </div>
  );
}

export default App;
