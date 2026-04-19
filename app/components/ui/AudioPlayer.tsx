'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { Howl } from 'howler';

interface AudioPlayerProps {
  musicUrl?: string;
}

export function AudioPlayer({ musicUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const vinylRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (musicUrl && !soundRef.current) {
      soundRef.current = new Howl({
        src: [musicUrl],
        loop: true,
        volume: 0.5
      });

      return () => {
        soundRef.current?.unload();
        soundRef.current = null;
      };
    }
  }, [musicUrl]);

  const togglePlay = () => {
    if (!soundRef.current) return;

    if (soundRef.current.playing()) {
      soundRef.current.pause();
      setIsPlaying(false);
      if (animationRef.current) {
        animationRef.current.pause();
      }
    } else {
      soundRef.current.play();
      setIsPlaying(true);
      startVinylAnimation();
    }
  };

  const startVinylAnimation = () => {
    if (animationRef.current) {
      animationRef.current.kill();
    }

    if (vinylRef.current) {
      animationRef.current = gsap.to(vinylRef.current, {
        rotation: 360,
        duration: 3,
        repeat: -1,
        ease: 'linear'
      });
    }
  };

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.button
        onClick={togglePlay}
        className="relative w-16 h-16 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        disabled={!soundRef.current}
      >
        {/* Vinyl Record */}
        <motion.div
          ref={vinylRef}
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, #333 0%, #000 100%)',
            boxShadow: '0 0 30px rgba(255, 107, 157, 0.4)',
            willChange: 'transform'
          }}
          animate={isPlaying ? {} : { opacity: 0.7 }}
        >
          {/* Center label */}
          <div className="absolute w-6 h-6 rounded-full bg-gradient-to-r from-[#ff6b9d] to-[#ffd700] flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 bg-black rounded-full" />
          </div>

          {/* Vinyl grooves (visual effect) */}
          <div className="absolute inset-2 rounded-full border border-gray-700 opacity-30" />
          <div className="absolute inset-4 rounded-full border border-gray-700 opacity-20" />
        </motion.div>

        {/* Play/Pause icon */}
        <motion.div
          className="relative z-10 text-2xl"
          animate={{ scale: isPlaying ? 1.1 : 1 }}
        >
          {isPlaying ? '🎵' : '▶️'}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
