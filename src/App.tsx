import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';

export default function App() {
  const [view, setView] = useState<'LOBBY' | 'GAME'>('LOBBY');

  const handleStartGame = () => {
    setView('GAME');
  };

  const handleBackToLobby = () => {
    setView('LOBBY');
  };

  return (
    <AnimatePresence mode="wait">
      {view === 'LOBBY' && (
        <LobbyScreen key="lobby" onStartGame={handleStartGame} />
      )}

      {view === 'GAME' && (
        <GameScreen key="game" onBackToLobby={handleBackToLobby} />
      )}
    </AnimatePresence>
  );
}
