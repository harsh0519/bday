'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { createConfetti, createBalloons } from '@/lib/confetti';
import { useEasterEggs } from '@/lib/useEasterEggs';
import { StarfieldBackdrop } from '@/components/ui/StarfieldBackdrop';

// Custom flame component with realistic animation
function RealFlame({ isBlown }: { isBlown: boolean }) {
  const flameRef = useRef<HTMLDivElement>(null);
  const innerFlameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isBlown || !flameRef.current) return;

    // Blow animation - flames spread and disappear
    const ctx = gsap.context(() => {
      gsap.to(flameRef.current, {
        duration: 0.4,
        scaleY: 2.5,
        scaleX: 3,
        opacity: 0,
        x: Math.random() * 60 - 30, // Random horizontal scatter
        ease: 'power2.in'
      });
    });

    return () => ctx.revert();
  }, [isBlown]);

  return (
    <motion.div
      ref={flameRef}
      className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-10 pointer-events-none"
      style={{
        willChange: 'transform, opacity'
      }}
    >
      {/* Outer flame - orange/red */}
      <motion.div
        className="absolute inset-0 rounded-full blur-sm"
        style={{
          background: 'radial-gradient(ellipse at center, #ff8800 0%, #ff4400 50%, #cc0000 100%)',
        }}
        animate={!isBlown ? {
          scaleY: [1, 1.15, 0.95, 1.1, 1],
          scaleX: [1, 0.95, 1.05, 0.98, 1],
          y: [0, -3, 2, -1, 0],
        } : {}}
        transition={{
          duration: 0.4,
          repeat: !isBlown ? Infinity : 0,
          repeatType: 'loop',
          ease: 'easeInOut'
        }}
      />

      {/* Inner flame - yellow/white hot */}
      <motion.div
        ref={innerFlameRef}
        className="absolute inset-1 rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, #ffff99 0%, #ffff00 30%, #ffaa00 70%, transparent 100%)',
        }}
        animate={!isBlown ? {
          scaleY: [1, 1.2, 0.9, 1.15, 1],
          scaleX: [1, 0.9, 1.1, 0.95, 1],
          y: [0, -2, 3, -2, 0],
          opacity: [0.9, 1, 0.8, 0.95, 0.9]
        } : {}}
        transition={{
          duration: 0.35,
          repeat: !isBlown ? Infinity : 0,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay: 0.05
        }}
      />

      {/* Glow effect */}
      {!isBlown && (
        <motion.div
          className="absolute -inset-4 rounded-full pointer-events-none"
          style={{
            boxShadow: '0 0 20px rgba(255, 140, 0, 0.6), 0 0 40px rgba(255, 68, 0, 0.4)',
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(255, 140, 0, 0.6), 0 0 40px rgba(255, 68, 0, 0.4)',
              '0 0 25px rgba(255, 140, 0, 0.8), 0 0 50px rgba(255, 68, 0, 0.5)',
              '0 0 20px rgba(255, 140, 0, 0.6), 0 0 40px rgba(255, 68, 0, 0.4)',
            ]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'loop'
          }}
        />
      )}
    </motion.div>
  );
}

export function WishSection() {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Easter egg: Press "blow" to trigger candles
  useEasterEggs([
    {
      keys: ['b', 'l', 'o', 'w'],
      action: () => {
        // Auto-trigger blow
        const blowBtn = pageRef.current?.querySelector('button');
        if (blowBtn) {
          blowBtn.click();
        }
      }
    }
  ]);

  const handleBlow = async () => {
    setCandlesBlown(true);

    // Wait then explode confetti/balloons
    setTimeout(() => {
      if (pageRef.current) {
        createConfetti(pageRef.current);
        createBalloons(pageRef.current);
      }
    }, 300);
  };

  return (
    <SectionWrapper
      theme="celebration"
      entrance="fade"
      background={<StarfieldBackdrop className="absolute inset-0" />}
    >
      <div
        ref={pageRef}
        className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden z-10"
      >
        {/* Floating wish GIFs - Around the cake */}
        <motion.div className="absolute top-1/2 -translate-y-1/2 left-16 w-28 h-28 z-5 pointer-events-none" animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <Image src="/gif/wish1.gif" alt="wish1" width={110} height={110} unoptimized />
        </motion.div>
        <motion.div className="absolute top-1/2 -translate-y-1/2 right-16 w-24 h-24 z-5 pointer-events-none" animate={{ y: [0, 20, 0], rotate: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <Image src="/gif/wish2.gif" alt="wish2" width={95} height={95} unoptimized />
        </motion.div>
        
        <motion.div
          className="absolute top-12 left-12 text-5xl font-bold"
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
          Make a Wish
        </motion.div>

        {/* Cake */}
        <motion.div
          className="relative w-96 h-80 mb-16"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Center wish GIF - Top of the cake (kept away from the final message) */}
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 z-20 pointer-events-none"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
          >
            <Image src="/gif/wish3.gif" alt="wish3" width={95} height={95} unoptimized />
          </motion.div>

          {/* Bottom cake layer */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-b from-[#8B4513] via-[#7a3d0a] to-[#5c2e08] rounded-3xl shadow-2xl border-4 border-[#6b340a]">
            {/* Bottom frosting drip */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-64 h-3 bg-gradient-to-r from-[#ff6b9d] via-[#ffb3d9] to-[#ffe6f0] rounded-full blur-sm opacity-80" />
          </div>

          {/* Middle cake layer */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-56 h-24 bg-gradient-to-b from-[#9B5223] via-[#8B4513] to-[#6b340a] rounded-3xl shadow-xl border-4 border-[#7a3d0a]">
            {/* Middle frosting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-4 bg-gradient-to-r from-[#ff6b9d] to-[#ffe6f0] rounded-t-full shadow-md" />
            {/* Middle frosting drip */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-56 h-2 bg-gradient-to-r from-[#ff6b9d] via-[#ffb3d9] to-[#ffe6f0] rounded-full blur-sm opacity-80" />
          </div>

          {/* Candles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`candle-${i}`}
              className="absolute w-3 h-24 bg-gradient-to-b from-[#fffacd] to-[#fff8dc] rounded-sm cursor-pointer shadow-lg"
              style={{
                bottom: '160px',
                left: '50%',
                marginLeft: `${(i - 1) * 50}px`,
                transform: 'translateX(-50%)',
                willChange: 'transform',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3), inset -1px -1px 3px rgba(0, 0, 0, 0.1)'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 + 0.5 }}
              whileHover={!candlesBlown ? { scale: 1.08 } : {}}
              onDoubleClick={handleBlow}
            >
              {/* Candle wick */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-gray-600" />
              
              {/* Real flame component */}
              <RealFlame isBlown={candlesBlown} />
            </motion.div>
          ))}
        </motion.div>

        {/* Blow Button */}
        <motion.button
          onClick={handleBlow}
          disabled={candlesBlown}
          className="px-8 py-4 text-xl font-bold rounded-full bg-gradient-to-r from-[#ff6b9d] to-[#ffd700] text-black mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          whileHover={!candlesBlown ? { scale: 1.05 } : {}}
          whileTap={!candlesBlown ? { scale: 0.95 } : {}}
          style={{
            boxShadow: '0 0 20px rgba(255, 107, 157, 0.5)',
            willChange: 'transform'
          }}
        >
          {candlesBlown ? '🎉 Made a Wish!' : 'Blow Out the Candles'}
        </motion.button>

        {/* Final Message */}
        {candlesBlown && (
          <motion.div
            className="text-4xl font-bold text-center max-w-2xl px-4 absolute bottom-20"
            style={{
              background: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {config.finalMessage}
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  );
}
