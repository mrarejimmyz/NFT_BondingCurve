"use client";

import { useState } from "react";
import NFTCard from "@/components/nft/NFTCard";

interface NFTGridProps {
  collections?: boolean;
}

export default function NFTGrid({ collections = false }: NFTGridProps) {
  // Mock data for NFTs
  const mockNFTs = [
    {
      id: "1",
      name: "Cosmic Degen #001",
      imageUrl: "https://picsum.photos/seed/nft1/300/300",
      collectionName: "Cosmic Degens",
      price: 1.25,
      owner: "8xH5...7Gh9"
    },
    {
      id: "2",
      name: "Pixel Punk #042",
      imageUrl: "https://picsum.photos/seed/nft2/300/300",
      collectionName: "Pixel Punks",
      price: 2.5,
      owner: "3jK9...2Lm4"
    },
    {
      id: "3",
      name: "Moon Ape #103",
      imageUrl: "https://picsum.photos/seed/nft3/300/300",
      collectionName: "Moon Apes",
      price: 3.75,
      owner: "5pQ7...9Zx3"
    },
    {
      id: "4",
      name: "Crypto Cat #217",
      imageUrl: "https://picsum.photos/seed/nft4/300/300",
      collectionName: "Crypto Cats",
      price: 1.8,
      owner: "2rT6...4Vb8"
    },
    {
      id: "5",
      name: "Space Voyager #055",
      imageUrl: "https://picsum.photos/seed/nft5/300/300",
      collectionName: "Space Voyagers",
      price: 4.2,
      owner: "7mN3...1Cd5"
    },
    {
      id: "6",
      name: "Digital Dream #099",
      imageUrl: "https://picsum.photos/seed/nft6/300/300",
      collectionName: "Digital Dreams",
      price: 2.1,
      owner: "9sF4...6Hj2"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {mockNFTs.map((nft) => (
        <NFTCard
          key={nft.id}
          id={nft.id}
          name={nft.name}
          imageUrl={nft.imageUrl}
          collectionName={nft.collectionName}
          price={nft.price}
          owner={nft.owner}
        />
      ))}
    </div>
  );
}
