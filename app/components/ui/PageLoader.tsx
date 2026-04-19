'use client';

import { motion } from 'framer-motion';

interface PageLoaderProps {
  isLoading?: boolean;
}

export function PageLoader({ isLoading = true }: PageLoaderProps) {
  // Floating heart animation
  const heartVariants = {
    animate: (index: number) => ({
      y: -300,
      opacity: 0,
      scale: 0.5,
      transition: {
        duration: 3,
        delay: index * 0.3,
        repeat: Infinity,
        repeatDelay: 0.5
      }
    })
  };

  // Pulsing scale animation
  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity
      }
    }
  };

  // Text animation
  const textVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
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
      transition={{ duration: 0.5 }}
    >
      {/* Animated background gradient circles */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 4,
            repeat: Infinity
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #ff6b9d, #ffd700, #ff6b9d)',
            opacity: 0.1,
            filter: 'blur(40px)'
          }}
        />
      </motion.div>

      {/* Main loader container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Central pulsing hearts container */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer rotating ring */}
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 4,
              repeat: Infinity
            }}
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: '#ff6b9d',
              borderRightColor: '#ffd700',
              opacity: 0.6
            }}
          />

          {/* Middle rotating ring */}
          <motion.div
            animate={{
              rotate: -360
            }}
            transition={{
              duration: 4,
              repeat: Infinity
            }}
            className="absolute inset-4 rounded-full border-2 border-transparent"
            style={{
              borderBottomColor: '#ff6b9d',
              borderLeftColor: '#ffd700',
              opacity: 0.4
            }}
          />

          {/* Central pulsing heart */}
          <motion.div
            animate="animate"
            variants={pulseVariants}
            className="text-6xl"
          >
            💕
          </motion.div>
        </div>

        {/* Floating hearts */}
        <div className="relative w-40 h-20 flex justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={`heart-${index}`}
              animate={{
                y: -300,
                opacity: 0,
                scale: 0.5
              }}
              transition={{
                duration: 3,
                delay: index * 0.3,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
              className="absolute text-4xl"
              style={{
                left: `${30 + index * 30}%`,
                bottom: 0
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

        {/* Loading text */}
        <motion.div
          animate="animate"
          variants={textVariants}
          className="mt-8 text-center space-y-2"
        >
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
          <p className="text-gray-400 text-sm font-serif italic">
            Something special is coming...
          </p>
        </motion.div>

        {/* Animated dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={`dot-${index}`}
              className="w-2 h-2 rounded-full bg-[#ff6b9d]"
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.3
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
