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

  const handleTestFlush = () => {
    setIsFlushAnimating(true);
    // Play flushing sound
    const audio = new Audio('/toilet-flushing.mp3');
    audio.play().catch(err => console.error('Error playing sound:', err));
    
    setTimeout(() => {
      setIsFlushAnimating(false);
    }, 4000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 p-4 relative">
      {/* Test Flush Button - Top Left */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={handleTestFlush}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all"
        >
          🧪 Test Flush
        </button>
      </div>

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
                
                {/* Multiple ETH Logos - floating in water, always visible */}
                <>
                  {/* Center Logo - in water */}
                  <div className={`absolute bottom-[25%] left-1/2 -translate-x-1/2 z-10 ${isFlushAnimating ? 'animate-eth-drain' : 'animate-eth-float'}`}>
                    <img src="/eth-logo.png" alt="ETH" className="w-24 h-24 object-contain" />
                  </div>
                  {/* Center Top - edge of water */}
                  <div className={`absolute bottom-[35%] left-1/2 -translate-x-1/2 z-10 ${isFlushAnimating ? 'animate-eth-drain' : 'animate-eth-float-2'}`} style={isFlushAnimating ? { animationDelay: '0.1s' } : {}}>
                    <img src="/eth-logo.png" alt="ETH" className="w-20 h-20 object-contain" />
                  </div>
                  {/* Right Side - in water */}
                  <div className={`absolute bottom-[28%] right-[20%] z-10 ${isFlushAnimating ? 'animate-eth-drain' : 'animate-eth-float-3'}`} style={isFlushAnimating ? { animationDelay: '0.2s' } : {}}>
                    <img src="/eth-logo.png" alt="ETH" className="w-20 h-20 object-contain" />
                  </div>
                  {/* Left Side - in water */}
                  <div className={`absolute bottom-[28%] left-[20%] z-10 ${isFlushAnimating ? 'animate-eth-drain' : 'animate-eth-float'}`} style={isFlushAnimating ? { animationDelay: '0.15s' } : {}}>
                    <img src="/eth-logo.png" alt="ETH" className="w-20 h-20 object-contain" />
                  </div>
                  {/* Bottom Right - deeper in water */}
                  <div className={`absolute bottom-[20%] right-[25%] z-10 ${isFlushAnimating ? 'animate-eth-drain' : 'animate-eth-float-2'}`} style={isFlushAnimating ? { animationDelay: '0.25s' } : {}}>
                    <img src="/eth-logo.png" alt="ETH" className="w-18 h-18 object-contain" />
                  </div>
                  {/* Bottom Left - deeper in water */}
                  <div className={`absolute bottom-[20%] left-[25%] z-10 ${isFlushAnimating ? 'animate-eth-drain' : 'animate-eth-float-3'}`} style={isFlushAnimating ? { animationDelay: '0.3s' } : {}}>
                    <img src="/eth-logo.png" alt="ETH" className="w-18 h-18 object-contain" />
                  </div>
                  {/* Right Edge - water surface */}
                  <div className={`absolute bottom-[32%] right-[15%] z-10 ${isFlushAnimating ? 'animate-eth-drain' : 'animate-eth-float'}`} style={isFlushAnimating ? { animationDelay: '0.05s' } : {}}>
                    <img src="/eth-logo.png" alt="ETH" className="w-16 h-16 object-contain" />
                  </div>
                  {/* Left Edge - water surface */}
                  <div className={`absolute bottom-[32%] left-[15%] z-10 ${isFlushAnimating ? 'animate-eth-drain' : 'animate-eth-float-2'}`} style={isFlushAnimating ? { animationDelay: '0.12s' } : {}}>
                    <img src="/eth-logo.png" alt="ETH" className="w-16 h-16 object-contain" />
                  </div>
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
    </div>
  );
}
