import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  connectWallet, 
  registerUser, 
  loginUser, 
  signMessage,
  getUserInfo
} from '../utils/web3';
import {
  generateNonce,
  generateAuthMessage,
  generateToken,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,
  getAuthenticatedUser
} from '../utils/auth';

// Create the authentication context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [walletInfo, setWalletInfo] = useState({
    address: null,
    provider: null,
    signer: null,
    chainId: null,
    connected: false
  });
  const [networkName, setNetworkName] = useState('localhost');
  
  // Initialize authentication state from local storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = getAuthenticatedUser();
          if (userData) {
            setUser({
              address: userData.address,
              username: userData.username
            });
            
            // Optional: Reconnect to wallet if user is already authenticated
            // Only do this if you want auto-reconnect functionality
            // const wallet = await connectWallet();
            // setWalletInfo(wallet);
          }
        }
      } catch (error) {
        console.error("Error initializing authentication:", error);
        // Clear any invalid auth state
        removeAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Connect to Ethereum wallet
  const connect = async () => {
    setLoading(true);
    try {
      const wallet = await connectWallet();
      setWalletInfo(wallet);
      
      // Determine network name from chain ID
      if (wallet.chainId) {
        // This is a simplified mapping - expand as needed
        const networks = {
          1: 'mainnet',
          3: 'ropsten',
          4: 'rinkeby',
          5: 'goerli',
          42: 'kovan',
          1337: 'localhost',
          31337: 'hardhat'
        };
        setNetworkName(networks[wallet.chainId.toString()] || 'localhost');
      }
      
      return wallet;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Disconnect wallet
  const disconnect = () => {
    setWalletInfo({
      address: null,
      provider: null,
      signer: null,
      chainId: null,
      connected: false
    });
    
    // If you want to log out the user when disconnecting wallet
    // logout();
  };
  
  // Register a new user
  const register = async (username, hashedPassword = '') => {
    setLoading(true);
    try {
      if (!walletInfo.connected) {
        await connect();
      }
      
      const result = await registerUser(
        walletInfo.signer,
        username,
        hashedPassword,
        networkName
      );
      
      if (result.success) {
        // After successful registration, authenticate the user
        await authenticate(username);
        return result;
      } else {
        throw new Error(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Authenticate user (sign message and create JWT)
  const authenticate = async (username) => {
    setLoading(true);
    try {
      if (!walletInfo.connected) {
        await connect();
      }
      
      // Generate a nonce and authentication message
      const nonce = generateNonce();
      const message = generateAuthMessage(nonce);
      
      // Request user to sign the message
      const signResult = await signMessage(walletInfo.signer, message);
      
      if (!signResult.success) {
        throw new Error(signResult.error || "Signature failed");
      }
      
      // Login using the blockchain contract
      const loginResult = await loginUser(walletInfo.signer, networkName);
      
      if (!loginResult.success) {
        throw new Error(loginResult.error || "Login failed");
      }
      
      // Get user info from the blockchain
      const userInfoResult = await getUserInfo(
        walletInfo.signer,
        walletInfo.address,
        networkName
      );
      
      if (!userInfoResult.success) {
        throw new Error(userInfoResult.error || "Failed to get user info");
      }
      
      // Generate and store JWT token
      const token = generateToken(walletInfo.address, username || userInfoResult.username);
      setAuthToken(token);
      
      // Update user state
      setUser({
        address: walletInfo.address,
        username: username || userInfoResult.username
      });
      
      return {
        success: true,
        user: {
          address: walletInfo.address,
          username: username || userInfoResult.username
        }
      };
    } catch (error) {
      console.error("Error authenticating user:", error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Log out
  const logout = () => {
    removeAuthToken();
    setUser(null);
  };
  
  // Context value
  const value = {
    user,
    walletInfo,
    loading,
    networkName,
    connect,
    disconnect,
    register,
    authenticate,
    logout,
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 