import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const { connect, authenticate, isAuthenticated, loading } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleConnect = async () => {
    setError('');
    try {
      // First connect to the wallet
      const wallet = await connect();
      
      if (wallet.connected) {
        // Then authenticate the user
        const authResult = await authenticate();
        
        if (authResult.success) {
          navigate('/dashboard');
        } else {
          setError(authResult.error || 'Authentication failed. Are you registered?');
        }
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during login');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in with your Ethereum wallet
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              register a new account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <button
              onClick={handleConnect}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 4a1 1 0 00-1 1v4.586l-2.707 2.707a1 1 0 101.414 1.414l3-3a1 1 0 00.293-.707V5a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Connect Wallet
                </span>
              )}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <p className="text-gray-500">
              Make sure you have MetaMask or another Ethereum wallet installed.
            </p>
          </div>
        </div>
        
        <div className="mt-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Blockchain Authentication
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-center text-sm text-gray-500">
              <p>
                By signing in, you'll be asked to sign a message with your Ethereum wallet.
                This is a secure way to prove you own the wallet without sharing your private key.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 