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
  const isEnabled = Boolean(musicUrl);

  useEffect(() => {
    if (musicUrl && !soundRef.current) {
      soundRef.current = new Howl({
        src: [musicUrl],
        loop: true,
        volume: 0.5
      });

      return () => {
        animationRef.current?.kill();
        soundRef.current?.unload();
        soundRef.current = null;
      };
    }

    return () => {
      animationRef.current?.kill();
    };
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
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.button
        onClick={togglePlay}
        className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full border border-[#ffd700]/25 bg-black/35 backdrop-blur-sm transition-colors duration-300 disabled:opacity-45 disabled:cursor-not-allowed"
        whileHover={isEnabled ? { scale: 1.08 } : {}}
        whileTap={isEnabled ? { scale: 0.96 } : {}}
        disabled={!isEnabled}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        title={isEnabled ? (isPlaying ? 'Pause music' : 'Play music') : 'Music unavailable'}
        type="button"
      >
        {/* Ambient glow for depth and better lighting */}
        <motion.div
          className="absolute -inset-2 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255,107,157,0.35) 0%, rgba(255,215,0,0.14) 40%, rgba(255,107,157,0) 75%)'
          }}
          animate={{
            opacity: isPlaying ? [0.45, 0.8, 0.45] : 0.35,
            scale: isPlaying ? [0.98, 1.08, 0.98] : 1
          }}
          transition={{
            duration: 2.4,
            repeat: isPlaying ? Infinity : 0,
            ease: 'easeInOut'
          }}
        />

        {/* Vinyl Record */}
        <motion.div
          ref={vinylRef}
          className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 30% 25%, #4a4a4a 0%, #161616 38%, #050505 100%)',
            boxShadow: '0 0 24px rgba(255, 107, 157, 0.35), inset 0 0 20px rgba(255, 255, 255, 0.08)',
            willChange: 'transform'
          }}
          animate={isPlaying ? { opacity: 1 } : { opacity: 0.78 }}
          transition={{ duration: 0.25 }}
        >
          {/* Specular highlight */}
          <div
            className="absolute top-2 left-3 w-7 h-3 rounded-full blur-sm"
            style={{ background: 'rgba(255,255,255,0.25)' }}
          />

          {/* Center label */}
          <div className="absolute w-6 h-6 rounded-full bg-gradient-to-r from-[#ff6b9d] to-[#ffd700] flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 bg-black rounded-full" />
          </div>

          {/* Vinyl grooves (visual effect) */}
          <div className="absolute inset-2 rounded-full border border-gray-700 opacity-30" />
          <div className="absolute inset-4 rounded-full border border-gray-700 opacity-20" />
          <div className="absolute inset-6 rounded-full border border-gray-700/50 opacity-25" />
        </motion.div>

        {/* Play/Pause icon */}
        <motion.div
          className="relative z-10 text-xl md:text-2xl select-none"
          animate={{ scale: isPlaying ? 1.06 : 1, opacity: isEnabled ? 1 : 0.65 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        >
          {isEnabled ? (isPlaying ? '🎵' : '▶') : '🔇'}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
