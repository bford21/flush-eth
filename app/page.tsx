'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="flex flex-col items-center gap-8 text-center max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            Flush ETH
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Connect your Web3 wallet with RainbowKit
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">🌈</div>
            <ConnectButton />
          </div>

          {isConnected && address && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-900 dark:text-green-200">
                ✓ Wallet Connected
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1 font-mono break-all">
                {address}
              </p>
            </div>
          )}

          {!isConnected && (
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Click the button above to connect your wallet
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400 mt-4">
          <p>
            Powered by{' '}
            <a
              href="https://www.rainbowkit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              RainbowKit
            </a>
            {' '}and{' '}
            <a
              href="https://wagmi.sh/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Wagmi
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
