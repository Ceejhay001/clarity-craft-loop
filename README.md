# CraftLoop: Artisanal NFT Marketplace

A decentralized marketplace for unique artisanal NFT products on the Stacks blockchain.

## Features
- Create and mint artisanal NFTs with detailed metadata
- List NFTs for sale with customizable prices
- Purchase NFTs using STX tokens
- Transfer NFT ownership
- View NFT details and history

## Setup and Installation
1. Clone the repository
2. Install Clarinet
3. Run `clarinet check` to verify contracts
4. Run `clarinet test` to execute test suite

## Usage Examples
```clarity
;; Mint a new artisanal NFT
(contract-call? .craft-loop mint-nft "Handcrafted Vase" "A unique ceramic vase" u1000 {artist: "John Doe", materials: "Clay"})

;; List NFT for sale
(contract-call? .craft-loop list-nft u1 u500000)

;; Purchase NFT
(contract-call? .craft-loop purchase-nft u1)
```

## Dependencies
- Clarity language
- Clarinet for testing and deployment
