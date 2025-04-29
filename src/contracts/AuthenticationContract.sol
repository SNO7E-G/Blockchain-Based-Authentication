// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title AuthenticationContract
 * @dev A contract for managing user authentication on the blockchain
 */
contract AuthenticationContract is Ownable {
    using ECDSA for bytes32;

    // User structure
    struct User {
        string username;
        string hashedPassword; // For optional password-based auth alongside wallet auth
        bool isActive;
        uint256 registrationTime;
        uint256 lastLoginTime;
    }

    // Mapping of user address to User struct
    mapping(address => User) private users;
    
    // Events
    event UserRegistered(address indexed userAddress, string username, uint256 timestamp);
    event UserLoggedIn(address indexed userAddress, uint256 timestamp);
    event UserDeactivated(address indexed userAddress, uint256 timestamp);
    event UserReactivated(address indexed userAddress, uint256 timestamp);

    /**
     * @dev Register a new user
     * @param _username User's chosen username
     * @param _hashedPassword Optional hashed password for multi-factor auth
     */
    function registerUser(string memory _username, string memory _hashedPassword) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(users[msg.sender].registrationTime == 0, "User already registered");
        
        users[msg.sender] = User({
            username: _username,
            hashedPassword: _hashedPassword,
            isActive: true,
            registrationTime: block.timestamp,
            lastLoginTime: 0
        });
        
        emit UserRegistered(msg.sender, _username, block.timestamp);
    }
    
    /**
     * @dev Log in a user
     * @return bool Returns true if login is successful
     */
    function login() external returns (bool) {
        require(users[msg.sender].registrationTime != 0, "User not registered");
        require(users[msg.sender].isActive, "User account is not active");
        
        users[msg.sender].lastLoginTime = block.timestamp;
        
        emit UserLoggedIn(msg.sender, block.timestamp);
        return true;
    }
    
    /**
     * @dev Verify a signed message from a user for authentication
     * @param _message The message that was signed
     * @param _signature The signature to verify
     * @return bool Returns true if signature is valid
     */
    function verifySignature(string memory _message, bytes memory _signature) external view returns (bool) {
        require(users[msg.sender].registrationTime != 0, "User not registered");
        
        bytes32 messageHash = keccak256(abi.encodePacked(_message));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        return ethSignedMessageHash.recover(_signature) == msg.sender;
    }
    
    /**
     * @dev Get user information
     * @param _userAddress The address of the user
     * @return User's information (excluding hashed password)
     */
    function getUserInfo(address _userAddress) external view returns (
        string memory username,
        bool isActive,
        uint256 registrationTime,
        uint256 lastLoginTime
    ) {
        User storage user = users[_userAddress];
        require(user.registrationTime != 0, "User not registered");
        
        return (
            user.username,
            user.isActive,
            user.registrationTime,
            user.lastLoginTime
        );
    }
    
    /**
     * @dev Check if a user is registered
     * @param _userAddress The address to check
     * @return bool Returns true if the user is registered
     */
    function isUserRegistered(address _userAddress) external view returns (bool) {
        return users[_userAddress].registrationTime != 0;
    }
    
    /**
     * @dev Deactivate a user account (can be called by user or owner)
     * @param _userAddress The address of the user to deactivate
     */
    function deactivateUser(address _userAddress) external {
        require(msg.sender == _userAddress || msg.sender == owner(), "Not authorized");
        require(users[_userAddress].registrationTime != 0, "User not registered");
        require(users[_userAddress].isActive, "User already inactive");
        
        users[_userAddress].isActive = false;
        
        emit UserDeactivated(_userAddress, block.timestamp);
    }
    
    /**
     * @dev Reactivate a user account (can be called by user or owner)
     * @param _userAddress The address of the user to reactivate
     */
    function reactivateUser(address _userAddress) external {
        require(msg.sender == _userAddress || msg.sender == owner(), "Not authorized");
        require(users[_userAddress].registrationTime != 0, "User not registered");
        require(!users[_userAddress].isActive, "User already active");
        
        users[_userAddress].isActive = true;
        
        emit UserReactivated(_userAddress, block.timestamp);
    }
} 