'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Howl } from 'howler';
import { useEasterEggs } from '@/lib/useEasterEggs';
import { StarfieldBackdrop } from '@/components/ui/StarfieldBackdrop';

export function LoveLetterSection() {
  const [isOpen, setIsOpen] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (config.musicUrl && !soundRef.current) {
      soundRef.current = new Howl({
        src: [config.musicUrl],
        loop: true,
        volume: 0.3
      });

      return () => {
        soundRef.current?.unload();
        soundRef.current = null;
      };
    }
  }, []);

  // Easter egg: Press "open" to open the letter
  useEasterEggs([
    {
      keys: ['o', 'p', 'e', 'n'],
      action: () => {
        setIsOpen(true);
        if (soundRef.current && !soundRef.current.playing()) {
          soundRef.current.play();
        }
        // Burst effect
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            duration: 0.3,
            filter: 'brightness(1.5)',
            repeat: 1,
            yoyo: true
          });
        }
      }
    }
  ]);

  const handleOpen = () => {
    setIsOpen(true);
    if (soundRef.current && !soundRef.current.playing()) {
      soundRef.current.play();
    }
  };

  return (
    <SectionWrapper
      theme="vintage"
      entrance="up"
      background={<StarfieldBackdrop className="absolute inset-0" />}
    >
      <div 
        ref={containerRef}
        className="min-h-screen w-full flex items-center justify-center relative z-10"
      >
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
          Love Letter
        </motion.div>

        <motion.div
          className="relative w-80 h-56"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        >
          {/* Envelope */}
          <motion.div
            className="relative w-full h-full bg-[#f5e6c8] border-4 border-[#ffd700] rounded-sm flex items-center justify-center cursor-pointer shadow-2xl"
            onClick={handleOpen}
            animate={{ scale: isOpen ? 0.95 : 1 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)' }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Flap */}
            <motion.div
              ref={flapRef}
              className="absolute top-0 left-0 w-full h-1/2 bg-[#e8d4b8] border-4 border-b-0 border-[#ffd700] flex items-center justify-center flex-col"
              animate={{ rotateX: isOpen ? -120 : 0 }}
              transition={{ duration: 0.6 }}
              style={{
                transformOrigin: 'top',
                transformStyle: 'preserve-3d'
              }}
            >
              <span className="text-5xl mb-2">💌</span>
              <p className="text-sm text-gray-700 font-serif">Click to open</p>
            </motion.div>

            {/* Letter inside */}
            {!isOpen && (
              <motion.div className="text-center" initial={{ opacity: 1 }} animate={{ opacity: isOpen ? 0 : 1 }}>
                <p className="text-gray-600 font-serif text-sm">Open Letter</p>
              </motion.div>
            )}
          </motion.div>

          {/* Letter content when opened */}
          {isOpen && (
            <motion.div
              ref={letterRef}
              className="absolute -bottom-96 left-1/2 -translate-x-1/2 w-96 bg-[#f5e6c8] rounded-lg p-8 shadow-2xl max-h-96 overflow-y-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-xs text-gray-600 mb-4 font-serif">Today</p>
              <div className="space-y-4">
                {config.letterContent
                  .split('\n')
                  .map((line, idx) => (
                    <motion.p
                      key={idx}
                      className="text-sm text-gray-800 font-serif leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {line}
                    </motion.p>
                  ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
