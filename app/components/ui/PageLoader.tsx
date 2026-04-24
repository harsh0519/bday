'use client';

import { motion } from 'framer-motion';

interface PageLoaderProps {
  isLoading?: boolean;
}

export function PageLoader({ isLoading = true }: PageLoaderProps) {
  const pulseVariants = {
    animate: {
      scale: [1, 1.15, 1],
      transition: {
        duration: 1.4,
        repeat: Infinity
      }
    }
  };

  const textVariants = {
    animate: {
      opacity: [0.45, 1, 0.45],
      transition: {
        duration: 1.8,
        repeat: Infinity
      }
    }
  };

  if (!isLoading) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0008]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #ff6b9d, #ffd700, #ff6b9d)',
            opacity: 0.12,
            filter: 'blur(36px)'
          }}
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: '#ff6b9d',
              borderRightColor: '#ffd700',
              opacity: 0.65
            }}
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 rounded-full border-2 border-transparent"
            style={{
              borderBottomColor: '#ff6b9d',
              borderLeftColor: '#ffd700',
              opacity: 0.45
            }}
          />

          <motion.div animate="animate" variants={pulseVariants} className="text-6xl">
            💕
          </motion.div>
        </div>

        <motion.div animate="animate" variants={textVariants} className="mt-2 text-center">
          <h2
            className="text-2xl font-bold"
            style={{
              background: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Loading Your Moment
          </h2>
          <p className="mt-2 text-sm italic text-gray-400">Something special is coming...</p>
        </motion.div>

        <div className="mt-2 flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="h-2 w-2 rounded-full bg-[#ff6b9d]"
              animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1, 0.85] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
