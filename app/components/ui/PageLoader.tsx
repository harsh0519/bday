'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface PageLoaderProps {
  isLoading?: boolean;
}

export function PageLoader({ isLoading = true }: PageLoaderProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0008]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="relative z-10 flex flex-col items-center gap-5 text-center px-6">
        <Image
          src="/gif/star1.gif"
          alt="Loading"
          width={160}
          height={160}
          unoptimized
          priority
        />

        <div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{
              background: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Loading your bestie surprise…
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-300">Just a sec — it’s worth it.</p>
        </div>
      </div>
    </motion.div>
  );
}
