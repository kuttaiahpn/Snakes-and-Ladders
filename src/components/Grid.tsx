import React, { ReactNode } from 'react';
import { SNAKES, LADDERS, getCoords } from '../utils/gameLogic';

interface GridProps {
  isQuantumInverted: boolean;
  children?: ReactNode;
}

/**
 * Build Boustrophedon cell order:
 * Row 0 (bottom): 1→10 (L to R)
 * Row 1: 20→11 (R to L)
 * Row 2: 21→30 (L to R)
 * ... etc up to row 9 (top)
 * We render top-to-bottom in CSS, so we start from row 9 down to row 0.
 */
function buildBoustrophedonOrder(): number[] {
  const cells: number[] = [];
  for (let row = 9; row >= 0; row--) {
    const rowCells: number[] = [];
    for (let col = 0; col < 10; col++) {
      rowCells.push(row * 10 + col + 1);
    }
    // Even rows (0,2,4,...) go L→R, odd rows (1,3,5,...) go R→L
    // But since we're rendering top-down, we need to reverse odd rows
    if (row % 2 === 1) {
      rowCells.reverse();
    }
    cells.push(...rowCells);
  }
  return cells;
}

// Convert tile number to SVG viewport percentage coordinates (0-100 range)
function tileToSvgCoord(tile: number): { x: number; y: number } {
  const coords = getCoords(tile);
  const x = parseFloat(coords.x) + 5; // center of the 10% cell
  const y = parseFloat(coords.y) + 5;
  return { x, y };
}

// Build all snake/ladder head/tail tile sets for quick lookup
const snakeHeadTiles = new Set(SNAKES.map(s => s.head));
const snakeTailTiles = new Set(SNAKES.map(s => s.tail));
const ladderStartTiles = new Set(LADDERS.map(l => l.start));
const ladderEndTiles = new Set(LADDERS.map(l => l.end));

export default function Grid({ isQuantumInverted, children }: GridProps) {
  const cells = buildBoustrophedonOrder();

  const ladderColor = isQuantumInverted ? '#dc143c' : '#00ff41';
  const snakeColor = isQuantumInverted ? '#00ff41' : '#dc143c';
  const gridCss = isQuantumInverted ? 'hue-rotate-180 animate-pulse transition-all duration-1000' : 'transition-all duration-1000';

  return (
    <div 
      role="grid"
      aria-label="Snakes and Ladders Game Board"
      className={`relative w-full max-w-[min(60vh,95vw)] aspect-square bg-surface-container-lowest border-2 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)] rounded-xl overflow-hidden p-1 ${gridCss}`}
    >
      <div className="grid grid-cols-10 grid-rows-10 h-full w-full gap-0.5 relative z-10">
        {cells.map((cell) => {
          const isSnakeHead = snakeHeadTiles.has(cell);
          const isSnakeTail = snakeTailTiles.has(cell);
          const isLadderStart = ladderStartTiles.has(cell);
          const isLadderEnd = ladderEndTiles.has(cell);
          const isSpecial = isSnakeHead || isSnakeTail || isLadderStart || isLadderEnd;

          let bgClass = '';
          let marker = '';
          let ariaLabel = `Tile ${cell}`;
          
          if (isSnakeHead) { 
            bgClass = 'bg-red-900/30 border-red-500/40'; 
            marker = '🐍⬇'; 
            ariaLabel += ", Snake head, slides down";
          }
          else if (isSnakeTail) { bgClass = 'bg-red-900/15 border-red-500/20'; marker = '🐍'; }
          else if (isLadderStart) { 
            bgClass = 'bg-green-900/30 border-green-500/40'; 
            marker = '🪜⬆'; 
            ariaLabel += ", Ladder start, climbs up";
          }
          else if (isLadderEnd) { bgClass = 'bg-green-900/15 border-green-500/20'; marker = '🪜'; }

          if (cell === 1) ariaLabel += ", Start position";
          if (cell === 100) ariaLabel += ", Finish line";

          return (
            <div
              key={cell}
              role="gridcell"
              aria-label={ariaLabel}
              tabIndex={0}
              className={`relative p-0.5 border-2 shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)] group hover:border-primary transition-all cursor-crosshair flex flex-col items-start justify-between focus:ring-2 focus:ring-primary focus:outline-none
                ${isSpecial ? bgClass : 'border-outline-variant/10'}
                ${cell % 2 === 0 ? 'bg-surface-container/60' : 'bg-surface-container-high/40'}`}
            >
              <span aria-hidden="true" className="font-headline text-[8px] md:text-xs font-black opacity-90 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                {cell <= 1 || cell >= 100 ? '' : cell}
              </span>
              {marker && (
                <span aria-hidden="true" className="text-[7px] md:text-[9px] leading-none self-end">{marker}</span>
              )}
              {cell === 100 && (
                <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                  <span className="text-sm md:text-lg drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">🏆</span>
                  <span className="text-[8px] font-black text-secondary-container bg-secondary/20 px-1 rounded shadow-[0_0_5px_rgba(var(--secondary-rgb),0.5)]">HOME</span>
                </div>
              )}
              {cell === 1 && (
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-primary">START</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Snake/Ladder SVG Overlays — computed from actual tile positions */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Ladders */}
        {LADDERS.map((ladder, i) => {
          const start = tileToSvgCoord(ladder.start);
          const end = tileToSvgCoord(ladder.end);
          // Calculate angle for slanted rungs
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const angle = Math.atan2(dy, dx);
          const perpX = Math.cos(angle + Math.PI/2) * 1.5;
          const perpY = Math.sin(angle + Math.PI/2) * 1.5;

          return (
            <g key={`ladder-${i}`}>
              {/* Rails */}
              <line x1={start.x - perpX} y1={start.y - perpY} x2={end.x - perpX} y2={end.y - perpY}
                stroke={ladderColor} strokeWidth="0.4" opacity="0.8" />
              <line x1={start.x + perpX} y1={start.y + perpY} x2={end.x + perpX} y2={end.y + perpY}
                stroke={ladderColor} strokeWidth="0.4" opacity="0.8" />
              {/* Rungs — spaced evenly */}
              {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((t, ri) => {
                const px = start.x + dx * t;
                const py = start.y + dy * t;
                return (
                  <line key={ri} x1={px - perpX} y1={py - perpY} x2={px + perpX} y2={py + perpY}
                    stroke={ladderColor} strokeWidth="0.2" opacity="0.6" />
                );
              })}
              <circle cx={end.x} cy={end.y} r="0.8" fill={ladderColor} className="animate-pulse" />
            </g>
          );
        })}

        {/* Snakes */}
        {SNAKES.map((snake, i) => {
          const head = tileToSvgCoord(snake.head);
          const tail = tileToSvgCoord(snake.tail);
          // Alternating curve amplitudes
          const amplitude = i % 2 === 0 ? 15 : -15;
          const midX = (head.x + tail.x) / 2 + amplitude;
          const midY = (head.y + tail.y) / 2;
          return (
            <g key={`snake-${i}`}>
              <path
                d={`M ${head.x} ${head.y} Q ${midX} ${midY} ${tail.x} ${tail.y}`}
                fill="none" stroke={snakeColor} strokeWidth="1" opacity="0.9"
                strokeLinecap="round" strokeDasharray="1,2"
              />
              {/* Snake Head */}
              <circle cx={head.x} cy={head.y} r="1.2" fill="#ff4444" className="animate-pulse" />
              {/* Snake Tail */}
              <circle cx={tail.x} cy={tail.y} r="0.6" fill={snakeColor} opacity="0.6" />
            </g>
          );
        })}
      </svg>
      {children}
    </div>
  );
}
