import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopAppBar from '../components/TopAppBar';
import SideNavBar, { ChatMessage } from '../components/SideNavBar';
import Grid from '../components/Grid';
import PlayerToken from '../components/PlayerToken';
import { Player } from '../utils/gameLogic';
import { generateAIAssistantMessage } from '../services/aiService';
import { useGameState } from '../hooks/useGameState';

interface GameScreenProps {
  onBackToLobby: () => void;
}

// Simulated local player auth — in production this comes from Firebase Auth
const LOCAL_PLAYER_ID = 'p1';

export default function GameScreen({ onBackToLobby }: GameScreenProps) {
  const { gameState, loading, isMyTurn, currentPlayer, executeMove } = useGameState(LOCAL_PLAYER_ID);

  // UI-only local state (not synced to Firestore)
  const [isRolling, setIsRolling] = useState(false);
  const [latestRoll, setLatestRoll] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Track animated positions separately for the stepping animation
  const [animatedPositions, setAnimatedPositions] = useState<Record<string, number>>({});
  const prevGameStateRef = useRef(gameState);

  const pushMessage = (sender: string, text: string, isAI = false) => {
    setChatMessages(prev => [...prev, { id: Math.random().toString(36).substring(7), sender, text, isAI }]);
    setHasNewMessage(true);
  };

  // React to Firestore state changes from OTHER players
  useEffect(() => {
    const prev = prevGameStateRef.current;
    const curr = gameState;

    // Detect quantum event toggled by someone else
    if (!prev.isQuantumInverted && curr.isQuantumInverted) {
      pushMessage('SYSTEM', '⚠️ QUANTUM INVERSION! SNAKES ARE LADDERS. LADDERS ARE SNAKES.');
    } else if (prev.isQuantumInverted && !curr.isQuantumInverted) {
      pushMessage('SYSTEM', 'Quantum Inversion ended. Reality stabilized.');
    }

    // Detect another player's last move to fire AI commentary
    if (curr.lastMove && curr.lastMove.playerId !== LOCAL_PLAYER_ID) {
      if (prev.lastMove?.timestamp !== curr.lastMove.timestamp) {
        const movedPlayer = curr.players.find(p => p.id === curr.lastMove?.playerId);
        if (movedPlayer) {
          // Sync their animated position instantly (no step walk for remote players)
          setAnimatedPositions(pos => ({ ...pos, [movedPlayer.id]: movedPlayer.position }));
        }
      }
    }

    prevGameStateRef.current = curr;
  }, [gameState]);

  // Initialize and re-sync animated positions when Firestore players update
  useEffect(() => {
    if (!loading) {
      setAnimatedPositions(prev => {
        const next: Record<string, number> = { ...prev };
        gameState.players.forEach(p => {
          // Only update if we're not currently animating this player locally
          if (p.id !== LOCAL_PLAYER_ID || !isRolling) {
            next[p.id] = p.position;
          }
        });
        return next;
      });
    }
  }, [loading, gameState.players]);

  const handleRollDice = async () => {
    if (isRolling || !isMyTurn) return;
    setIsRolling(true);
    setHasNewMessage(false);

    const roll = Math.floor(Math.random() * 6) + 1;
    setLatestRoll(roll);

    // Step-by-step animation for local player only
    const startPos = currentPlayer?.position ?? 1;
    if (startPos + roll <= 100) {
      for (let i = 1; i <= roll; i++) {
        setAnimatedPositions(prev => ({ ...prev, [LOCAL_PLAYER_ID]: startPos + i }));
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } else {
      // Exceed 100: don't animate, keep token in place
      setAnimatedPositions(prev => ({ ...prev, [LOCAL_PLAYER_ID]: startPos }));
    }

    // Execute the atomic Firestore transaction
    const result = await executeMove(roll);

    if (result.triggeredEvent === 'EXCEED_100') {
      pushMessage('SYSTEM', 'Roll exceeds 100. Vector lock active.');
    } else if (result.triggeredEvent === 'SNAKE_HIT') {
      // Animate slide after a brief pause
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnimatedPositions(prev => ({ ...prev, [LOCAL_PLAYER_ID]: result.landed }));
      const roast = await generateAIAssistantMessage({
        type: 'SNAKE_HIT',
        playerName: currentPlayer?.name ?? 'Player',
        startTile: result.eventStart,
        endTile: result.eventEnd,
        luckStat: 15,
      });
      pushMessage('SHAKUNI [AI]', roast, true);
    } else if (result.triggeredEvent === 'LADDER_CLIMB') {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnimatedPositions(prev => ({ ...prev, [LOCAL_PLAYER_ID]: result.landed }));
      const props = await generateAIAssistantMessage({
        type: 'LADDER_CLIMB',
        playerName: currentPlayer?.name ?? 'Player',
        startTile: result.eventStart,
        endTile: result.eventEnd,
        luckStat: 85,
      });
      pushMessage('SHAKUNI [AI]', props, true);
    } else {
      // Normal tile — update animated position to final
      setAnimatedPositions(prev => ({ ...prev, [LOCAL_PLAYER_ID]: result.landed }));
    }

    setIsRolling(false);
  };

  // Map Firestore players into the Player interface for rendering tokens
  const renderPlayers: Player[] = gameState.players.map(p => ({
    id: p.id,
    name: p.name,
    position: animatedPositions[p.id] ?? p.position,
    avatarUrl: p.avatarUrl,
    color: p.color,
  }));

  const activePlayer = gameState.players[gameState.currentTurnIndex];
  const myPlayer = gameState.players.find(p => p.id === LOCAL_PLAYER_ID);
  const isDiceDisabled = isRolling || !isMyTurn || gameState.gameStatus === 'FINISHED';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-headline text-2xl animate-pulse">SYNCING QUANTUM FIELD...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 } }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.5 } }}
      className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary overflow-hidden min-h-screen"
    >
      <TopAppBar />
      <SideNavBar messages={chatMessages} hasNewMessage={hasNewMessage} />

      <main className="pt-24 pb-24 md:pb-8 px-6 h-screen flex flex-col items-center justify-center lg:pr-80 relative z-10">
        
        <div className="w-full max-w-4xl flex justify-between items-end mb-6">
          <div className="flex flex-col">
            <span className="font-label text-[10px] text-primary/60 tracking-[0.2em] uppercase">Current Vector</span>
            <h1 className="font-headline text-4xl font-black text-on-background -mt-1 tracking-tight">
              TILE {myPlayer?.position ?? 1}
            </h1>
            <span className="font-label text-[9px] text-on-surface-variant mt-1">
              {isMyTurn ? '🎯 YOUR TURN' : `⏳ Waiting for ${activePlayer?.name}...`}
            </span>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <span className={`font-label text-[10px] tracking-[0.2em] uppercase ${gameState.isQuantumInverted ? 'text-error animate-pulse' : 'text-secondary/60'}`}>
                {gameState.isQuantumInverted ? 'QUANTUM ANOMALY' : 'Luck Potential'}
              </span>
              <span className="font-headline text-lg font-bold text-secondary">
                {gameState.isQuantumInverted ? '??%' : `${100 - (myPlayer?.stats.unluckyPercentage ?? 0)}%`}
              </span>
            </div>
            <div className="w-64 h-2 bg-surface-container-lowest rounded-full relative overflow-hidden border border-outline-variant/10">
              <div
                className="absolute inset-0 bg-gradient-to-r from-error via-tertiary to-primary neon-glow-primary transition-all duration-500"
                style={{ width: `${100 - (myPlayer?.stats.unluckyPercentage ?? 0)}%` }}
              ></div>
              <div
                className="absolute top-0 w-[2px] h-full bg-on-background z-10 shadow-lg transition-all duration-500"
                style={{ left: `${100 - (myPlayer?.stats.unluckyPercentage ?? 0)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <Grid isQuantumInverted={gameState.isQuantumInverted}>
          <div className="absolute inset-0 pointer-events-none p-1 z-30">
            {renderPlayers.map(p => (
              <PlayerToken key={p.id} player={p} />
            ))}
          </div>
        </Grid>

        <div className="mt-8 flex items-center gap-6">
          <button 
            disabled={isDiceDisabled}
            onClick={handleRollDice} 
            className={`group relative px-8 py-4 rounded-xl overflow-hidden transition-all active:scale-95 ${isDiceDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container"></div>
            <div className="relative flex items-center gap-3">
              <span className="material-symbols-outlined text-on-primary font-bold">casino</span>
              <span className="font-headline font-black text-on-primary text-xl tracking-tight">
                {isRolling ? 'ROLLING...' : !isMyTurn ? 'WAITING...' : (latestRoll ? `ROLLED ${latestRoll}` : 'ENGAGE_DICE')}
              </span>
            </div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <div className="flex flex-col gap-1">
            <span className="font-label text-[9px] text-on-surface-variant uppercase">Next Multiplier</span>
            <div className={`px-4 py-2 rounded-lg bg-surface-container border ${gameState.isQuantumInverted ? 'border-error/50 shadow-[0_0_10px_rgba(255,0,0,0.5)]' : 'border-tertiary/20'}`}>
              <span className={`font-headline font-bold ${gameState.isQuantumInverted ? 'text-error' : 'text-tertiary'}`}>
                {gameState.isQuantumInverted ? 'INVERTED' : '2X LUCK'}
              </span>
            </div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 md:hidden bg-[#0d0d16]/95 backdrop-blur-md rounded-t-3xl border-t border-[#96f8ff]/20 shadow-[0_-8px_32px_rgba(0,243,255,0.1)]">
        <a href="#arena" className="flex flex-col items-center justify-center bg-[#96f8ff]/20 text-[#96f8ff] rounded-xl px-4 py-1 animate-pulse">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-['Space_Grotesk'] text-[10px] font-medium uppercase tracking-widest">Arena</span>
        </a>
        <a href="#comms" className="flex flex-col items-center justify-center text-[#f2effb]/50 hover:text-[#96f8ff] hover:bg-[#96f8ff]/10 p-2 rounded-xl transition-colors relative">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="font-['Space_Grotesk'] text-[10px] font-medium uppercase tracking-widest">Comms</span>
          {hasNewMessage && <span className="absolute top-1 right-2 w-2 h-2 bg-secondary rounded-full"></span>}
        </a>
        <a href="#rank" className="flex flex-col items-center justify-center text-[#f2effb]/50 hover:text-[#96f8ff] hover:bg-[#96f8ff]/10 p-2 rounded-xl transition-colors">
          <span className="material-symbols-outlined">military_tech</span>
          <span className="font-['Space_Grotesk'] text-[10px] font-medium uppercase tracking-widest">Rank</span>
        </a>
        <button onClick={onBackToLobby} className="flex flex-col items-center justify-center text-[#f2effb]/50 hover:text-[#error] hover:bg-[#error]/10 p-2 rounded-xl transition-colors">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-['Space_Grotesk'] text-[10px] font-medium uppercase tracking-widest">Exit</span>
        </button>
      </nav>
    </motion.div>
  );
}
