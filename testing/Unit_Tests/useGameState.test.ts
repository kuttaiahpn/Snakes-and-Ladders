import { describe, it, expect, vi } from 'vitest';
import { calculateNextState, GameState } from '../hooks/useGameState';

const mockInitialState: GameState = {
  players: [
    {
      id: 'p1',
      name: 'Tester',
      position: 1,
      avatarUrl: '',
      color: '#000',
      stats: { snakesHit: 0, laddersClimbed: 0, powerUpsUsed: 0, totalRolls: 0, luckyPercentage: 0, unluckyPercentage: 0 },
      isTurn: true
    },
    {
      id: 'p2',
      name: 'Bot',
      position: 1,
      avatarUrl: '',
      color: '#fff',
      stats: { snakesHit: 0, laddersClimbed: 0, powerUpsUsed: 0, totalRolls: 0, luckyPercentage: 0, unluckyPercentage: 0 },
      isTurn: false
    }
  ],
  gameStatus: 'ACTIVE',
  isQuantumInverted: false,
  quantumTurnsLeft: 0,
  currentTurnIndex: 0,
  turnCount: 0,
  lastMove: null
};

describe('useGameState Logical Transitions', () => {
  it('should move player 1 from tile 1 to tile 4 on roll 3', () => {
    const { newState, result } = calculateNextState(mockInitialState, 'p1', 3);
    expect(newState.players[0].position).toBe(4);
    expect(result.landed).toBe(4);
    expect(newState.currentTurnIndex).toBe(1); // Turn passed to p2
  });

  it('should stay put if roll exceeds 100', () => {
    const nearEndState = { ...mockInitialState, players: [{ ...mockInitialState.players[0], position: 98 }, mockInitialState.players[1]] };
    const { newState, result } = calculateNextState(nearEndState, 'p1', 5);
    expect(newState.players[0].position).toBe(98);
    expect(result.triggeredEvent).toBe('EXCEED_100');
  });

  it('should trigger a win if landing on 100', () => {
    const nearEndState = { ...mockInitialState, players: [{ ...mockInitialState.players[0], position: 95 }, mockInitialState.players[1]] };
    const { newState } = calculateNextState(nearEndState, 'p1', 5);
    expect(newState.players[0].position).toBe(100);
    expect(newState.gameStatus).toBe('FINISHED');
  });

  it('should handle Quantum Inversion state toggle', () => {
    // Force inversion manually by taking a state with inversion
    const invertedState: GameState = { ...mockInitialState, isQuantumInverted: true, quantumTurnsLeft: 2 };
    const { newState } = calculateNextState(invertedState, 'p1', 2);
    expect(newState.quantumTurnsLeft).toBe(1);
  });
});
