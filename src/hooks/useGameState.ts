import { useState, useEffect } from 'react';
import { doc, onSnapshot, runTransaction, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { SNAKES, LADDERS } from '../utils/gameLogic';

// ─── Firestore Document Schema ──────────────────────────────────────
export interface FirestorePlayer {
  id: string;
  name: string;
  position: number;
  avatarUrl: string;
  color: string;
  stats: {
    snakesHit: number;
    laddersClimbed: number;
    unluckyPercentage: number;
  };
  isTurn: boolean;
}

export interface LastMove {
  playerId: string;
  roll: number;
  timestamp: number;
}

export interface GameState {
  players: FirestorePlayer[];
  gameStatus: 'LOBBY' | 'ACTIVE' | 'FINISHED';
  isQuantumInverted: boolean;
  quantumTurnsLeft: number;
  currentTurnIndex: number;
  turnCount: number;
  lastMove: LastMove | null;
}

// ─── Default Initial State ──────────────────────────────────────────
const DEFAULT_GAME_STATE: GameState = {
  players: [
    {
      id: 'p1',
      name: 'Vapor_01',
      position: 1,
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxCiLh-hMq9fmX0fKdhiPqILokcEKtcUXMT_WhGogzegehbZplz1o-j3r7sb2MVp5HFTw0AS0howSzTU4p3uosaR-Om2SLuNntabvFB0EcYS1ZTR5edG9waa0AoxR_NJg5HGajK1JVaDGE2mgijrihsGJvEAuzfBGRUAEwdtZmoSN_WHVSjMSfs0fLwaWYEAFn_2AjjlwxS3uFgqd1GtWLqwbYBYOqZ0TTO4yjitjWN_rzxGoAtQo72CP_Gh3S4648m8qilZLJw5I',
      color: '#96f8ff',
      stats: { snakesHit: 0, laddersClimbed: 0, unluckyPercentage: 0 },
      isTurn: true,
    },
    {
      id: 'p2',
      name: 'Neon_Soul',
      position: 1,
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAXnMRRPS1wvWCO7nMKwr7ZVs8V38Q8nYxx4L42s_qTcIAoZtcqDF1EXZl1HUmGjM9EzA31y-cac1tXk0dJrVgAjoMCRZLmaZu7ZuR6UJ2pcaramkIzEEUsb-IZqYnMd1YsjsUetZmat1DDgX2nd4ZzVLuRu8TgmkfhsoZJCqsv9cLQ4d3__9mfgRAnxnG7yGMHNI35eeEDdMHwxYlbAzQD3jE1SE1oISibHpH3xz9DwTl5B7fIMqHsmJpZyd-nVxEUlDLmBh-QHs',
      color: '#ff51fa',
      stats: { snakesHit: 0, laddersClimbed: 0, unluckyPercentage: 0 },
      isTurn: false,
    },
  ],
  gameStatus: 'ACTIVE',
  isQuantumInverted: false,
  quantumTurnsLeft: 0,
  currentTurnIndex: 0,
  turnCount: 0,
  lastMove: null,
};

const GAME_DOC_PATH = 'games/VIBE_ROOM_01';

// ─── The Hook ───────────────────────────────────────────────────────

export function useGameState(localPlayerId: string) {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener via onSnapshot
  useEffect(() => {
    const docRef = doc(db, GAME_DOC_PATH);

    // Seed the document if it doesn't exist
    const seedIfNeeded = async () => {
      try {
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          await setDoc(docRef, DEFAULT_GAME_STATE);
        }
      } catch (e) {
        console.warn('Firestore seed check failed (offline or no project). Using local fallback.', e);
        setLoading(false);
      }
    };
    seedIfNeeded();

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setGameState(snapshot.data() as GameState);
        }
        setLoading(false);
      },
      (err) => {
        console.error('onSnapshot error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ── Derived helpers ────────────────────────────────────────────
  const isMyTurn = gameState.players[gameState.currentTurnIndex]?.id === localPlayerId;

  const currentPlayer = gameState.players.find(p => p.id === localPlayerId);

  // ── Atomic Move via runTransaction ────────────────────────────
  const executeMove = async (roll: number): Promise<{ landed: number; triggeredEvent: string | null; eventStart: number; eventEnd: number }> => {
    const docRef = doc(db, GAME_DOC_PATH);
    let result = { landed: 0, triggeredEvent: null as string | null, eventStart: 0, eventEnd: 0 };

    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(docRef);
        if (!snap.exists()) throw new Error('Game document missing');

        const data = snap.data() as GameState;
        const playerIndex = data.players.findIndex(p => p.id === localPlayerId);
        if (playerIndex === -1) throw new Error('Player not in game');
        if (data.currentTurnIndex !== playerIndex) throw new Error('Not your turn');

        const player = { ...data.players[playerIndex], stats: { ...data.players[playerIndex].stats } };
        const startPos = player.position;

        // Rule: if roll exceeds 100, stay put but still advance turn
        if (startPos + roll > 100) {
          const nextTurnIndex = (data.currentTurnIndex + 1) % data.players.length;
          transaction.update(docRef, {
            currentTurnIndex: nextTurnIndex,
            turnCount: data.turnCount + 1,
            lastMove: { playerId: localPlayerId, roll, timestamp: Date.now() },
          });
          result = { landed: startPos, triggeredEvent: 'EXCEED_100', eventStart: startPos, eventEnd: startPos };
          return;
        }

        let finalPos = startPos + roll;
        let triggeredEvent: string | null = null;
        let eventStart = finalPos;
        let eventEnd = finalPos;

        // Check snakes/ladders
        if (!data.isQuantumInverted) {
          const snake = SNAKES.find(s => s.head === finalPos);
          if (snake) {
            eventStart = finalPos;
            finalPos = snake.tail;
            eventEnd = finalPos;
            triggeredEvent = 'SNAKE_HIT';
            player.stats.snakesHit += 1;
          }
          const ladder = LADDERS.find(l => l.start === finalPos);
          if (ladder && !triggeredEvent) {
            eventStart = finalPos;
            finalPos = ladder.end;
            eventEnd = finalPos;
            triggeredEvent = 'LADDER_CLIMB';
            player.stats.laddersClimbed += 1;
          }
        } else {
          // INVERTED LOGIC
          const invertedSnake = SNAKES.find(s => s.tail === finalPos);
          if (invertedSnake) {
            eventStart = finalPos;
            finalPos = invertedSnake.head;
            eventEnd = finalPos;
            triggeredEvent = 'LADDER_CLIMB'; // Inverted snake = climb
            player.stats.laddersClimbed += 1;
          }
          const invertedLadder = LADDERS.find(l => l.end === finalPos);
          if (invertedLadder && !triggeredEvent) {
            eventStart = finalPos;
            finalPos = invertedLadder.start;
            eventEnd = finalPos;
            triggeredEvent = 'SNAKE_HIT'; // Inverted ladder = drop
            player.stats.snakesHit += 1;
          }
        }

        // Recalculate luck
        const totalEvents = player.stats.snakesHit + player.stats.laddersClimbed;
        player.stats.unluckyPercentage = totalEvents > 0 
          ? Math.round((player.stats.snakesHit / totalEvents) * 100) 
          : 0;

        player.position = finalPos;

        const updatedPlayers = [...data.players];
        updatedPlayers[playerIndex] = player;

        const nextTurnIndex = (data.currentTurnIndex + 1) % data.players.length;
        const newTurnCount = data.turnCount + 1;

        // Quantum Inversion trigger/decay
        let newQuantumInverted = data.isQuantumInverted;
        let newQuantumTurnsLeft = data.quantumTurnsLeft;

        if (data.isQuantumInverted) {
          newQuantumTurnsLeft -= 1;
          if (newQuantumTurnsLeft <= 0) {
            newQuantumInverted = false;
            newQuantumTurnsLeft = 0;
          }
        } else if (newTurnCount > 2 && Math.random() < 0.15) {
          newQuantumInverted = true;
          newQuantumTurnsLeft = 3;
        }

        transaction.update(docRef, {
          players: updatedPlayers,
          currentTurnIndex: nextTurnIndex,
          turnCount: newTurnCount,
          isQuantumInverted: newQuantumInverted,
          quantumTurnsLeft: newQuantumTurnsLeft,
          lastMove: { playerId: localPlayerId, roll, timestamp: Date.now() },
          gameStatus: finalPos === 100 ? 'FINISHED' : data.gameStatus,
        });

        result = { landed: finalPos, triggeredEvent, eventStart, eventEnd };
      });
    } catch (e: any) {
      console.error('Transaction failed:', e);
      setError(e.message);
    }

    return result;
  };

  // ── Force Quantum Inversion (for manual trigger) ──────────────
  const triggerQuantumEvent = async () => {
    const docRef = doc(db, GAME_DOC_PATH);
    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(docRef);
        if (!snap.exists()) return;
        transaction.update(docRef, {
          isQuantumInverted: true,
          quantumTurnsLeft: 3,
        });
      });
    } catch (e) {
      console.error('Quantum event trigger failed:', e);
    }
  };

  return {
    gameState,
    loading,
    error,
    isMyTurn,
    currentPlayer,
    executeMove,
    triggerQuantumEvent,
  };
}
