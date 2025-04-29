# Blockchain-Based Authentication System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/SNO7E-G/blockchain-based-authentication/actions)
[![Author: Mahmoud Ashraf (SNO7E)](https://img.shields.io/badge/Author-SNO7E-blue)](https://github.com/SNO7E-G)

---

A **secure, decentralized authentication system** built with JavaScript, React, and Ethereum blockchain. This project demonstrates modern blockchain-based login, credential management, and user experience best practices.

---

## 🚀 Features

- **Decentralized Login**: Authenticate with your Ethereum wallet (MetaMask, WalletConnect, etc.)
- **Secure Credentials**: User credentials are stored immutably on the blockchain
- **Smart Contracts**: Ethereum smart contracts manage registration and authentication
- **Token-Based Authentication**: JWT tokens for secure API access
- **User Registration**: Register your Ethereum address and username
- **Activity Logging**: All authentication attempts and transactions are logged on-chain
- **Multi-Factor Authentication**: Extendable for MFA (e.g., Google Authenticator)
- **Cross-Platform Support**: Works on all modern browsers and devices
- **Modern UI/UX**: Responsive, accessible, and beautiful interface with Tailwind CSS

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Blockchain**: Ethereum, Solidity, Hardhat
- **Web3 Libraries**: ethers.js, web3.js, web3modal
- **Backend/Server**: Node.js, Express (for API/JWT if needed)
- **Authentication**: JWT (JSON Web Token)
- **Testing**: Hardhat, Mocha/Chai

---

## 📦 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MetaMask or any Ethereum wallet
- Infura or Alchemy API key (for testnet/mainnet deployment)

### Installation

```bash
git clone https://github.com/SNO7E-G/blockchain-based-authentication.git
cd blockchain-based-authentication
npm install
```

### Environment Setup
Create a `.env` file in the root directory:
```env
PRIVATE_KEY=your_ethereum_private_key_here
INFURA_API_KEY=your_infura_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### Compile & Deploy Smart Contracts
```bash
npx hardhat compile
npx hardhat node # In a separate terminal for local blockchain
npx hardhat run scripts/deploy.js --network localhost
```

### Start the App
```bash
npm start
```

---

## 🧑‍💻 Usage

1. **Register**: Go to `/register`, enter a username, connect your wallet, and sign the message.
2. **Login**: Go to `/login`, connect your wallet, and sign the authentication message.
3. **Dashboard**: View your blockchain-based profile, authentication history, and manage your account.

---

## 📄 Smart Contract
- Solidity contract: [`src/contracts/AuthenticationContract.sol`](src/contracts/AuthenticationContract.sol)
- Interact using Hardhat console:
  ```bash
  npx hardhat console --network localhost
  ```

---

## 🧪 Testing
```bash
npx hardhat test
```

---

## 🚀 Deployment
- **Goerli Testnet**:
  ```bash
  npx hardhat run scripts/deploy.js --network goerli
  ```
- **Ethereum Mainnet**:
  ```bash
  npx hardhat run scripts/deploy.js --network mainnet
  ```

---

## 🔒 Security Best Practices
- **Never commit private keys** to version control
- Use `.env` for all secrets and sensitive data
- All authentication is signature-based (no passwords transmitted)
- Smart contract code is open and auditable
- Consider gas costs and rate limiting for production

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
- Fork the repo
- Create a new branch (`git checkout -b feature/your-feature`)
- Commit your changes (`git commit -am 'Add new feature'`)
- Push to the branch (`git push origin feature/your-feature`)
- Open a Pull Request

---

## 📢 Author & License

**Author:** [Mahmoud Ashraf (SNO7E)](https://github.com/SNO7E-G)

**GitHub:** [https://github.com/SNO7E-G](https://github.com/SNO7E-G)

**Email:** sno7e.dev@gmail.com

**License:** MIT

---

© 2024 Mahmoud Ashraf (SNO7E). All rights reserved.

---

> _"Empowering secure, decentralized identity for the next generation of web applications."_ 