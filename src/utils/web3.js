import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

// Import contract ABI when it's available after compilation
// This will be generated after running the Hardhat compile task
let cachedContract = null;
let contractAddress = null;
let contractABI = null;

// Function to initialize the Web3Modal for wallet connection
export const initWeb3Modal = () => {
  const providerOptions = {};
  
  const web3Modal = new Web3Modal({
    network: "mainnet", // Can be "mainnet", "rinkeby", etc.
    cacheProvider: true,
    providerOptions
  });
  
  return web3Modal;
};

// Connect to wallet
export const connectWallet = async () => {
  try {
    const web3Modal = initWeb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    // Get chain ID to determine network
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    
    return {
      address,
      provider,
      signer,
      chainId,
      connected: true
    };
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    return {
      address: null,
      provider: null,
      signer: null,
      chainId: null,
      connected: false
    };
  }
};

// Load contract from deployments based on network
export const loadContractData = async (networkName) => {
  try {
    // Dynamically import deployment data based on network
    const deploymentData = await import(`../deployments/${networkName}.json`);
    contractAddress = deploymentData.authContractAddress;
    
    // Dynamically import contract ABI from artifacts
    const contractData = await import('../artifacts/src/contracts/AuthenticationContract.sol/AuthenticationContract.json');
    contractABI = contractData.abi;
    
    return { address: contractAddress, abi: contractABI };
  } catch (error) {
    console.error("Error loading contract data:", error);
    return null;
  }
};

// Get contract instance
export const getContract = async (signer, networkName = 'localhost') => {
  if (!contractAddress || !contractABI) {
    const contractData = await loadContractData(networkName);
    if (!contractData) return null;
  }
  
  if (!cachedContract) {
    cachedContract = new ethers.Contract(contractAddress, contractABI, signer);
  }
  
  return cachedContract;
};

// Register user
export const registerUser = async (signer, username, hashedPassword = '', networkName = 'localhost') => {
  try {
    const contract = await getContract(signer, networkName);
    if (!contract) throw new Error("Contract not loaded");
    
    const tx = await contract.registerUser(username, hashedPassword);
    await tx.wait();
    
    return {
      success: true,
      transaction: tx.hash
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Login user
export const loginUser = async (signer, networkName = 'localhost') => {
  try {
    const contract = await getContract(signer, networkName);
    if (!contract) throw new Error("Contract not loaded");
    
    const tx = await contract.login();
    await tx.wait();
    
    return {
      success: true,
      transaction: tx.hash
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Sign a message for authentication
export const signMessage = async (signer, message) => {
  try {
    const signature = await signer.signMessage(message);
    return {
      success: true,
      signature
    };
  } catch (error) {
    console.error("Error signing message:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Verify a signature
export const verifySignature = async (signer, message, signature, networkName = 'localhost') => {
  try {
    const contract = await getContract(signer, networkName);
    if (!contract) throw new Error("Contract not loaded");
    
    const isValid = await contract.verifySignature(message, signature);
    
    return {
      success: true,
      isValid
    };
  } catch (error) {
    console.error("Error verifying signature:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get user information
export const getUserInfo = async (signer, userAddress, networkName = 'localhost') => {
  try {
    const contract = await getContract(signer, networkName);
    if (!contract) throw new Error("Contract not loaded");
    
    const userInfo = await contract.getUserInfo(userAddress);
    
    return {
      success: true,
      username: userInfo[0],
      isActive: userInfo[1],
      registrationTime: new Date(userInfo[2].toNumber() * 1000),
      lastLoginTime: userInfo[3].toNumber() ? new Date(userInfo[3].toNumber() * 1000) : null
    };
  } catch (error) {
    console.error("Error getting user info:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Check if a user is registered
export const isUserRegistered = async (signer, userAddress, networkName = 'localhost') => {
  try {
    const contract = await getContract(signer, networkName);
    if (!contract) throw new Error("Contract not loaded");
    
    const isRegistered = await contract.isUserRegistered(userAddress);
    
    return {
      success: true,
      isRegistered
    };
  } catch (error) {
    console.error("Error checking if user is registered:", error);
    return {
      success: false,
      error: error.message
    };
  }
}; 