"use client";

import { useState } from "react";

interface WalletConnectorProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export default function WalletConnector({ onConnect, onDisconnect }: WalletConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  
  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate random wallet address and balance
      const randomAddress = `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`;
      const randomBalance = parseFloat((Math.random() * 10).toFixed(2));
      
      setWalletAddress(randomAddress);
      setWalletBalance(randomBalance);
      setIsConnected(true);
      onConnect(randomAddress);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    setWalletBalance(0);
    onDisconnect();
  };
  
  return (
    <div className="wallet-connector">
      {isConnected ? (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">{walletAddress}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Balance: {walletBalance} SOL
          </div>
          <button 
            onClick={disconnectWallet}
            className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          onClick={connectWallet} 
          disabled={isConnecting}
          className="wallet-button"
        >
          {isConnecting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </span>
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
      )}
    </div>
  );
}
