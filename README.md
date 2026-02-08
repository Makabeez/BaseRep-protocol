# 🛡️ BaseRep Protocol

**BaseRep Protocol** is a futuristic decentralized application (dApp) built on the **Base blockchain**. It serves as a reputation layer, allowing users to verify their on-chain identity, analyze their transaction history, and mint a permanent "Architect Rank" as a professional footprint.

> **Live Demo:** [https://baserep.xyz](https://baserep.xyz)

---

## 🚀 Key Features

* **On-Chain DNA Analysis**: Real-time scanning of user transaction history on Base Mainnet to calculate a protocol reputation score.
* **Dynamic Reputation Scoring**: A specialized algorithm that converts on-chain activity into a visual score (up to 1000).
* **Rank Minting**: A one-click feature to mint an "Architect Rank" directly on Base for a nominal fee (0.10$ eq. in ETH), adding to the user's on-chain history.
* **Farcaster Frame v2 Integration**: Fully compatible with Farcaster's newest protocol, allowing users to verify their rank directly within Warpcast.
* **Cyberpunk Glassmorphism UI**: A high-performance, dark-mode interface designed for the 2026 Web3 aesthetic.

## 🛠️ Technical Stack

* **Framework**: Next.js 15 (App Router)
* **Blockchain Integration**: Wagmi, Viem, and Ethers.js
* **Wallet Connector**: RainbowKit
* **Styling**: Tailwind CSS & Lucide Icons
* **Deployment**: Hosted on a secure VPS with PM2 process management

## 📦 Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/makabeez/baserep-protocol.git](https://github.com/makabeez/baserep-protocol.git)
    cd baserep-protocol
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env.local` and add your RPC URLs and contract addresses.

4.  **Run Development Mode**:
    ```bash
    npm run dev
    ```

## 📱 Mobile & Wallet Compatibility

* **Base App**: Includes a `manifest.json` for seamless integration as a native-like app in Coinbase Wallet.
* **Warpcast**: Features specific OpenGraph and Frame v2 metadata for interactive social sharing.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

*Built with 💙 for the Base Ecosystem.*
