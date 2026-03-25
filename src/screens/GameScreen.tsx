import React from 'react';
import { motion } from 'framer-motion';
import TopAppBar from '../components/TopAppBar';
import SideNavBar from '../components/SideNavBar';
import Grid from '../components/Grid';

interface GameScreenProps {
  onBackToLobby: () => void;
}

export default function GameScreen({ onBackToLobby }: GameScreenProps) {
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
            <h1 className="font-headline text-4xl font-black text-on-background -mt-1 tracking-tight">TILE 42</h1>
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

        {/* Central Game Grid (10x10) */}
        <Grid />

        {/* Action HUD */}
        <div className="mt-8 flex items-center gap-6">
          <button className="group relative px-8 py-4 rounded-xl overflow-hidden transition-all active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container"></div>
            <div className="relative flex items-center gap-3">
              <span className="material-symbols-outlined text-on-primary font-bold">casino</span>
              <span className="font-headline font-black text-on-primary text-xl tracking-tight">ENGAGE_DICE</span>
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
