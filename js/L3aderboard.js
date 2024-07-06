import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

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
const RPC_URL = "https://virtual.fraxtal.rpc.tenderly.co/1a83593c-46ea-4fa9-8062-7294948133d0";

let signer = null;
let provider = new ethers.JsonRpcProvider(RPC_URL);

const fraxtaL3aderboard = {
  resetHighscore: async () => {
    const result = await fraxtaL3aderboardContract.connect(signer).resetHighscore();
    console.log(`resetHighscore result: ${result}`);
  },
  updateHighscore: async (highScore) => {
    const oldHighScore = fraxtaL3aderboard.getHighscore(signer.address);
    if (oldHighScore >= highScore) {
      console.log(`No high score.`);
      return;
    }
    const result = await fraxtaL3aderboardContract.connect(signer).updateHighscore(highScore);
    console.log(`updateHighscore result: ${result}`);
  },

  getName: async (address) => {
    const result = await fraxtaL3aderboardContract.connect(provider).getName(address);
    console.log(`getName result: ${result}`)
    return result;
  },

  getHighscore: async (address) => {
    const result = await fraxtaL3aderboardContract.connect(provider).getHighscore(address);
    console.log(`getHighscore result: ${result}`)
    return result;
  },

  getHighscoreLength: async () => {
    const result = await fraxtaL3aderboardContract.connect(provider).getHighscoreLength();
    console.log(`getHighscoreLength result: ${result}`)
    return result;
  },

  getHighscoreByIndex: async (index) => {
    const result = await fraxtaL3aderboardContract.connect(provider).getHighscoreByIndex(index);
    console.log(`getHighscoreByIndex result: ${result}`)
    return result;
  },

  getAll: async (indexStart, indexEnd) => {
    const len = await fraxtaL3aderboard.getHighscoreLength();  
    let result = [];
    for (let i = 0; i < len; i++) {
        result.push(await fraxtaL3aderboard.getHighscoreByIndex(i));
    }
    result.sort((a, b) => b[1] > a[1]);
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
        provider = new ethers.JsonRpcProvider(RPC_URL);
      } else {

        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Ensure MetaMask is connected to the custom L3 chain
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x2d7',
                chainName: 'FraxtaL3aderboard', // Replace with your L3 chain's name
                rpcUrls: [RPC_URL],
                nativeCurrency: {
                    name: 'FraxtaL3aderboardToken', // Replace with your L3 chain's token name
                    symbol: 'FXL3B', // Replace with your L3 chain's token symbol
                    decimals: 18
                },
                blockExplorerUrls: ['https://dashboard.tenderly.co/explorer/vnet/505969de-d873-40f0-8951-f0d3985c3553'] // Replace with your block explorer URL
            }]
        });

        // Create a new Web3Provider instance using MetaMask's provider
        const provider = new ethers.BrowserProvider(web3.currentProvider);
        signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Give from faucet
        const url = "https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-1ec160f1-f6d5-4003-a6ee-34baa046cdeb/default/trans?recipient=" + address;
        const headers = {
          "Content-Type": "application/json"
        };

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: headers,

          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          console.log(response); // Process or use the response data here
        } catch (error) {
          console.error('Error in faucet:', error);
        }
    
        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        document.getElementById('loginButton').innerHTML = "Logout from MetaMask";
        console.log("Login successful");
    
        // TODO: add loading highscore from leaderboard.
      }
    });
}

window.fraxtaL3aderboardProvider = provider;
window.dq = new ethers.Contract(fraxtaL3aderboardAddress, fraxtaL3aderboardABI, provider)
