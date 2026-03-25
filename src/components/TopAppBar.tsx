import React, { useState } from 'react';
import { FirestorePlayer } from '../hooks/useGameState';

interface TopAppBarProps {
  players?: FirestorePlayer[];
  currentTurnIndex?: number;
}

export default function TopAppBar({ players = [], currentTurnIndex = 0 }: TopAppBarProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Sort players by position descending for leaderboard
  const ranked = [...players].sort((a, b) => b.position - a.position);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-3 md:px-6 h-14 md:h-16 bg-[#0d0d16]/80 backdrop-blur-xl border-b border-[#96f8ff]/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        {/* Title — truncates on mobile */}
        <span className="text-sm md:text-xl font-black text-[#96f8ff] drop-shadow-[0_0_10px_rgba(150,248,255,0.5)] font-['Space_Grotesk'] tracking-tight uppercase whitespace-nowrap">
          <span className="hidden md:inline">SNAKES & LADDERS</span>
          <span className="md:hidden">S&L</span>
        </span>

        {/* Player strip — scrollable on mobile, full on desktop */}
        {players.length > 0 && (
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto px-2 md:px-4 py-1 glass-panel rounded-full border border-primary/20 max-w-[50vw] md:max-w-none scrollbar-hide">
            {players.map((p, i) => {
              const isActive = i === currentTurnIndex;
              const luckyPct = p.stats.luckyPercentage ?? 0;
              return (
                <div key={p.id} className={`flex items-center gap-2 px-2 py-1 flex-shrink-0 ${i < players.length - 1 ? 'border-r border-outline-variant/30' : ''}`}>
                  <div className={`relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0 border-2 ${isActive ? 'border-primary neon-glow-primary' : 'border-outline-variant/50'}`}>
                    <img alt={p.name} className={`w-full h-full object-cover ${isActive ? '' : 'opacity-60'}`} src={p.avatarUrl} />
                    {isActive && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-black"></span>}
                  </div>
                  <div className="hidden md:flex flex-col min-w-0">
                    <span className={`text-[9px] font-bold font-label uppercase truncate ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {p.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-on-background">{p.position}</span>
                      <div className="w-10 h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500" style={{ width: `${Math.min(luckyPct, 100)}%` }}></div>
                      </div>
                      <span className="text-[8px] text-primary/60">{luckyPct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 md:gap-3">
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="text-[#f2effb]/60 hover:text-[#96f8ff] hover:bg-[#96f8ff]/5 transition-all p-1.5 md:p-2 rounded-lg relative"
          >
            <span className="material-symbols-outlined text-xl md:text-2xl">leaderboard</span>
          </button>
          <button className="text-[#f2effb]/60 hover:text-[#96f8ff] hover:bg-[#96f8ff]/5 transition-all p-1.5 md:p-2 rounded-lg">
            <span className="material-symbols-outlined text-xl md:text-2xl">settings</span>
          </button>
        </div>
      </header>

      {/* Leaderboard Dropdown */}
      {showLeaderboard && (
        <div className="fixed top-14 md:top-16 right-2 md:right-6 z-[60] w-72 md:w-80 bg-[#0d0d16]/95 backdrop-blur-2xl border border-primary/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 animate-in slide-in-from-top-2">
          <h3 className="font-headline text-sm font-bold text-primary mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">leaderboard</span>
            LEADERBOARD
          </h3>
          <div className="space-y-3">
            {ranked.map((p, i) => {
              const lucky = p.stats.luckyPercentage ?? 0;
              const unlucky = p.stats.unluckyPercentage ?? 0;
              return (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl bg-surface-container/40 border border-outline-variant/10">
                  <span className="text-lg font-black text-primary/40 w-6 text-center">{i + 1}</span>
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 flex-shrink-0">
                    <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold uppercase text-on-background truncate">{p.name}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] text-on-surface-variant">Tile <span className="text-primary font-bold">{p.position}</span></span>
                      <span className="text-[9px] text-on-surface-variant">🐍 {p.stats.snakesHit}</span>
                      <span className="text-[9px] text-on-surface-variant">🪜 {p.stats.laddersClimbed}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] text-green-400">Lucky {lucky}%</span>
                      <span className="text-[8px] text-red-400">Unlucky {unlucky}%</span>
                      <span className="text-[8px] text-on-surface-variant/50">Rolls: {p.stats.totalRolls}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setShowLeaderboard(false)} className="mt-3 w-full text-center text-[10px] text-primary/50 hover:text-primary uppercase tracking-widest">
            Close
          </button>
        </div>
      )}
    </>
  );
}
