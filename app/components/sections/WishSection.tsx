'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { createConfetti, createBalloons } from '@/lib/confetti';
import { useEasterEggs } from '@/lib/useEasterEggs';
import { StarfieldBackdrop } from '@/components/ui/StarfieldBackdrop';

export function WishSection() {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const flamesRef = useRef<(HTMLDivElement | null)[]>([]);

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

    // Blow out candles
    flamesRef.current.forEach((flame, i) => {
      if (flame) {
        gsap.to(flame, {
          opacity: 0,
          duration: 0.2,
          delay: i * 0.05
        });
      }
    });

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
        {/* Floating wish GIFs */}
        <motion.div className="absolute top-20 left-12 w-32 h-32 z-5 pointer-events-none" animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <Image src="/gif/wish1.gif" alt="wish1" width={128} height={128} unoptimized />
        </motion.div>
        <motion.div className="absolute bottom-20 right-16 w-28 h-28 z-5 pointer-events-none" animate={{ y: [0, 20, 0], rotate: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <Image src="/gif/wish2.gif" alt="wish2" width={112} height={112} unoptimized />
        </motion.div>
        <motion.div className="absolute top-1/3 right-20 w-24 h-24 z-5 pointer-events-none" animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity }}>
          <Image src="/gif/wish3.gif" alt="wish3" width={96} height={96} unoptimized />
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
          className="relative w-80 h-72 mb-16"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Cake body */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-32 bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-b-3xl shadow-2xl">
            {/* Frosting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-8 bg-gradient-to-r from-[#ff6b9d] to-[#ffe6f0] rounded-full" />
          </div>

          {/* Candles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`candle-${i}`}
              className="absolute left-1/2 bottom-32 -translate-x-1/2 w-2 h-16 bg-[#ff6b6b] rounded-sm cursor-pointer"
              style={{
                marginLeft: `${(i - 1) * 40}px`,
                willChange: 'transform'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 + 0.5 }}
              whileHover={{ scale: 1.1 }}
              onDoubleClick={handleBlow}
            >
              {/* Flame */}
              <motion.div
                ref={(el) => {
                  if (el) flamesRef.current[i] = el;
                }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-[#ffff00] to-[#ff6b6b] rounded-full opacity-1"
                animate={
                  !candlesBlown
                    ? {
                        scaleY: [1, 1.1, 1],
                        boxShadow: [
                          '0 0 10px rgba(255, 255, 0, 0.5)',
                          '0 0 15px rgba(255, 107, 107, 0.7)',
                          '0 0 10px rgba(255, 255, 0, 0.5)'
                        ]
                      }
                    : {}
                }
                transition={{
                  duration: 0.3,
                  repeat: !candlesBlown ? Infinity : 0,
                  repeatType: 'loop'
                }}
              />
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
