import React from 'react';
import { motion } from 'framer-motion';

interface LobbyScreenProps {
  onStartGame: () => void;
}

export default function LobbyScreen({ onStartGame }: LobbyScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary-container overflow-x-hidden min-h-screen"
    >
      {/* Top Navigation Shell */}
      <header className="bg-transparent text-[#96f8ff] font-['Space_Grotesk'] tracking-tight uppercase docked full-width top-0 no-border space-through-hierarchy flat-no-shadows flex justify-between items-center w-full px-6 py-4 fixed z-50">
        <div className="text-xl font-bold tracking-tighter text-[#96f8ff] drop-shadow-[0_0_8px_rgba(150,248,255,0.5)]">
          VIBE EDITION
        </div>
        <div className="flex gap-6 items-center">
          <button className="hover:text-[#ff51fa] hover:drop-shadow-[0_0_10px_rgba(255,81,250,0.8)] transition-all scale-95 active:duration-100 flex items-center">
            <span className="material-symbols-outlined">volume_up</span>
          </button>
          <button className="hover:text-[#ff51fa] hover:drop-shadow-[0_0_10px_rgba(255,81,250,0.8)] transition-all scale-95 active:duration-100 flex items-center">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {/* Background Layer */}
      <div className="fixed inset-0 z-0 bg-grid pointer-events-none"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>

      <main className="relative z-10 pt-24 pb-32 px-6 flex flex-col items-center max-w-7xl mx-auto w-full">
        {/* Hero Title Section */}
        <section className="text-center mb-16 space-y-4">
          <h1 className="font-headline text-4xl md:text-7xl font-bold tracking-tighter neon-pulse text-primary uppercase">
            SNAKES &amp; LADDERS<br />
            <span className="text-secondary drop-shadow-[0_0_15px_rgba(255,81,250,0.5)]">- VIBE EDITION -</span>
          </h1>
          <p className="font-label text-sm tracking-[0.3em] opacity-60 uppercase">Digital Simulation Ver. 2.0.4</p>
        </section>

        {/* Configuration Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
          {/* Left Panel: Operators Selection */}
          <div className="md:col-span-5 space-y-8">
            <div className="bg-surface-container/40 backdrop-blur-xl rounded-[2rem] p-8 border border-primary/10 shadow-[0_0_40px_rgba(0,0,0,0.4)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl"></div>
              <h2 className="font-headline text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">group</span>
                SELECT OPERATORS
              </h2>
              <div className="flex justify-between items-center gap-4">
                <button className="flex-1 aspect-square rounded-2xl bg-surface-container-highest flex flex-col items-center justify-center border-2 border-primary shadow-[0_0_15px_rgba(150,248,255,0.3)] transition-all hover:scale-105">
                  <span className="font-headline text-3xl font-bold">1</span>
                  <span className="font-label text-[10px] mt-2 opacity-60">SOLO</span>
                </button>
                <button className="flex-1 aspect-square rounded-2xl bg-surface-container-low flex flex-col items-center justify-center border border-outline-variant/30 transition-all hover:border-primary/50 hover:bg-surface-container-high group-hover:scale-95">
                  <span className="font-headline text-3xl font-bold opacity-40 group-hover:opacity-100">2</span>
                  <span className="font-label text-[10px] mt-2 opacity-40">DUO</span>
                </button>
                <button className="flex-1 aspect-square rounded-2xl bg-surface-container-low flex flex-col items-center justify-center border border-outline-variant/30 transition-all hover:border-primary/50 hover:bg-surface-container-high group-hover:scale-95">
                  <span className="font-headline text-3xl font-bold opacity-40 group-hover:opacity-100">3</span>
                  <span className="font-label text-[10px] mt-2 opacity-40">TRIO</span>
                </button>
                <button className="flex-1 aspect-square rounded-2xl bg-surface-container-low flex flex-col items-center justify-center border border-outline-variant/30 transition-all hover:border-primary/50 hover:bg-surface-container-high group-hover:scale-95">
                  <span className="font-headline text-3xl font-bold opacity-40 group-hover:opacity-100">4</span>
                  <span className="font-label text-[10px] mt-2 opacity-40">SQUAD</span>
                </button>
              </div>
            </div>

            {/* Simulation Specs Card */}
            <div className="bg-surface-container/20 backdrop-blur-md rounded-[2rem] p-6 border border-outline-variant/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="font-label text-[10px] opacity-40 uppercase tracking-widest">Gravity Constant</div>
                  <div className="font-headline text-lg text-tertiary">9.81 m/s²</div>
                </div>
                <div className="space-y-1">
                  <div className="font-label text-[10px] opacity-40 uppercase tracking-widest">Neon Saturation</div>
                  <div className="font-headline text-lg text-primary">High Fidelity</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Player Profiles */}
          <div className="md:col-span-7 bg-surface-container/40 backdrop-blur-xl rounded-[3rem] p-10 border border-secondary/10 shadow-[0_0_60px_rgba(255,81,250,0.05)]">
            <h2 className="font-headline text-2xl font-bold mb-10 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">fingerprint</span>
              PLAYER PROFILES
            </h2>
            <div className="space-y-8">
              {/* Profile Entry 1 */}
              <div className="flex items-center gap-6 group">
                <div className="relative w-16 h-16 rounded-full bg-surface-container-highest border-2 border-primary shadow-[0_0_15px_rgba(150,248,255,0.4)] flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjJegf4Cqeey_aY1n5yG9pSMligAJru8h2E2VWYvNatdLvOsxMbASVjx3dfkBEWXfIAe0Vd3B2E4rjF8U3DRwO2640KRZRtuT05uyYSJZLqjd-svAO9s3aTSFxAwlWpH2q9OqaTD0jUpYMudSLrXfHv35qQxWgJu6hm-eurVnuRQVYd2WCNBuse81HxY9-AaUKj-r6KUYCZQzugK4RVR53E0fNmOkn3pgv2YLFXfZGYwxzCmlFdERG7gDCt2SdtRvePFWuenUwMvM" />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="font-label text-[10px] tracking-widest opacity-40 uppercase">OPERATOR_01</label>
                  <input className="w-full bg-transparent border-b border-outline-variant/30 py-2 font-headline text-xl focus:outline-none focus:border-primary transition-colors text-primary" type="text" defaultValue="NEON_WRAITH" />
                </div>
              </div>

              {/* Profile Entry 2 */}
              <div className="flex items-center gap-6 group opacity-40 hover:opacity-100 transition-opacity">
                <div className="relative w-16 h-16 rounded-full bg-surface-container-highest border border-outline-variant/50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-outline text-3xl">person</span>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="font-label text-[10px] tracking-widest opacity-40 uppercase">OPERATOR_02</label>
                  <input className="w-full bg-transparent border-b border-outline-variant/30 py-2 font-headline text-xl focus:outline-none focus:border-secondary transition-colors text-on-surface" placeholder="ENTER IDENTIFIER..." type="text" />
                </div>
              </div>

              {/* Profile Entry 3 (Locked State) */}
              <div className="flex items-center gap-6 opacity-20 cursor-not-allowed">
                <div className="relative w-16 h-16 rounded-full border border-dashed border-outline-variant flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline">lock</span>
                </div>
                <div className="flex-1 py-4 border-b border-outline-variant/10 font-label text-xs tracking-widest italic">SLOT_LOCKED_WAITING_FOR_INPUT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Central Action CTA */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl scale-150"></div>
          <button 
            onClick={onStartGame}
            className="relative bg-gradient-to-br from-primary to-primary-container px-12 py-6 rounded-full shadow-[0_0_50px_rgba(150,248,255,0.4)] hover:shadow-[0_0_80px_rgba(150,248,255,0.6)] transition-all active:scale-95 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4">
              <span className="font-headline text-2xl font-black text-on-primary-fixed uppercase tracking-tighter">INITIATE SESSION</span>
              <span className="material-symbols-outlined text-on-primary-fixed font-bold text-3xl">bolt</span>
            </div>
          </button>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        </div>
      </main>

      {/* Bottom Navigation Shell */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#191923]/60 backdrop-blur-xl border-t border-[#96f8ff]/10 shadow-[0_-10px_40px_rgba(255,81,250,0.08)] rounded-t-[24px]">
        <a className="flex flex-col items-center justify-center bg-[#96f8ff]/10 text-[#96f8ff] rounded-xl p-2 shadow-[inset_0_0_10px_rgba(150,248,255,0.2)]" href="#home">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest mt-1">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#f2effb]/40 p-2 hover:text-[#96f8ff] transition-colors active:scale-90" href="#leaderboard">
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest mt-1">Leaderboard</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#f2effb]/40 p-2 hover:text-[#96f8ff] transition-colors active:scale-90" href="#profile">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest mt-1">Profile</span>
        </a>
      </nav>

      {/* Ambient Floating Particles */}
      <div className="fixed top-1/4 right-10 w-2 h-2 bg-primary rounded-full blur-[2px] opacity-40"></div>
      <div className="fixed bottom-1/3 left-20 w-3 h-3 bg-secondary rounded-full blur-[4px] opacity-30"></div>
      <div className="fixed top-2/3 right-1/4 w-1.5 h-1.5 bg-tertiary rounded-full blur-[1px] opacity-50"></div>
    </motion.div>
  );
}
