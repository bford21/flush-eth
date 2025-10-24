'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContract, useSwitchChain, useChainId } from 'wagmi';
import { BETH_ABI, BETH_ADDRESSES } from './contracts/bethABI';
import { mainnet, sepolia } from 'wagmi/chains';
import { formatEther } from 'viem';
import { useState, useEffect } from 'react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isFlushAnimating, setIsFlushAnimating] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  
  const currentNetwork = chainId === mainnet.id ? 'mainnet' : chainId === sepolia.id ? 'sepolia' : null;
  const bethAddress = currentNetwork ? BETH_ADDRESSES[currentNetwork] : BETH_ADDRESSES.mainnet;

  // Read total burned ETH
  const { data: totalBurned, refetch: refetchBurned } = useReadContract({
    address: bethAddress,
    abi: BETH_ABI,
    functionName: 'totalBurned',
    chainId: currentNetwork === 'mainnet' ? mainnet.id : sepolia.id,
  });

  // Write flush function
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      setIsFlushAnimating(true);
      setTimeout(() => {
        setIsFlushAnimating(false);
        refetchBurned();
      }, 2000);
    }
  }, [isSuccess, refetchBurned]);

  const handleFlush = async () => {
    if (!currentNetwork) return;
    
    try {
      writeContract({
        address: bethAddress,
        abi: BETH_ABI,
        functionName: 'flush',
        chainId: currentNetwork === 'mainnet' ? mainnet.id : sepolia.id,
      });
    } catch (err) {
      console.error('Error flushing:', err);
    }
  };

  const handleNetworkSwitch = (network: 'mainnet' | 'sepolia') => {
    switchChain({ chainId: network === 'mainnet' ? mainnet.id : sepolia.id });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 p-4 relative">
      {/* Wallet Connection - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <ConnectButton />
      </div>

      <main className="flex flex-col items-center gap-8 text-center max-w-3xl w-full pt-20">
        {/* Header */}
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-7xl font-bold text-white drop-shadow-2xl">
            Flush ETH
          </h1>
          <div className="text-[12rem] animate-bounce">🚽</div>
          <p className="text-2xl text-gray-300 max-w-xl">
            Time to <span className="font-bold text-cyan-400">flush</span> some ETH down the drain!
          </p>
          <p className="text-sm text-gray-400 max-w-md">
            Call the permissionless <code className="bg-gray-800 px-2 py-1 rounded">flush()</code> function on the BETH contract to burn any force-sent ETH.
          </p>
        </div>

        {/* Main Card */}
        <div className="flex flex-col items-center gap-6 p-8 bg-gray-800/90 rounded-3xl shadow-2xl border-4 border-cyan-500/50 w-full backdrop-blur">
          {/* Network Switcher */}
          {isConnected && (
            <div className="flex flex-col gap-4 w-full">
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleNetworkSwitch('mainnet')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    currentNetwork === 'mainnet'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Mainnet
                </button>
                <button
                  onClick={() => handleNetworkSwitch('sepolia')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    currentNetwork === 'sepolia'
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Sepolia
                </button>
              </div>

              {/* Total Burned Display */}
              {totalBurned !== undefined && (
                <div className="p-6 bg-gradient-to-r from-orange-900/40 to-red-900/40 rounded-xl border-2 border-orange-500/50">
                  <p className="text-sm font-medium text-gray-300 mb-1">
                    Total ETH Burned on {currentNetwork}
                  </p>
                  <p className="text-3xl font-bold text-orange-400">
                    🔥 {parseFloat(formatEther(totalBurned)).toFixed(6)} ETH
                  </p>
                </div>
              )}

              {/* Flush Button */}
              <div className="relative">
                <button
                  onClick={handleFlush}
                  disabled={isPending || !currentNetwork || isFlushAnimating}
                  className={`w-full px-12 py-6 text-2xl font-bold rounded-xl transition-all transform ${
                    isPending || isFlushAnimating
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95'
                  } text-white`}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Flushing...
                    </span>
                  ) : isFlushAnimating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">🌀</span> FLUSHED! 💦
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      🚽 FLUSH IT! 💩
                    </span>
                  )}
                </button>
                {isFlushAnimating && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-6xl animate-ping">💦</div>
                  </div>
                )}
              </div>

              {/* Status Messages */}
              {error && (
                <div className="p-4 bg-red-900/30 rounded-lg border border-red-500/50">
                  <p className="text-sm font-medium text-red-300">
                    ❌ Error: {error.message}
                  </p>
                </div>
              )}

              {!currentNetwork && (
                <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/50">
                  <p className="text-sm font-medium text-yellow-300">
                    ⚠️ Please switch to Mainnet or Sepolia
                  </p>
                </div>
              )}
            </div>
          )}

          {!isConnected && (
            <div className="mt-4 p-6 bg-cyan-900/20 rounded-lg border border-cyan-500/50">
              <p className="text-lg font-medium text-cyan-300">
                👉 Connect your wallet (top right) to start flushing!
              </p>
            </div>
          )}
        </div>

        {/* FAQ Toggle */}
        <div className="w-full mt-4">
          <button
            onClick={() => setIsFaqOpen(!isFaqOpen)}
            className="w-full p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all flex items-center justify-between"
          >
            <span className="text-lg font-semibold text-white">
              What is this? 🤔
            </span>
            <span className="text-2xl text-gray-400 transform transition-transform" style={{ transform: isFaqOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          
          {isFaqOpen && (
            <div className="flex flex-col gap-4 text-sm text-gray-300 mt-2 p-6 bg-gray-800/50 rounded-xl backdrop-blur border border-gray-700">
              <p>
                The BETH contract can receive force-sent ETH (via selfdestruct or other means) that doesn&apos;t mint tokens. 
                The <code className="bg-gray-700 px-1 py-0.5 rounded">flush()</code> function is <span className="font-bold">permissionless</span> - 
                anyone can call it to forward that ETH to the burn address <code className="bg-gray-700 px-1 py-0.5 rounded font-mono text-xs">0x0000...0000</code>.
              </p>
              <p>
                Contract addresses: <br />
                <span className="font-mono text-xs">Mainnet: {BETH_ADDRESSES.mainnet}</span><br />
                <span className="font-mono text-xs">Sepolia: {BETH_ADDRESSES.sepolia}</span>
              </p>
              <a
                href="https://github.com/ETHCF/beth"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cyan-400 hover:underline"
              >
                📖 Learn more about BETH →
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
