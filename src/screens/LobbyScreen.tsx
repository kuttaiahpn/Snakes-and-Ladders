import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LobbyScreenProps {
  onStartGame: () => void;
}

export default function LobbyScreen({ onStartGame }: LobbyScreenProps) {
  const [selectedPlayers, setSelectedPlayers] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and play ambient music
  useEffect(() => {
    const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser blocked autoplay — will play on user interaction
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.volume = 0;
      }
    }
    setIsMuted(!isMuted);
  };

  const playerOptions = [
    { count: 1, label: 'SOLO' },
    { count: 2, label: 'DUO' },
    { count: 3, label: 'TRIO' },
    { count: 4, label: 'SQUAD' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary-container overflow-x-hidden min-h-screen"
    >
      {/* Top Nav */}
      <header className="bg-transparent text-[#96f8ff] font-['Space_Grotesk'] tracking-tight uppercase fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-6 py-3 md:py-4">
        <div className="text-lg md:text-xl font-bold tracking-tighter text-[#96f8ff] drop-shadow-[0_0_8px_rgba(150,248,255,0.5)]">
          VIBE EDITION
        </div>
        <div className="flex gap-3 md:gap-6 items-center">
          <button
            onClick={toggleMute}
            className="hover:text-[#ff51fa] hover:drop-shadow-[0_0_10px_rgba(255,81,250,0.8)] transition-all active:scale-90 flex items-center"
          >
            <span className="material-symbols-outlined">{isMuted ? 'volume_off' : 'volume_up'}</span>
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="hover:text-[#ff51fa] hover:drop-shadow-[0_0_10px_rgba(255,81,250,0.8)] transition-all active:scale-90 flex items-center"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
          <div className="bg-surface-container/95 backdrop-blur-2xl rounded-3xl p-8 border border-primary/20 w-80 max-w-[90vw] shadow-[0_0_60px_rgba(150,248,255,0.1)]" onClick={e => e.stopPropagation()}>
            <h3 className="font-headline text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">settings</span>
              SETTINGS
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Game Version</span>
                <span className="text-primary font-bold">2.0.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Board Size</span>
                <span className="text-on-background">10 x 10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Quantum Events</span>
                <span className="text-green-400">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">AI Commentary</span>
                <span className="text-green-400">SHAKUNI v1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Music</span>
                <span className={isMuted ? 'text-red-400' : 'text-green-400'}>{isMuted ? 'Muted' : 'On'}</span>
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="mt-6 w-full py-2 rounded-xl border border-primary/30 text-primary text-xs uppercase tracking-widest hover:bg-primary/10 transition-all">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Background */}
      <div className="fixed inset-0 z-0 bg-grid pointer-events-none"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>

      <main className="relative z-10 pt-20 md:pt-24 pb-28 px-4 md:px-6 flex flex-col items-center max-w-7xl mx-auto w-full">
        {/* Hero Title */}
        <section className="text-center mb-8 md:mb-16 space-y-3">
          <h1 className="font-headline text-3xl md:text-7xl font-bold tracking-tighter neon-pulse text-primary uppercase">
            SNAKES &amp; LADDERS<br />
            <span className="text-secondary drop-shadow-[0_0_15px_rgba(255,81,250,0.5)]">- VIBE EDITION -</span>
          </h1>
          {/* Hero Art — animated snake & ladder */}
          <div className="flex justify-center gap-4 text-4xl md:text-6xl py-4 animate-bounce">
            <span>🐍</span>
            <span className="text-primary">⚡</span>
            <span>🪜</span>
          </div>
        </section>

        {/* Config Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 w-full">
          {/* Left: Operator Selection */}
          <div className="md:col-span-5 space-y-4 md:space-y-8">
            <div className="bg-surface-container/40 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-5 md:p-8 border border-primary/10 shadow-[0_0_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl"></div>
              <h2 className="font-headline text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">group</span>
                SELECT OPERATORS
              </h2>
              <div className="flex justify-between items-center gap-2 md:gap-4">
                {playerOptions.map(opt => (
                  <button
                    key={opt.count}
                    onClick={() => setSelectedPlayers(opt.count)}
                    className={`flex-1 aspect-square rounded-xl md:rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 ${
                      selectedPlayers === opt.count
                        ? 'bg-surface-container-highest border-2 border-primary shadow-[0_0_15px_rgba(150,248,255,0.3)]'
                        : 'bg-surface-container-low border border-outline-variant/30 hover:border-primary/50'
                    }`}
                  >
                    <span className={`font-headline text-2xl md:text-3xl font-bold ${selectedPlayers === opt.count ? 'text-primary' : 'opacity-40'}`}>
                      {opt.count}
                    </span>
                    <span className={`font-label text-[8px] md:text-[10px] mt-1 ${selectedPlayers === opt.count ? 'text-primary' : 'opacity-40'}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Player Profiles */}
          <div className="md:col-span-7 bg-surface-container/40 backdrop-blur-xl rounded-2xl md:rounded-[3rem] p-5 md:p-10 border border-secondary/10 shadow-[0_0_60px_rgba(255,81,250,0.05)]">
            <h2 className="font-headline text-lg md:text-2xl font-bold mb-6 md:mb-10 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">fingerprint</span>
              PLAYER PROFILES
            </h2>
            <div className="space-y-5 md:space-y-8">
              {/* Player 1 — always active */}
              <div className="flex items-center gap-4 md:gap-6 group">
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface-container-highest border-2 border-primary shadow-[0_0_15px_rgba(150,248,255,0.4)] flex-shrink-0 overflow-hidden">
                  <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjJegf4Cqeey_aY1n5yG9pSMligAJru8h2E2VWYvNatdLvOsxMbASVjx3dfkBEWXfIAe0Vd3B2E4rjF8U3DRwO2640KRZRtuT05uyYSJZLqjd-svAO9s3aTSFxAwlWpH2q9OqaTD0jUpYMudSLrXfHv35qQxWgJu6hm-eurVnuRQVYd2WCNBuse81HxY9-AaUKj-r6KUYCZQzugK4RVR53E0fNmOkn3pgv2YLFXfZGYwxzCmlFdERG7gDCt2SdtRvePFWuenUwMvM" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="font-label text-[9px] md:text-[10px] tracking-widest opacity-40 uppercase">OPERATOR_01</label>
                  <input className="w-full bg-transparent border-b border-outline-variant/30 py-1 md:py-2 font-headline text-base md:text-xl focus:outline-none focus:border-primary transition-colors text-primary" type="text" defaultValue="NEON_WRAITH" />
                </div>
              </div>

              {/* Player 2 */}
              <div className={`flex items-center gap-4 md:gap-6 group transition-opacity ${selectedPlayers >= 2 ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface-container-highest border border-outline-variant/50 flex-shrink-0 overflow-hidden">
                  <span className="material-symbols-outlined text-outline text-2xl md:text-3xl absolute inset-0 flex items-center justify-center">person</span>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="font-label text-[9px] md:text-[10px] tracking-widest opacity-40 uppercase">OPERATOR_02</label>
                  <input className="w-full bg-transparent border-b border-outline-variant/30 py-1 md:py-2 font-headline text-base md:text-xl focus:outline-none focus:border-secondary transition-colors text-on-surface" placeholder="ENTER IDENTIFIER..." type="text" />
                </div>
              </div>

              {/* Player 3 */}
              <div className={`flex items-center gap-4 md:gap-6 transition-opacity ${selectedPlayers >= 3 ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full border border-dashed border-outline-variant flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline">person</span>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="font-label text-[9px] md:text-[10px] tracking-widest opacity-40 uppercase">OPERATOR_03</label>
                  <input className="w-full bg-transparent border-b border-outline-variant/30 py-1 md:py-2 font-headline text-base md:text-xl focus:outline-none focus:border-tertiary transition-colors text-on-surface" placeholder="ENTER IDENTIFIER..." type="text" />
                </div>
              </div>

              {/* Player 4 */}
              <div className={`flex items-center gap-4 md:gap-6 transition-opacity ${selectedPlayers >= 4 ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full border border-dashed border-outline-variant flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline">person</span>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="font-label text-[9px] md:text-[10px] tracking-widest opacity-40 uppercase">OPERATOR_04</label>
                  <input className="w-full bg-transparent border-b border-outline-variant/30 py-1 md:py-2 font-headline text-base md:text-xl focus:outline-none focus:border-tertiary transition-colors text-on-surface" placeholder="ENTER IDENTIFIER..." type="text" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 md:mt-20 relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl scale-150"></div>
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
              }
              onStartGame();
            }}
            className="relative bg-gradient-to-br from-primary to-primary-container px-8 md:px-12 py-4 md:py-6 rounded-full shadow-[0_0_50px_rgba(150,248,255,0.4)] hover:shadow-[0_0_80px_rgba(150,248,255,0.6)] transition-all active:scale-95 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-3 md:gap-4">
              <span className="font-headline text-lg md:text-2xl font-black text-on-primary-fixed uppercase tracking-tighter">INITIATE SESSION</span>
              <span className="material-symbols-outlined text-on-primary-fixed font-bold text-2xl md:text-3xl">bolt</span>
            </div>
          </button>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 md:pb-6 md:pt-3 bg-[#191923]/60 backdrop-blur-xl border-t border-[#96f8ff]/10 shadow-[0_-10px_40px_rgba(255,81,250,0.08)] rounded-t-2xl md:rounded-t-[24px]">
        <a className="flex flex-col items-center justify-center bg-[#96f8ff]/10 text-[#96f8ff] rounded-xl p-2 shadow-[inset_0_0_10px_rgba(150,248,255,0.2)]" href="#home">
          <span className="material-symbols-outlined text-lg">grid_view</span>
          <span className="text-[8px] md:text-[10px] uppercase tracking-widest mt-0.5">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#f2effb]/40 p-2 hover:text-[#96f8ff] transition-colors active:scale-90" href="#leaderboard">
          <span className="material-symbols-outlined text-lg">leaderboard</span>
          <span className="text-[8px] md:text-[10px] uppercase tracking-widest mt-0.5">Board</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#f2effb]/40 p-2 hover:text-[#96f8ff] transition-colors active:scale-90" href="#profile">
          <span className="material-symbols-outlined text-lg">account_circle</span>
          <span className="text-[8px] md:text-[10px] uppercase tracking-widest mt-0.5">Profile</span>
        </a>
      </nav>

      {/* Ambient particles */}
      <div className="fixed top-1/4 right-10 w-2 h-2 bg-primary rounded-full blur-[2px] opacity-40"></div>
      <div className="fixed bottom-1/3 left-20 w-3 h-3 bg-secondary rounded-full blur-[4px] opacity-30"></div>
      <div className="fixed top-2/3 right-1/4 w-1.5 h-1.5 bg-tertiary rounded-full blur-[1px] opacity-50"></div>
    </motion.div>
  );
}
