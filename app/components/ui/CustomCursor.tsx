'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TRAIL_LENGTH = 8;

interface TrailPoint {
  id: number;
  x: number;
  y: number;
}

export function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const newPoint: TrailPoint = {
        id: idRef.current++,
        x: e.clientX,
        y: e.clientY
      };

      trailRef.current = [newPoint, ...trailRef.current.slice(0, TRAIL_LENGTH - 1)];
      setTrail([...trailRef.current]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Main cursor - Beating heart */}
      <motion.div
        className="fixed w-8 h-8 pointer-events-none z-[9999]"
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
        transition={{ type: 'spring', stiffness: 600, damping: 30, mass: 0.5 }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-gradient-to-r from-[#ff6b9d] to-[#ffd700] shadow-lg shadow-[#ff6b9d] flex items-center justify-center text-2xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          ❤️
        </motion.div>
      </motion.div>

      {/* Trail hearts */}
      {trail.map((point, index) => {
        const opacity = 1 - index / TRAIL_LENGTH;
        const scale = 0.3 + opacity * 0.4;

        return (
          <motion.div
            key={point.id}
            className="fixed w-4 h-4 pointer-events-none"
            initial={{ x: point.x - 8, y: point.y - 8, opacity: opacity * 0.7, scale: scale }}
            animate={{ x: point.x - 8, y: point.y - 8, opacity: 0, scale: scale * 0.5 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ zIndex: 9998 - index }}
          >
            <div className="w-full h-full text-red-400">❤️</div>
          </motion.div>
        );
      })}

      <style>{`
        * {
          cursor: none !important;
        }
        button, a, input, textarea, [role="button"], [onclick] {
          pointer-events: auto !important;
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
