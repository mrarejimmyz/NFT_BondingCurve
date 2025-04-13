"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NFTCardProps {
  id: string;
  name: string;
  imageUrl: string;
  collectionName: string;
  price: number;
  owner: string;
}

export default function NFTCard({ id, name, imageUrl, collectionName, price, owner }: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="nft-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="nft-image">
          <Image 
            src={imageUrl} 
            alt={name} 
            width={300} 
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        </div>
        
        <div className="absolute top-2 right-2">
          <span className="badge-primary">
            {collectionName}
          </span>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold truncate">{name}</h3>
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
            <p className="text-lg font-bold">{price} SOL</p>
          </div>
          <Link href={`/nft/${id}`}>
            <button className="btn-primary text-sm">
              {isHovered ? "View Details" : "Buy Now"}
            </button>
          </Link>
        </div>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 truncate">
          Owner: {owner}
        </div>
      </div>
    </div>
  );
}
