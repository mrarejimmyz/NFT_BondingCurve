"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  
  const connectWallet = () => {
    // Simulate wallet connection
    setIsConnected(true);
    setWalletAddress("8xH5...7Gh9");
  };
  
  return (
    <header className="header py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold gradient-text">pump.fun</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
            Discover
          </Link>
          <Link href="/collections" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
            Collections
          </Link>
          <Link href="/create" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
            Create
          </Link>
          {isConnected && (
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">{walletAddress}</span>
            </div>
          ) : (
            <button onClick={connectWallet} className="wallet-button">
              <span>Connect Wallet</span>
            </button>
          )}
          
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
