# Quick Setup Guide

Follow these steps to get your Web3 wallet connection app running:

## 1. Get a WalletConnect Project ID

1. Visit [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up for a free account
3. Create a new project
4. Copy your Project ID

## 2. Create Environment File

Create a file named `.env.local` in the root directory and add:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=paste_your_project_id_here
NEXT_PUBLIC_ENABLE_TESTNETS=true
```

## 3. Run the Development Server

```bash
npm run dev
```

## 4. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 5. Connect Your Wallet

Click the "Connect Wallet" button and choose your preferred wallet to connect!

## Supported Wallets

RainbowKit supports many popular wallets including:
- MetaMask
- Rainbow
- Coinbase Wallet
- WalletConnect compatible wallets
- And many more!

## Supported Networks

- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Base
- Sepolia (testnet)

---

For more detailed information, see the [README.md](./README.md)

