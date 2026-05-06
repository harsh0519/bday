'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { useEasterEggs } from '@/lib/useEasterEggs';
import { StarfieldBackdrop } from '@/components/ui/StarfieldBackdrop';

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
        setMagicMode(prev => !prev);
        
        // Create multiple star cards with all reasons
        if (magicMode === false) {
          const allCards = config.loveReasons.map((reason, index) => ({
            id: Date.now() + index,
            reason: reason,
            position: { 
              x: window.innerWidth * (0.2 + Math.random() * 0.6),
              y: window.innerHeight * (0.2 + Math.random() * 0.6)
            }
          }));
          setStarCards(allCards);
        } else {
          setStarCards([]);
        }
        
        // Trigger brightness flash animation
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            duration: 0.3,
            filter: 'brightness(1.5)',
            repeat: 2,
            yoyo: true,
            ease: 'power2.inOut'
          });
        }
      }
    }
  ]);

  return (
    <SectionWrapper
      theme="dreamy"
      entrance="right"
      background={
        <div ref={containerRef} className="absolute inset-0">
          <StarfieldBackdrop className="absolute inset-0" />
        </div>
      }
    >
      <div className="relative w-full min-h-screen">
        {/* Floating star GIFs - Center positioned */}
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-80 w-40 h-40 z-5 pointer-events-none" animate={{ y: [0, -25, 0], rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <Image src="/gif/star1.gif" alt="star1" width={155} height={155} unoptimized />
        </motion.div>
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-64 w-36 h-36 z-5 pointer-events-none" animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity }}>
          <Image src="/gif/star2.gif" alt="star2" width={145} height={145} unoptimized />
        </motion.div>

        {/* Spread intro.gif around the section */}
        <motion.div className="absolute top-20 left-16 w-32 h-32 z-5 pointer-events-none" animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <Image src="/gif/intro.gif" alt="intro-left" width={130} height={130} unoptimized />
        </motion.div>
        <motion.div className="absolute top-20 right-16 w-32 h-32 z-5 pointer-events-none" animate={{ y: [0, -15, 0] }} transition={{ duration: 5.5, repeat: Infinity }}>
          <Image src="/gif/intro2.gif" alt="intro-right" width={130} height={130} unoptimized />
        </motion.div>
        <motion.div className="absolute bottom-20 left-1/4 w-28 h-28 z-5 pointer-events-none" animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <Image src="/gif/intro3.gif" alt="intro-bottom-left" width={110} height={110} unoptimized />
        </motion.div>
        <motion.div className="absolute bottom-20 right-1/4 w-28 h-28 z-5 pointer-events-none" animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <Image src="/gif/intro4.gif" alt="intro-bottom-right" width={110} height={110} unoptimized />
        </motion.div>
        
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
          Why I Like You
        </motion.div>

        {/* Clickable area with visual feedback */}
        <div 
          className="absolute inset-0 z-5 cursor-pointer hover:bg-[#ff6b9d]/5 transition-all duration-300" 
          onClick={handleClick}
          style={{
            backgroundImage: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 107, 157, 0.1) 0%, transparent 80%)'
          }}
        />

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
            <p>Add Like reasons to see them here!</p>
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
            Click anywhere to reveal reasons why I Like you ✨
          </motion.p>
        )}
      </div>
    </SectionWrapper>
  );
}
