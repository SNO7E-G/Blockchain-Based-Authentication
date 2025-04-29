import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Blockchain-Based Authentication
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              A secure, decentralized way to authenticate using Ethereum blockchain technology.
            </p>
            <div className="mt-8 flex justify-center">
              {isAuthenticated ? (
                <div className="inline-flex rounded-md shadow">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="inline-flex rounded-md shadow">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Features
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Decentralized Login</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Log in securely using your Ethereum wallet instead of traditional username and password.
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Smart Contract Security</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    User credentials are secured by Ethereum smart contracts, providing immutable and tamper-proof storage.
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Token-Based Authentication</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    JWT tokens are issued upon successful authentication for secure API access.
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Activity Logging</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    All authentication attempts and transactions are securely logged on the blockchain.
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Multi-Factor Authentication</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Additional security layers can be implemented for enhanced protection.
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Cross-Platform Support</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Works across different devices and browsers for a seamless experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 