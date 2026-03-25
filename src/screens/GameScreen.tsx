import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopAppBar from '../components/TopAppBar';
import SideNavBar from '../components/SideNavBar';
import Grid from '../components/Grid';
import PlayerToken from '../components/PlayerToken';
import { Player, SNAKES, LADDERS } from '../utils/gameLogic';

interface GameScreenProps {
  onBackToLobby: () => void;
}

// Mock primary player
const INITIAL_PLAYER: Player = {
  id: 'p1',
  name: 'Vapor_01',
  position: 1,
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxCiLh-hMq9fmX0fKdhiPqILokcEKtcUXMT_WhGogzegehbZplz1o-j3r7sb2MVp5HFTw0AS0howSzTU4p3uosaR-Om2SLuNntabvFB0EcYS1ZTR5edG9waa0AoxR_NJg5HGajK1JVaDGE2mgijrihsGJvEAuzfBGRUAEwdtZmoSN_WHVSjMSfs0fLwaWYEAFn_2AjjlwxS3uFgqd1GtWLqwbYBYOqZ0TTO4yjitjWN_rzxGoAtQo72CP_Gh3S4648m8qilZLJw5I',
  color: '#96f8ff'
};

export default function GameScreen({ onBackToLobby }: GameScreenProps) {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [isRolling, setIsRolling] = useState(false);
  const [latestRoll, setLatestRoll] = useState<number | null>(null);

  const movePlayer = async (steps: number) => {
    let currentPos = player.position;
    
    // Check if the roll exceeds 100
    if (currentPos + steps > 100) {
      console.log('Roll exceeds 100. Staying put.');
      return; 
    }

    // Step-by-step animation loop
    for (let i = 1; i <= steps; i++) {
        currentPos += 1;
        setPlayer(prev => ({ ...prev, position: currentPos }));
        
        // Wait 200ms between steps for "walking" effect
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Post-Movement Check
    checkSnakesAndLadders(currentPos);
  };

  const checkSnakesAndLadders = async (position: number) => {
    // Small delay before sudden slide/climb
    await new Promise(resolve => setTimeout(resolve, 300));

    const snake = SNAKES.find(s => s.head === position);
    if (snake) {
      setPlayer(prev => ({ ...prev, position: snake.tail }));
      return;
    }

    const ladder = LADDERS.find(l => l.start === position);
    if (ladder) {
      setPlayer(prev => ({ ...prev, position: ladder.end }));
      return;
    }
  };

  const handleRollDice = async () => {
    if (isRolling) return;
    setIsRolling(true);

    const roll = Math.floor(Math.random() * 6) + 1;
    setLatestRoll(roll);
    
    await movePlayer(roll);
    
    setIsRolling(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 } }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.5 } }}
      className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary overflow-hidden min-h-screen"
    >
      <TopAppBar />
      <SideNavBar />

      {/* Main Content Canvas */}
      <main className="pt-24 pb-24 md:pb-8 px-6 h-screen flex flex-col items-center justify-center lg:pr-80 relative z-10">
        
        {/* Game Stats / Luck Meter HUD Overlay */}
        <div className="w-full max-w-4xl flex justify-between items-end mb-6">
          <div className="flex flex-col">
            <span className="font-label text-[10px] text-primary/60 tracking-[0.2em] uppercase">Current Vector</span>
            <h1 className="font-headline text-4xl font-black text-on-background -mt-1 tracking-tight">TILE {player.position}</h1>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="font-label text-[10px] text-secondary/60 tracking-[0.2em] uppercase">Luck Potential</span>
              <span className="font-headline text-lg font-bold text-secondary">88%</span>
            </div>
            <div className="w-64 h-2 bg-surface-container-lowest rounded-full relative overflow-hidden border border-outline-variant/10">
              <div className="absolute inset-0 bg-gradient-to-r from-error via-tertiary to-primary w-[88%] neon-glow-primary"></div>
              {/* Needle */}
              <div className="absolute left-[88%] top-0 w-[2px] h-full bg-on-background z-10 shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Central Game Grid (10x10) with Player Token overlay */}
        <Grid>
          <div className="absolute inset-0 pointer-events-none p-1 z-30">
            <PlayerToken player={player} />
          </div>
        </Grid>

        {/* Action HUD */}
        <div className="mt-8 flex items-center gap-6">
          <button 
            disabled={isRolling}
            onClick={handleRollDice} 
            className={`group relative px-8 py-4 rounded-xl overflow-hidden transition-all active:scale-95 ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container"></div>
            <div className="relative flex items-center gap-3">
              <span className="material-symbols-outlined text-on-primary font-bold">casino</span>
              <span className="font-headline font-black text-on-primary text-xl tracking-tight">
                {isRolling ? 'ROLLING...' : (latestRoll ? `ROLLED ${latestRoll}` : 'ENGAGE_DICE')}
              </span>
            </div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <div className="flex flex-col gap-1">
            <span className="font-label text-[9px] text-on-surface-variant uppercase">Next Multiplier</span>
            <div className="px-4 py-2 rounded-lg bg-surface-container border border-tertiary/20">
              <span className="font-headline font-bold text-tertiary">2X LUCK</span>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 md:hidden bg-[#0d0d16]/95 backdrop-blur-md rounded-t-3xl border-t border-[#96f8ff]/20 shadow-[0_-8px_32px_rgba(0,243,255,0.1)]">
        <a href="#arena" className="flex flex-col items-center justify-center bg-[#96f8ff]/20 text-[#96f8ff] rounded-xl px-4 py-1 animate-pulse">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-['Space_Grotesk'] text-[10px] font-medium uppercase tracking-widest">Arena</span>
        </a>
        <a href="#comms" className="flex flex-col items-center justify-center text-[#f2effb]/50 hover:text-[#96f8ff] hover:bg-[#96f8ff]/10 p-2 rounded-xl transition-colors">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="font-['Space_Grotesk'] text-[10px] font-medium uppercase tracking-widest">Comms</span>
        </a>
        <a href="#rank" className="flex flex-col items-center justify-center text-[#f2effb]/50 hover:text-[#96f8ff] hover:bg-[#96f8ff]/10 p-2 rounded-xl transition-colors">
          <span className="material-symbols-outlined">military_tech</span>
          <span className="font-['Space_Grotesk'] text-[10px] font-medium uppercase tracking-widest">Rank</span>
        </a>
        <button onClick={onBackToLobby} className="flex flex-col items-center justify-center text-[#f2effb]/50 hover:text-[#error] hover:bg-[#error]/10 p-2 rounded-xl transition-colors">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-['Space_Grotesk'] text-[10px] font-medium uppercase tracking-widest">Exit</span>
        </button>
      </nav>
    </motion.div>
  );
}
