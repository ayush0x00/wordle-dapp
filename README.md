# Aptos Wordle Game
This project is a Wordle clone built to run on the Aptos blockchain. It allows playing the original word guessing game while recording every key press on-chain for verification.

## Overview
The core game logic and React components provide the same Wordle flow - guessing a 5 letter word over 6 tries. To adapt it for blockchain, the Aptos client and Petra wallet are integrated to connect to devnet and sign transactions.

A smart contract deployed on devnet stores the solution, verifies guesses, and tracks player actions. By submitting key press transactions, the guess process is recorded immutably. The contract address is:

```
0x0fc6f90cffc13c8eb5312cfe1ed45f716a59cdfe524deef655bc1fe94408a2d8

```

Txn hash: [0x1888996cbd91bc612c8bed21cd3d18e894ac61b8a422f773d778f615c642c35d](https://explorer.aptoslabs.com/txn/4733544?network=devnet)


The front-end App displays data from the latest contract state to show the number of guesses, reveal the solution, and indicate letter correctness.

## Installation & Setup

### To run locally:
```
yarn install
yarn start
```
1. Open http://localhost:3000 to view the app.
2. Ensure the Petra browser extension is installed to inject the Aptos API and allow wallet connectivity.
3. Create or import an Aptos devnet account in Petra to play.

### Move contracts
The move contracts are present in the [my-move](./my-move/) directory. Make sure to replace the path of AptosFramework in the [Move.toml](./my-move/Move.toml) file with the path of the [aptos-framework](https://github.com/aptos-labs/aptos-core.git) repo. We tried importing the repo directly from github but it was causing some conflicts so we downloaded it locally for compiling, testing and publishing the contract.

### Technical Implementation
The app is bootstrapped with Create React App and has main components for:

1. App - Aptos Client, Wallet Integration
2. Game - State Management, Hooks
3. Board - Display Guesses
4. Keyboard - Handle Letter Clicks
5. index.jsx - Core Logic

## Game Flow
The gameplay flow involves:

Generating a random hidden word on-chain
Displaying the board to players
Players click letter buttons to guess
Submitting transactions for each key press
Calling contract to verify guess
Revealing guess results on the board
Repeating guesses until solved or lost
To enable this:

A useState hook manages app state
useEffect hooks update the board display
Event handlers capture keyboard clicks
AptosClient interactions read/write contract state
Future Goals
Possible extensions:

Multi-player gameplay
On-chain persistence of game results
Custom word lists per player
Rule variations (number of guesses)
Display historical game records

