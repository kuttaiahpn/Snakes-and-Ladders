export const SNAKES = [
  { head: 99, tail: 54 },
  { head: 95, tail: 75 },
  { head: 92, tail: 73 },
  { head: 83, tail: 19 },
  { head: 64, tail: 36 },
  { head: 48, tail: 30 },
  { head: 16, tail: 6 },
  { head: 35, tail: 7 },
  { head: 58, tail: 4 },
  { head: 58, tail: 4 },
];

export const LADDERS = [
  { start: 2, end: 38 },
  { start: 8, end: 31 },
  { start: 21, end: 42 },
  { start: 28, end: 84 },
  { start: 51, end: 67 },
  { start: 71, end: 91 },
  { start: 60, end: 81 },
];

/**
 * Returns absolute positioning percentages (x, y) for a given tile number (1-100)
 * Uses Boustrophedon layout: Tile 1 is Bottom-Left, Tile 10 is Bottom-Right,
 * Tile 11 is above Tile 20 (Right-to-Left), etc.
 * Tile 100 sits at Top-Left.
 */
export function getCoords(tileNumber: number): { x: string; y: string } {
  if (tileNumber < 1) tileNumber = 1;
  if (tileNumber > 100) tileNumber = 100;

  const zeroBasedTile = tileNumber - 1;
  const rowIndex = Math.floor(zeroBasedTile / 10); // 0 (bottom) to 9 (top)

  // Even rows go L to R, Odd rows go R to L
  const isRowEven = rowIndex % 2 === 0;
  const colIndex = isRowEven
    ? (zeroBasedTile % 10)
    : (9 - (zeroBasedTile % 10));

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
