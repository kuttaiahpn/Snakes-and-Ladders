import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LobbyConfig } from '../App';

interface LobbyScreenProps {
  onStartGame: (config: LobbyConfig) => void;
}

const AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBxCiLh-hMq9fmX0fKdhiPqILokcEKtcUXMT_WhGogzegehbZplz1o-j3r7sb2MVp5HFTw0AS0howSzTU4p3uosaR-Om2SLuNntabvFB0EcYS1ZTR5edG9waa0AoxR_NJg5HGajK1JVaDGE2mgijrihsGJvEAuzfBGRUAEwdtZmoSN_WHVSjMSfs0fLwaWYEAFn_2AjjlwxS3uFgqd1GtWLqwbYBYOqZ0TTO4yjitjWN_rzxGoAtQo72CP_Gh3S4648m8qilZLJw5I',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAXnMRRPS1wvWCO7nMKwr7ZVs8V38Q8nYxx4L42s_qTcIAoZtcqDF1EXZl1HUmGjM9EzA31y-cac1tXk0dJrVgAjoMCRZLmaZu7ZuR6UJ2pcaramkIzEEUsb-IZqYnMd1YsjsUetZmat1DDgX2nd4ZzVLuRu8TgmkfhsoZJCqsv9cLQ4d3__9mfgRAnxnG7yGMHNI35eeEDdMHwxYlbAzQD3jE1SE1oISibHpH3xz9DwTl5B7fIMqHsmJpZyd-nVxEUlDLmBh-QHs',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA1ljG13B6ysMft7G0U3Gb-VI4BZPDt7pTyG8iyNYqoM4RR0VD6xCvxdjZaDiyG2aeeRvOYC-pxORb81J64NltiqSXeR0mqeIunm2pPZoGSjTD2aJ8rdpRt3tAsBPccMaNIfP73O4Cmi9SgK2ILqBoXyZf48g5YojEB5Hye8KmM6bwH7-w4JJN1qXor0HiVAl7lNXC7f8Yw83DBXkzOL_QmP2fh1Y-qf8J-WmR9B_ZnmGDrLl-4BcBd8A4aQh0z7Qb6T6XlyVBGX64',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCDtdaWK8F0615sQMxP3VnFH7PqX8hfukTQNdFqCfI0mUAGilcNj76KgNop22uZqfNRn-jH46-xw39aZePvhuT64kc6lEWxlEaiTMdm6hgncgEyNaf-lSk5NFIcN9_SVUBD4idtu1DnxHfPQhsKLEWgqr25gU_pO3wc2uuGhk0RjbSVv5PMxsRr7W0IccPJYHO5_v6XlZIwfNssRAQDJ1R58G-nUPCpEK_Y2DUFo1Ah1MhN2O_WntEDtso_eTRztzpGb2dBoNtlDXyTnws'
];

export default function LobbyScreen({ onStartGame }: LobbyScreenProps) {
  const [selectedPlayers, setSelectedPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState(['NEON_WRAITH', '', '', '']);
  const [isLocal, setIsLocal] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
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

  const handleNameChange = (index: number, name: string) => {
    const next = [...playerNames];
    next[index] = name;
    setPlayerNames(next);
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
      className="bg-background text-on-background font-body overflow-x-hidden min-h-screen"
    >
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-transparent backdrop-blur-sm">
        <div className="text-xl font-bold tracking-tighter text-[#96f8ff] uppercase">VIBE EDITION</div>
        <div className="flex gap-6 items-center">
          <button 
            onClick={toggleMute} 
            className="text-[#96f8ff] hover:text-[#ff51fa] transition-all"
            aria-label={isMuted ? "Unmute music" : "Mute music"}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{isMuted ? 'volume_off' : 'volume_up'}</span>
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className="text-[#96f8ff] hover:text-[#ff51fa] transition-all"
            aria-label="Open settings"
          >
            <span className="material-symbols-outlined" aria-hidden="true">settings</span>
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-primary/40 overflow-hidden">
            <img src={AVATARS[0]} className="w-full h-full object-cover" alt="Profile" />
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
           <div className="bg-surface-container/95 backdrop-blur-2xl rounded-3xl p-8 border border-primary/20 w-80 max-w-[90vw]" onClick={e => e.stopPropagation()}>
            <h3 className="font-headline text-lg font-bold text-primary mb-6 flex items-center gap-2">SETTINGS</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between"><span>Version</span><span className="text-primary font-bold">2.0.6</span></div>
              <div className="flex justify-between"><span>Board</span><span>10 x 10</span></div>
            </div>
            <button onClick={() => setShowSettings(false)} className="mt-6 w-full py-2 rounded-xl border border-primary/30 text-primary text-xs uppercase tracking-widest">Close</button>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-0 bg-grid pointer-events-none opacity-20"></div>

      <main className="relative z-10 pt-8 pb-8 px-4 flex flex-col items-center max-w-5xl mx-auto w-full min-h-screen justify-center">
        <section className="text-center mb-4 space-y-1">
          <h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter text-primary uppercase leading-tight">
            SNAKES &amp; LADDERS<br />
            <span className="text-secondary text-2xl md:text-3xl">- VIBE EDITION -</span>
          </h1>
          <div className="flex justify-center gap-2 text-2xl animate-bounce">
            <span>🐍</span><span>⚡</span><span>🪜</span>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          <div className="space-y-4">
            <div className="bg-surface-container/40 backdrop-blur-xl rounded-2xl p-4 border border-primary/10">
              <h2 className="font-headline text-base font-bold mb-3 flex items-center gap-2 text-primary uppercase italic">GAME MODE</h2>
              <div className="flex gap-2" role="radiogroup" aria-label="Select Number of Players">
                {playerOptions.map(opt => (
                  <button
                    key={opt.count}
                    onClick={() => setSelectedPlayers(opt.count)}
                    role="radio"
                    aria-checked={selectedPlayers === opt.count}
                    aria-label={`${opt.count} Players - ${opt.label}`}
                    className={`flex-1 py-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                      selectedPlayers === opt.count ? 'bg-primary/20 border-2 border-primary shadow-[0_0_15px_rgba(150,248,255,0.3)]' : 'bg-surface-container-low border border-outline-variant/30 opacity-40'
                    }`}
                  >
                    <span className="text-2xl font-black" aria-hidden="true">{opt.count}P</span>
                    <span className="text-[8px] font-bold uppercase" aria-hidden="true">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface-container/40 backdrop-blur-xl rounded-2xl p-4 border border-secondary/10">
              <h2 className="font-headline text-base font-bold mb-3 flex items-center gap-2 text-secondary uppercase italic">SYSTEM CONFIG</h2>
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary tracking-wide">LOCAL VECTOR</span>
                  <span className="text-[9px] opacity-40 uppercase tracking-tighter">Bypass Quantum Sync</span>
                </div>
                <button 
                  onClick={() => setIsLocal(!isLocal)}
                  role="switch"
                  aria-checked={isLocal}
                  aria-label="Toggle Local Mode"
                  className={`w-10 h-5 rounded-full transition-colors relative ${isLocal ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isLocal ? 'left-5.5' : 'left-0.5'}`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container/40 backdrop-blur-xl rounded-2xl p-4 border border-secondary/10">
            <h2 className="font-headline text-base font-bold mb-3 text-secondary uppercase italic">PLAYER PROFILES</h2>
            <div className="space-y-3">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${selectedPlayers > i ? 'opacity-100' : 'opacity-20 pointer-events-none blur-[1px]'}`}>
                  <div className="w-10 h-10 rounded-full border-2 border-primary/40 overflow-hidden flex-shrink-0 shadow-lg">
                    <img src={AVATARS[i]} className="w-full h-full object-cover" alt={`Avatar ${i}`} />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <label htmlFor={`player-name-${i}`} className="text-[8px] tracking-[0.2em] opacity-40 uppercase font-black">PLAYER_{i + 1}</label>
                    <input
                      id={`player-name-${i}`}
                      className="w-full bg-transparent border-b border-outline-variant/30 py-0.5 text-base focus:outline-none focus:border-primary text-on-surface font-medium"
                      placeholder={i === 0 ? "NEON_WRAITH" : "IDENTIFIER..."}
                      aria-label={`Player ${i + 1} Name`}
                      value={playerNames[i]}
                      onChange={e => handleNameChange(i, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 relative">
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              onStartGame({ 
                playerCount: selectedPlayers, 
                playerNames: playerNames.map((n, i) => n || `Player ${i + 1}`),
                isLocal
              });
            }}
            aria-label="Start Game"
            className="flex items-center gap-3 bg-gradient-to-br from-primary to-primary-container px-10 py-3 rounded-full shadow-[0_0_30_px_rgba(150,248,255,0.3)] hover:scale-105 transition-all active:scale-95 group"
          >
            <span className="material-symbols-outlined text-xl text-on-primary-fixed group-hover:rotate-12 transition-transform" aria-hidden="true">play_arrow</span>
            <span className="text-lg font-black text-on-primary-fixed uppercase tracking-tighter">START GAME</span>
          </button>
        </div>
      </main>
    </motion.div>
  );
}
