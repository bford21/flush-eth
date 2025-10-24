# Flush ETH 🌈

A Next.js TypeScript application that enables users to connect their Web3 wallets using [RainbowKit](https://www.rainbowkit.com/).

## Features

- 🔐 Seamless wallet connection with RainbowKit
- ⚡ Built with Next.js 15 and TypeScript
- 🎨 Beautiful UI with Tailwind CSS
- 🌐 Multi-chain support (Ethereum Mainnet, Polygon, Optimism, Arbitrum, Base)
- 🧪 Optional testnet support (Sepolia)
- 📱 Responsive design

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Web3 Libraries:**
  - [RainbowKit](https://www.rainbowkit.com/) - Wallet connection UI
  - [Wagmi](https://wagmi.sh/) - React hooks for Ethereum
  - [Viem](https://viem.sh/) - TypeScript interface for Ethereum

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun package manager
- A WalletConnect Project ID (free, required for wallet connections)

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Get your WalletConnect Project ID at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Set to 'true' to enable testnets (Sepolia)
NEXT_PUBLIC_ENABLE_TESTNETS=true
```

#### Getting a WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID
5. Add it to your `.env.local` file

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
flush-eth/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page with wallet connection UI
│   ├── providers.tsx       # RainbowKit, Wagmi, and React Query providers
│   ├── wagmi.ts            # Wagmi configuration
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── .env.local              # Environment variables (create this)
└── package.json            # Dependencies
```

## Supported Chains

By default, the following networks are supported:

- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Base
- Sepolia (testnet, enabled via environment variable)

To modify the supported chains, edit `app/wagmi.ts`.

## Customization

### Changing Supported Wallets

RainbowKit's `getDefaultConfig` includes popular wallets by default. To customize the wallet list, check the [RainbowKit documentation](https://www.rainbowkit.com/docs/custom-wallet-list).

### Styling the Connect Button

You can customize the RainbowKit theme in `app/providers.tsx`:

```tsx
<RainbowKitProvider theme={darkTheme()}>
  {children}
</RainbowKitProvider>
```

Available themes: `lightTheme()`, `darkTheme()`, `midnightTheme()`

### Adding More Chains

Import additional chains from `wagmi/chains` in `app/wagmi.ts`:

```typescript
import { avalanche, bsc } from 'wagmi/chains';
```

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Your WalletConnect Project ID
- `NEXT_PUBLIC_ENABLE_TESTNETS` - Set to `true` to enable testnets

## Resources

- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
- [WalletConnect Cloud](https://cloud.walletconnect.com)

## License

MIT
