import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
let signer = null;
let provider;

const fraxtaL3aderboardABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "key",
        "type": "bytes32"
      }
    ],
    "name": "EnumerableMapNonexistentKey",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getHighscore",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "highscore",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getHighscoreByIndex",
    "outputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "highscore",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getHighscoreLength",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getName",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "resetHighscore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newHighscore",
        "type": "uint256"
      }
    ],
    "name": "updateHighscore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "updatePlayerName",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const fraxtaL3aderboardAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
const fraxtaL3aderboardContract = new ethers.Contract(fraxtaL3aderboardAddress, fraxtaL3aderboardABI);

const fraxtaL3aderboard = {
  resetHighscore: async () => {
    const result = await fraxtaL3aderboardContract.connect(signer).resetHighscore();
    console.log(`resetHighscore result: ${result}`);
  },
  updateHighscore: async (highScore) => {
    if (fraxtaL3aderboard.getHighscore(signer.address) >= highScore) {
      console.log(`No high score.`);
      return;
    }
    const result = await fraxtaL3aderboardContract.connect(signer).updateHighscore(highScore);
    console.log(`updateHighscore result: ${result}`);
  },

  getName: async (address) => {
    const result = await fraxtaL3aderboardContract.getName(address);
    console.log(`getName result: ${result}`)
    return result;
  },

  getHighscore: async (address) => {
    const result = await fraxtaL3aderboardContract.getHighscore(address);
    console.log(`getHighscore result: ${result}`)
    return result;
  },

  getHighscoreLength: async () => {
    console.log(signer);
    const result = await fraxtaL3aderboardContract.getHighscoreLength();
    console.log(`getHighscoreLength result: ${result}`)
    return result;
  },

  getHighscoreByIndex: async (index) => {
    const result = await fraxtaL3aderboardContract.getHighscoreByIndex(index);
    console.log(`getHighscoreByIndex result: ${result}`)
    return result;
  },

  getIndexRange: async (indexStart, indexEnd) => {
    let result = [];
    for (let i = indexStart; i < indexEnd; i++) {
        result.push(fraxtaL3aderboard.getHighscoreByIndex(i));
    }
    return result;
  }
};

window.fraxtaL3aderboardContract = fraxtaL3aderboardContract;
window.fraxtaL3aderboard = fraxtaL3aderboard;

const awawa = document.getElementById('loginButton');

if (awawa) {
    awawa.addEventListener('click', async () => {
      if (signer != null)
      {
        signer = null;
        document.getElementById('loginButton').innerHTML = "Login with MetaMask";
        console.log("Logout successful");
        return;
      }
      if (window.ethereum == null) {
        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed,
        // so they only have read-only access
        console.log("MetaMask not installed; using read-only defaults");
        alert("MetaMask not installed, please install to use FraxtaL3aderboard.");
        provider = ethers.getDefaultProvider();
        signer = await provider.getSigner();
      } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum);
    
        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        signer = await provider.getSigner();
        document.getElementById('loginButton').innerHTML = "Logout from MetaMask";
        console.log("Login successful");
    
        // TODO: add loading highscore from leaderboard.
      }
    });
} else {
    provider = ethers.getDefaultProvider();
    signer = await provider.getSigner();
}