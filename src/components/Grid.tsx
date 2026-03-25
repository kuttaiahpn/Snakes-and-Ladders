import React, { ReactNode } from 'react';

interface GridProps {
  isQuantumInverted: boolean;
  children?: ReactNode;
}

export default function Grid({ isQuantumInverted, children }: GridProps) {
  const cells = Array.from({ length: 100 }, (_, i) => 100 - i);
  
  // Quantum Inversion UI overrides
  const ladderColor = isQuantumInverted ? '#dc143c' : '#00ff00'; // Green normal, Crimson inverted
  const snakeColor = isQuantumInverted ? '#00ff00' : '#dc143c';   // Crimson normal, Green inverted
  const gridCss = isQuantumInverted ? 'hue-rotate-180 animate-pulse transition-all duration-1000' : 'transition-all duration-1000';

  return (
    <div className={`relative w-full max-w-[min(70vh,90%)] aspect-square bg-surface-container-lowest border border-primary/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(150,248,255,0.1)] p-1 ${gridCss}`}>
      <div className="grid grid-cols-10 grid-rows-10 h-full w-full gap-0.5 relative z-10">
        {cells.map((cell, index) => {
          const isDarker = index % 2 === 0;
          return (
            <div 
              key={cell} 
              className={`${isDarker ? 'grid-cell-checker-1' : 'grid-cell-checker-2'} relative p-1 border border-outline-variant/5 group hover:border-primary/40 transition-colors cursor-crosshair`}
            >
              <span className="font-label text-[9px] text-on-surface-variant group-hover:text-primary">{cell}</span>
              
              {/* Examples of specific cell states based on ID - visual only */}
              {cell === 100 && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-primary text-lg">trophy</span>
                </div>
              )}
              {cell === 98 && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/5 border-secondary/20 border">
                  <span className="material-symbols-outlined text-secondary animate-pulse" style={{ color: snakeColor }}>storm</span>
                </div>
              )}
              {cell === 43 && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5 border border-primary/20">
                  <span className="material-symbols-outlined text-primary" style={{ color: ladderColor }}>bolt</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Visual Overlays (Snakes & Ladders) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Energy Beam (Ladder) Mock */}
        <line x1="25" y1="55" x2="15" y2="15" stroke={ladderColor} strokeWidth="0.5" strokeDasharray="1,1"></line>
        <circle cx="15" cy="15" r="1.5" fill={ladderColor} className="animate-pulse"></circle>
        
        {/* Gravity Well (Snake) Mock */}
        <path d="M 85 15 Q 95 35 75 45 T 85 85" fill="none" stroke={snakeColor} strokeWidth="0.8" strokeDasharray="2,1"></path>
        <circle cx="85" cy="85" r="1.5" fill={snakeColor}></circle>
      </svg>
      {children}
    </div>
  );
}
