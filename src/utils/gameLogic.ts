export const SNAKES = [
  { head: 98, tail: 28 },
  { head: 85, tail: 45 },
  { head: 55, tail: 15 }
];

export const LADDERS = [
  { start: 10, end: 40 },
  { start: 25, end: 65 },
  { start: 43, end: 77 }
];

/**
 * Returns absolute positioning percentages (x, y) for a given tile number (1-100)
 * Uses Boustrophedon layout: Tile 1 is Bottom-Left, Tile 10 is Bottom-Right, Tile 11 is moving Right-to-Left above it, etc.
 * Tile 100 sits at Top-Left.
 */
export function getCoords(tileNumber: number): { x: string; y: string } {
  // Bound check
  if (tileNumber < 1) tileNumber = 1;
  if (tileNumber > 100) tileNumber = 100;

  const zeroBasedTile = tileNumber - 1;
  const rowIndex = Math.floor(zeroBasedTile / 10); // 0 (bottom) to 9 (top)
  
  // Even rows go L to R (0 to 9), Odd rows go R to L (9 to 0)
  const isRowEven = rowIndex % 2 === 0;
  const colIndex = isRowEven 
    ? (zeroBasedTile % 10) 
    : (9 - (zeroBasedTile % 10));

  // If container is relative, top-left is 0,0.
  // bottom row (rowIndex=0) means y = 90% (since each tile is 10% height)
  // X = colIndex * 10%
  const xPercent = colIndex * 10;
  const yPercent = 90 - (rowIndex * 10);

  return {
    x: `${xPercent}%`,
    y: `${yPercent}%`
  };
}

export interface Player {
  id: string;
  name: string;
  position: number;
  avatarUrl: string;
  color: string;
}
