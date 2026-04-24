'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { useEasterEggs } from '@/lib/useEasterEggs';

interface StarCard {
  id: number;
  reason: string;
  position: { x: number; y: number };
}

export function StarsSection() {
  const [starCards, setStarCards] = useState<StarCard[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [magicMode, setMagicMode] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (config.loveReasons.length === 0) return;

    const randomReason = config.loveReasons[Math.floor(Math.random() * config.loveReasons.length)];
    const newCard: StarCard = {
      id: Date.now(),
      reason: randomReason,
      position: { x: e.clientX, y: e.clientY }
    };
    setStarCards([...starCards, newCard]);

    setTimeout(() => {
      setStarCards((prev) => prev.filter((card) => card.id !== newCard.id));
    }, 4000);
  };

  // Easter egg: Press "magic" to reveal all reasons at once
  useEasterEggs([
    {
      keys: ['m', 'a', 'g', 'i', 'c'],
      action: () => {
        setMagicMode(!magicMode);
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            duration: 0.5,
            filter: magicMode ? 'brightness(1)' : 'brightness(1.3)',
            repeat: 1,
            yoyo: true
          });
        }
      }
    }
  ]);

  return (
    <SectionWrapper theme="dreamy" entrance="right">
      <div 
        ref={containerRef}
        className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#0a0008] z-0"
      />

      <motion.div
        className="absolute top-12 left-12 text-5xl font-bold z-10 pointer-events-none"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        style={{
          background: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Why I Love You
      </motion.div>

      <div className="absolute inset-0 z-5" onClick={handleClick} />

      <AnimatePresence>
        {starCards.map((card) => (
          <motion.div
            key={card.id}
            className="fixed p-4 rounded-lg backdrop-blur-xl border border-[#ff6b9d]/30 bg-[#ff6b9d]/10 max-w-xs z-20"
            style={{
              left: card.position.x,
              top: card.position.y
            }}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            drag
            dragElastic={0.2}
            whileHover={{ scale: 1.05 }}
            whileDrag={{ scale: 1.1, rotateZ: 5 }}
          >
            <p className="text-[#ffb3d9] text-center font-serif italic">{card.reason}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      {config.loveReasons.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-10">
          <p>Add love reasons to see them here!</p>
        </div>
      )}

      {/* Interaction hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <p className="text-gray-400 text-sm">Click anywhere to reveal why I love you... (or type &ldquo;magic&rdquo;)</p>
      </motion.div>

      {config.loveReasons.length > 0 && (
        <motion.p 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm z-10"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Click anywhere to reveal reasons why I love you ✨
        </motion.p>
      )}
    </SectionWrapper>
  );
}
