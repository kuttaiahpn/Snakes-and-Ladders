import React from 'react';
import { motion } from 'framer-motion';
import { getCoords, Player } from '../utils/gameLogic';

interface PlayerTokenProps {
  player: Player;
}

export default function PlayerToken({ player }: PlayerTokenProps) {
  const coords = getCoords(player.position);

  return (
    <motion.div
      initial={false}
      animate={{ 
        left: coords.x, 
        top: coords.y 
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 120, 
        damping: 14, 
        mass: 0.8 
      }}
      className="absolute w-[10%] h-[10%] flex items-center justify-center pointer-events-none z-30"
    >
      <div 
        className="w-6 h-6 rounded-full border-2 overflow-hidden shadow-[0_0_15px_rgba(var(--tw-shadow-color),0.5)] bg-surface-container"
        style={{ borderColor: player.color, boxShadow: `0 0 10px ${player.color}` }}
      >
        <img 
          src={player.avatarUrl} 
          alt={player.name}
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );
}
