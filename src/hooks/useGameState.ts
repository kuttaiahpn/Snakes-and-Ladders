import { useState, useEffect } from 'react';
import { doc, onSnapshot, runTransaction, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { SNAKES, LADDERS } from '../utils/gameLogic';

// ─── Firestore Document Schema ──────────────────────────────────────
import { LobbyConfig } from '../App.tsx';

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
    powerUpsUsed: number;
    totalRolls: number;
    luckyPercentage: number;
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
const AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBxCiLh-hMq9fmX0fKdhiPqILokcEKtcUXMT_WhGogzegehbZplz1o-j3r7sb2MVp5HFTw0AS0howSzTU4p3uosaR-Om2SLuNntabvFB0EcYS1ZTR5edG9waa0AoxR_NJg5HGajK1JVaDGE2mgijrihsGJvEAuzfBGRUAEwdtZmoSN_WHVSjMSfs0fLwaWYEAFn_2AjjlwxS3uFgqd1GtWLqwbYBYOqZ0TTO4yjitjWN_rzxGoAtQo72CP_Gh3S4648m8qilZLJw5I',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAXnMRRPS1wvWCO7nMKwr7ZVs8V38Q8nYxx4L42s_qTcIAoZtcqDF1EXZl1HUmGjM9EzA31y-cac1tXk0dJrVgAjoMCRZLmaZu7ZuR6UJ2pcaramkIzEEUsb-IZqYnMd1YsjsUetZmat1DDgX2nd4ZzVLuRu8TgmkfhsoZJCqsv9cLQ4d3__9mfgRAnxnG7yGMHNI35eeEDdMHwxYlbAzQD3jE1SE1oISibHpH3xz9DwTl5B7fIMqHsmJpZyd-nVxEUlDLmBh-QHs',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA1ljG13B6ysMft7G0U3Gb-VI4BZPDt7pTyG8iyNYqoM4RR0VD6xCvxdjZaDiyG2aeeRvOYC-pxORb81J64NltiqSXeR0mqeIunm2pPZoGSjTD2aJ8rdpRt3tAsBPccMaNIfP73O4Cmi9SgK2ILqBoXyZf48g5YojEB5Hye8KmM6bwH7-w4JJN1qXor0HiVAl7lNXC7f8Yw83DBXkzOL_QmP2fh1Y-qf8J-WmR9B_ZnmGDrLl-4BcBd8A4aQh0z7Qb6T6XlyVBGX64',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCDtdaWK8F0615sQMxP3VnFH7PqX8hfukTQNdFqCfI0mUAGilcNj76KgNop22uZqfNRn-jH46-xw39aZePvhuT64kc6lEWxlEaiTMdm6hgncgEyNaf-lSk5NFIcN9_SVUBD4idtu1DnxHfPQhsKLEWgqr25gU_pO3wc2uuGhk0RjbSVv5PMxsRr7W0IccPJYHO5_v6XlZIwfNssRAQDJ1R58G-nUPCpEK_Y2DUFo1Ah1MhN2O_WntEDtso_eTRztzpGb2dBoNtlDXyTnws'
];

const COLORS = ['#96f8ff', '#ff51fa', '#00ff41', '#ffea00'];

const createInitialState = (config?: LobbyConfig): GameState => {
  const players: FirestorePlayer[] = [];
  const count = config?.playerCount ?? 2;
  const names = config?.playerNames ?? ['Vapor_01', 'Neon_Soul', 'Zero_K', 'Moxie_R'];

  for (let i = 0; i < count; i++) {
    players.push({
      id: `p${i + 1}`,
      name: names[i] || `Operator_0${i + 1}`,
      position: 1,
      avatarUrl: AVATARS[i % AVATARS.length],
      color: COLORS[i % COLORS.length],
      stats: { snakesHit: 0, laddersClimbed: 0, powerUpsUsed: 0, totalRolls: 0, luckyPercentage: 0, unluckyPercentage: 0 },
      isTurn: i === 0,
    });
  }

  return {
    players,
    gameStatus: 'ACTIVE',
    isQuantumInverted: false,
    quantumTurnsLeft: 0,
    currentTurnIndex: 0,
    turnCount: 0,
    lastMove: null,
  };
};

const GAME_DOC_PATH = 'games/VIBE_ROOM_01';

// ─── Move Calculator (Shared Logic) ────────────────────────────────
export const calculateNextState = (
  currentState: GameState, 
  playerId: string, 
  roll: number
): { newState: GameState; result: { landed: number; triggeredEvent: string | null; eventStart: number; eventEnd: number } } => {
  const data = JSON.parse(JSON.stringify(currentState)) as GameState; // Deep clone
  const playerIndex = data.players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) throw new Error('Player not in game');
  if (data.currentTurnIndex !== playerIndex) throw new Error('Not your turn');

  const player = data.players[playerIndex];
  const startPos = player.position;

  // Rule: if roll exceeds 100, stay put but still advance turn
  if (startPos + roll > 100) {
    data.currentTurnIndex = (data.currentTurnIndex + 1) % data.players.length;
    data.turnCount += 1;
    data.lastMove = { playerId, roll, timestamp: Date.now() };
    return { newState: data, result: { landed: startPos, triggeredEvent: 'EXCEED_100', eventStart: startPos, eventEnd: startPos } };
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
      triggeredEvent = 'LADDER_CLIMB';
      player.stats.laddersClimbed += 1;
    }
    const invertedLadder = LADDERS.find(l => l.end === finalPos);
    if (invertedLadder && !triggeredEvent) {
      eventStart = finalPos;
      finalPos = invertedLadder.start;
      eventEnd = finalPos;
      triggeredEvent = 'SNAKE_HIT';
      player.stats.snakesHit += 1;
    }
  }

  player.stats.totalRolls += 1;
  const rolls = player.stats.totalRolls;
  player.stats.luckyPercentage = rolls > 0 ? Math.round(((player.stats.laddersClimbed + player.stats.powerUpsUsed) / rolls) * 100) : 0;
  player.stats.unluckyPercentage = rolls > 0 ? Math.round((player.stats.snakesHit / rolls) * 100) : 0;
  player.position = finalPos;

  data.players[playerIndex] = player;
  data.currentTurnIndex = (data.currentTurnIndex + 1) % data.players.length;
  data.turnCount += 1;

  // Quantum Inversion
  if (data.isQuantumInverted) {
    data.quantumTurnsLeft -= 1;
    if (data.quantumTurnsLeft <= 0) {
      data.isQuantumInverted = false;
      data.quantumTurnsLeft = 0;
    }
  } else if (data.turnCount > 2 && Math.random() < 0.15) {
    data.isQuantumInverted = true;
    data.quantumTurnsLeft = 3;
  }

  data.lastMove = { playerId, roll, timestamp: Date.now() };
  data.gameStatus = finalPos === 100 ? 'FINISHED' : data.gameStatus;

  return { newState: data, result: { landed: finalPos, triggeredEvent, eventStart, eventEnd } };
};

// ─── The Hook ───────────────────────────────────────────────────────

export function useGameState(localPlayerId: string, lobbyConfig?: LobbyConfig) {
  const isLocal = lobbyConfig?.isLocal ?? false;
  const [gameState, setGameState] = useState<GameState>(() => {
    if (isLocal) {
      const saved = localStorage.getItem('VIBE_GAME_LOCAL');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return createInitialState(lobbyConfig);
        }
      }
    }
    return createInitialState(lobbyConfig);
  });
  const [loading, setLoading] = useState(!isLocal);
  const [error, setError] = useState<string | null>(null);

  // Persistence for LOCAL mode
  useEffect(() => {
    if (isLocal) {
      localStorage.setItem('VIBE_GAME_LOCAL', JSON.stringify(gameState));
    }
  }, [gameState, isLocal]);

  // Firebase Listener (only if NOT local)
  useEffect(() => {
    if (isLocal) return;

    const docRef = doc(db, GAME_DOC_PATH);
    const seedIfNeeded = async () => {
      try {
        const snap = await getDoc(docRef);
        if (!snap.exists() || (lobbyConfig && snap.data()?.gameStatus === 'LOBBY')) {
          await setDoc(docRef, createInitialState(lobbyConfig));
        } else if (lobbyConfig) {
          await setDoc(docRef, createInitialState(lobbyConfig));
        }
      } catch (e) {
        console.warn('Firestore seed failed.', e);
        setLoading(false);
      }
    };
    seedIfNeeded();

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) setGameState(snapshot.data() as GameState);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [lobbyConfig, isLocal]);

  const isMyTurn = gameState.players[gameState.currentTurnIndex]?.id === localPlayerId;
  const currentPlayer = gameState.players.find(p => p.id === localPlayerId);

  const executeMove = async (roll: number): Promise<{ landed: number; triggeredEvent: string | null; eventStart: number; eventEnd: number }> => {
    if (isLocal) {
      try {
        const { newState, result } = calculateNextState(gameState, localPlayerId, roll);
        setGameState(newState);
        return result;
      } catch (e: any) {
        setError(e.message);
        return { landed: currentPlayer?.position ?? 1, triggeredEvent: null, eventStart: 1, eventEnd: 1 };
      }
    }

    // FIREBASE TRANSACTION
    const docRef = doc(db, GAME_DOC_PATH);
    let finalResult = { landed: currentPlayer?.position ?? 1, triggeredEvent: null as string | null, eventStart: 1, eventEnd: 1 };

    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(docRef);
        const data = snap.exists() ? (snap.data() as GameState) : createInitialState(lobbyConfig);
        
        try {
          const { newState, result } = calculateNextState(data, localPlayerId, roll);
          transaction.set(docRef, newState);
          finalResult = result;
        } catch (innerErr: any) {
          throw innerErr;
        }
      });
    } catch (e: any) {
      setError(e.message);
    }
    return finalResult;
  };

  const triggerQuantumEvent = async () => {
    if (isLocal) {
      setGameState(prev => ({ ...prev, isQuantumInverted: true, quantumTurnsLeft: 3 }));
      return;
    }
    const docRef = doc(db, GAME_DOC_PATH);
    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(docRef);
        if (snap.exists()) transaction.update(docRef, { isQuantumInverted: true, quantumTurnsLeft: 3 });
      });
    } catch (e) { console.error(e); }
  };

  return { gameState, loading, error, isMyTurn, currentPlayer, executeMove, triggerQuantumEvent };
}
