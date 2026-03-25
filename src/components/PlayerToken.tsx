import React from 'react';
import { motion } from 'framer-motion';
import { getCoords, Player } from '../utils/gameLogic';

interface PlayerTokenProps {
  player: Player;
}

export default function PlayerToken({ player }: PlayerTokenProps) {
  const coords = getCoords(player.position);

  // Small random offset so tokens on the same tile don't fully overlap
  const hash = player.id.charCodeAt(player.id.length - 1) % 4;
  const offsets = [
    { dx: 0, dy: 0 },
    { dx: 2, dy: 2 },
    { dx: -2, dy: 2 },
    { dx: 2, dy: -2 },
  ];
  const { dx, dy } = offsets[hash];

  return (
    <motion.div
      initial={false}
      animate={{
        left: coords.x,
        top: coords.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 14,
        mass: 0.8,
      }}
      className="absolute w-[10%] h-[10%] flex items-center justify-center pointer-events-none z-30"
      style={{ marginLeft: dx, marginTop: dy }}
    >
      <div
        className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 overflow-hidden bg-surface-container"
        style={{ borderColor: player.color, boxShadow: `0 0 12px ${player.color}` }}
      >
        <img
          src={player.avatarUrl}
          alt={player.name}
          className="w-full h-full object-cover"
        />
      </div>
      <span
        className="absolute -bottom-1 text-[7px] md:text-[8px] font-bold uppercase tracking-tight whitespace-nowrap px-1 rounded bg-black/60"
        style={{ color: player.color }}
      >
        {player.name.slice(0, 8)}
      </span>
    </motion.div>
  );
}
