import { describe, it, expect } from 'vitest';
import { getCoords, SNAKES, LADDERS } from '../utils/gameLogic';

describe('Game Logic Utility', () => {
  it('should map tile 1 to bottom-left (0%, 90%)', () => {
    const coords = getCoords(1);
    expect(coords.x).toBe('0%');
    expect(coords.y).toBe('90%');
  });

  it('should map tile 10 to bottom-right (90%, 90%)', () => {
    const coords = getCoords(10);
    expect(coords.x).toBe('90%');
    expect(coords.y).toBe('90%');
  });

  it('should map tile 11 to one row up, right-most (90%, 80%)', () => {
    const coords = getCoords(11);
    expect(coords.x).toBe('90%'); // Reversed row
    expect(coords.y).toBe('80%');
  });

  it('should map tile 100 to top-left (0%, 0%)', () => {
    const coords = getCoords(100);
    expect(coords.x).toBe('0%');
    expect(coords.y).toBe('0%');
  });

  it('should handle out-of-bounds tiles', () => {
    expect(getCoords(0)).toEqual(getCoords(1));
    expect(getCoords(101)).toEqual(getCoords(100));
  });

  it('should have a consistent number of snakes and ladders', () => {
    expect(SNAKES.length).toBeGreaterThan(5);
    expect(LADDERS.length).toBeGreaterThan(5);
  });
});
