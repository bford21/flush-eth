'use client';

import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useChainId, useBalance } from 'wagmi';
import { BETH_ABI, BETH_ADDRESSES } from './contracts/bethABI';
import { mainnet, sepolia } from 'wagmi/chains';
import { formatEther } from 'viem';
import { useState, useEffect } from 'react';

export default function Home() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const [isFlushAnimating, setIsFlushAnimating] = useState(false);
  
  const currentNetwork = chainId === mainnet.id ? 'mainnet' : chainId === sepolia.id ? 'sepolia' : null;
  const bethAddress = currentNetwork ? BETH_ADDRESSES[currentNetwork] : BETH_ADDRESSES.mainnet;

  // Get BETH contract's ETH balance (force-sent ETH that can be flushed)
  const { data: contractBalance, refetch: refetchBalance } = useBalance({
    address: bethAddress,
    chainId: currentNetwork === 'mainnet' ? mainnet.id : sepolia.id,
  });

  // Calculate number of ETH logos based on flushable amount
  const getLogoCount = () => {
    if (!contractBalance || contractBalance.value === BigInt(0)) return 0;
    const ethAmount = parseFloat(formatEther(contractBalance.value));
    // 1 logo for any amount > 0, then +1 for every 0.001 ETH
    return Math.max(1, Math.floor(ethAmount / 0.001));
  };

  const logoCount = getLogoCount();

  // Generate logo positions dynamically
  const generateLogoPositions = () => {
    const positions = [];
    const count = Math.min(logoCount, 20); // Cap at 20 logos for performance
    
    for (let i = 0; i < count; i++) {
      // Distribute logos in water area (bottom 20-40%)
      const angle = (i / count) * Math.PI * 2;
      const radius = 15 + (i % 3) * 10; // Vary radius for depth
      const bottomPos = 20 + ((i % 4) * 5); // Between 20-35%
      const leftPos = 50 + Math.cos(angle) * radius; // Circular distribution
      
      positions.push({
        id: i,
        bottom: `${bottomPos}%`,
        left: `${leftPos}%`,
        size: i === 0 ? 'w-24 h-24' : i % 2 === 0 ? 'w-20 h-20' : 'w-16 h-16',
        floatAnimation: `animate-eth-float-${(i % 3) + 1}`,
        delay: (i * 0.1).toFixed(2) + 's'
      });
    }
    
    return positions;
  };

  const logoPositions = generateLogoPositions();

  // Write flush function
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      setIsFlushAnimating(true);
      // Play flushing sound
      const audio = new Audio('/toilet-flushing.mp3');
      audio.play().catch(err => console.error('Error playing sound:', err));
      
      setTimeout(() => {
        setIsFlushAnimating(false);
        refetchBalance(); // Refresh the balance after flushing
      }, 4000);
    }
  }, [isSuccess, refetchBalance]);

  const handleFlushClick = async () => {
    if (!isConnected) {
      // Open wallet connection modal if not connected
      openConnectModal?.();
      return;
    }

    if (!currentNetwork || isPending) return;
    
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 p-4 relative">
      {/* Wallet Connection - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <ConnectButton />
      </div>

      <main className="flex flex-col items-center gap-8 text-center max-w-3xl w-full pt-20">
        {/* Header */}
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-8xl font-bold text-white drop-shadow-2xl font-[family-name:var(--font-bangers)] tracking-wider">
            Flush ETH
          </h1>
          
          {/* Toilet Bowl - Top Down View */}
          <div className="relative w-[600px] h-[700px] my-8" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}>
            {/* Toilet Bowl */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[600px] bg-gradient-to-b from-gray-200 to-gray-300 border-8 border-gray-400 overflow-hidden"
                 style={{ 
                   borderRadius: '50% / 60%',
                   boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.1), inset 0 -10px 30px rgba(0,0,0,0.05)'
                 }}>
              
              {/* Inner Bowl */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-[450px] bg-gradient-to-b from-white to-gray-100 overflow-hidden"
                   style={{ 
                     borderRadius: '50% / 60%',
                     boxShadow: 'inset 0 15px 40px rgba(0,0,0,0.15), inset 0 -10px 20px rgba(0,0,0,0.05)'
                   }}>
                
                {/* Water */}
                <div className={`absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-b from-blue-300/30 via-blue-400/50 to-blue-500/60 transition-all ${isFlushAnimating ? 'animate-drain-water' : 'animate-water-wobble'}`}
                     style={{ borderRadius: '50% / 30%' }}>
                </div>
                
                {/* Flushable ETH Display */}
                {contractBalance && !isFlushAnimating && (
                  <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
                    <div className="bg-gray-900/80 backdrop-blur-sm px-6 py-3 rounded-2xl border-2 border-cyan-400/50 shadow-xl">
                      <p className="text-xs text-gray-400 font-semibold mb-1">Flushable ETH</p>
                      <p className="text-3xl font-bold text-cyan-400 font-mono">
                        {parseFloat(formatEther(contractBalance.value)).toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Drain Hole */}
                <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-20 h-24 bg-gradient-radial from-gray-900 via-gray-700 to-gray-500"
                     style={{ 
                       borderRadius: '50% / 60%',
                       boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.8), inset 0 -2px 5px rgba(0,0,0,0.3)',
                       background: 'radial-gradient(ellipse, #1a1a1a 30%, #333 60%, #666 100%)'
                     }}>
                </div>
                
                {/* Swirl Effect */}
                {isFlushAnimating && (
                  <div className="absolute inset-0 animate-swirl-effect pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-4 border-transparent border-t-blue-400/60 border-r-blue-400/40 rounded-full animate-spin-fast"></div>
                  </div>
                )}
                
                {/* Dynamic ETH Logos - floating in water based on flushable amount */}
                <>
                  {logoPositions.map((logo) => (
                    <div
                      key={logo.id}
                      className={`absolute z-10 ${isFlushAnimating ? 'animate-eth-drain' : logo.floatAnimation}`}
                      style={{
                        bottom: logo.bottom,
                        left: logo.left,
                        transform: 'translateX(-50%)',
                        animationDelay: isFlushAnimating ? logo.delay : undefined
                      }}
                    >
                      <img src="/eth-logo.png" alt="ETH" className={`${logo.size} object-contain`} />
                    </div>
                  ))}
                </>
              </div>
            </div>
            
            {/* Flush Handle/Button */}
            <button 
              onClick={handleFlushClick}
              disabled={isPending}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="px-8 py-4 bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center gap-3">
                <span className="text-3xl">💧</span>
                <span className="text-2xl font-bold text-white font-[family-name:var(--font-bangers)]">
                  {isPending ? 'FLUSHING...' : 'Flush'}
                </span>
              </div>
            </button>
          </div>
          
          <p className="text-2xl text-gray-300 max-w-xl">
            Time to <span className="font-bold text-cyan-400">flush</span> some ETH down the proverbial toilet!
          </p>
          <p className="text-sm text-gray-400 max-w-md">
            Call the permissionless <code className="bg-gray-800 px-2 py-1 rounded">flush()</code> function on the BETH contract to burn any force-sent ETH. Learn more about BETH <a href="https://beth.ethcf.org/" className="text-cyan-400 hover:underline">here</a>.
          </p>
        </div>

        {/* Status Messages */}
        {/* {error && (
          <div className="p-4 bg-red-900/30 rounded-lg border border-red-500/50 max-w-lg">as
            <p className="text-sm font-medium text-red-300">
              ❌ Error: {error.message}
            </p>
          </div>
        )} */}

          {isConnected && !currentNetwork && (
          <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/50 max-w-lg">
            <p className="text-sm font-medium text-yellow-300">
              ⚠️ Please switch to Mainnet or Sepolia in your wallet
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 text-gray-400 text-sm">
        <a
          href="https://twitter.com/cryptodevbrian"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          @cryptodevbrian
        </a>
        <span className="text-gray-600">•</span>
        <a
          href="https://github.com/bford21/flush-eth"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          View Source
        </a>
      </footer>
    </div>
  );
}
