import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';

// Secret key for JWT token generation (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Authentication message template
const AUTH_MESSAGE_TEMPLATE = 'Sign this message to authenticate with Blockchain Authentication: %NONCE%';

// Generate a random nonce
export const generateNonce = () => {
  return ethers.utils.hexlify(ethers.utils.randomBytes(16));
};

// Generate an authentication message with a nonce
export const generateAuthMessage = (nonce) => {
  return AUTH_MESSAGE_TEMPLATE.replace('%NONCE%', nonce);
};

// Generate a JWT token for an authenticated user
export const generateToken = (userAddress, username) => {
  const tokenData = {
    address: userAddress,
    username: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours expiry
  };
  
  return jwt.sign(tokenData, JWT_SECRET);
};

// Verify a JWT token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      data: decoded
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};

// Set token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Remove token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  const { valid } = verifyToken(token);
  return valid;
};

// Get authenticated user data
export const getAuthenticatedUser = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  const { valid, data } = verifyToken(token);
  return valid ? data : null;
}; 