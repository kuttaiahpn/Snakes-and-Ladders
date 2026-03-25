import React from 'react';

export default function Grid() {
  const cells = Array.from({ length: 100 }, (_, i) => 100 - i);

  return (
    <div className="relative w-full max-w-[min(70vh,90%)] aspect-square bg-surface-container-lowest border border-primary/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(150,248,255,0.1)] p-1">
      <div className="grid grid-cols-10 grid-rows-10 h-full w-full gap-0.5 relative z-10">
        {cells.map((cell, index) => {
          const isDarker = index % 2 === 0;
          return (
            <div 
              key={cell} 
              className={`${isDarker ? 'grid-cell-checker-1' : 'grid-cell-checker-2'} relative p-1 border border-outline-variant/5 group hover:border-primary/40 transition-colors cursor-crosshair`}
            >
              <span className="font-label text-[9px] text-on-surface-variant group-hover:text-primary">{cell}</span>
              
              {/* Examples of specific cell states based on ID - mockup logic */}
              {cell === 100 && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-primary text-lg">trophy</span>
                </div>
              )}
              {cell === 98 && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/5 border-secondary/20 border">
                  <span className="material-symbols-outlined text-secondary animate-pulse">storm</span>
                </div>
              )}
              {cell === 42 && (
                <div className="absolute inset-0 flex items-center justify-center border-2 border-primary bg-primary/10 shadow-[inset_0_0_15px_rgba(150,248,255,0.3)]">
                  <div className="w-6 h-6 rounded-full border-2 border-primary neon-glow-primary animate-bounce">
                    <img alt="Active Player" className="w-full h-full rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAXnMRRPS1wvWCO7nMKwr7ZVs8V38Q8nYxx4L42s_qTcIAoZtcqDF1EXZl1HUmGjM9EzA31y-cac1tXk0dJrVgAjoMCRZLmaZu7ZuR6UJ2pcaramkIzEEUsb-IZqYnMd1YsjsUetZmat1DDgX2nd4ZzVLuRu8TgmkfhsoZJCqsv9cLQ4d3__9mfgRAnxnG7yGMHNI35eeEDdMHwxYlbAzQD3jE1SE1oISibHpH3xz9DwTl5B7fIMqHsmJpZyd-nVxEUlDLmBh-QHs" />
                  </div>
                </div>
              )}
              {cell === 43 && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5 border border-primary/20">
                  <span className="material-symbols-outlined text-primary">bolt</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Visual Overlays (Snakes & Ladders) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Energy Beam (Ladder) Mock */}
        <line x1="25" y1="55" x2="15" y2="15" stroke="#96f8ff" strokeWidth="0.5" strokeDasharray="1,1"></line>
        <circle cx="15" cy="15" r="1.5" fill="#96f8ff" className="animate-pulse"></circle>
        
        {/* Gravity Well (Snake) Mock */}
        <path d="M 85 15 Q 95 35 75 45 T 85 85" fill="none" stroke="#ff51fa" strokeWidth="0.8" strokeDasharray="2,1"></path>
        <circle cx="85" cy="85" r="1.5" fill="#ff51fa"></circle>
      </svg>
    </div>
  );
}
