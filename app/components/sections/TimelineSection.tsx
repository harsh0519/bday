'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';

interface MemoryCardProps {
  memory: typeof config.memories[0];
  index: number;
}

function MemoryCard({ memory, index }: MemoryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative flex-shrink-0 w-80 h-96 cursor-pointer"
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay: index * 0.1
      }}
      whileHover={{ y: -10 }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <motion.div
          className="absolute w-full h-full p-8 rounded-2xl backdrop-blur-xl border border-[#ff6b9d]/30 bg-gradient-to-br from-[#ff6b9d]/10 to-[#ffd700]/10 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div>
            <div className="text-sm font-bold text-[#ffd700]">{memory.date}</div>
            <div className="text-2xl font-bold text-[#ff6b9d] mt-2">{memory.title}</div>
            <p className="text-gray-300 mt-4">{memory.description}</p>
          </div>
          <div className="text-5xl">{memory.emoji}</div>
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute w-full h-full p-8 rounded-2xl backdrop-blur-xl border border-[#ffd700]/30 bg-gradient-to-br from-[#ffd700]/10 to-[#ff6b9d]/10 flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <p className="text-[#ffe6f0] text-center font-serif italic">{memory.note}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Horizontal scroll animation can be added here with ScrollTrigger
    });

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper pin horizontalScroll>
      <div className="h-screen w-screen flex items-center justify-start">
        <motion.div
          className="absolute top-12 left-12 text-5xl font-bold"
          style={{
            background: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Our Memories
        </motion.div>

        <div
          ref={containerRef}
          className="flex gap-8 px-12 py-8 overflow-x-auto overflow-y-hidden h-full scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          {config.memories.length > 0 ? (
            config.memories.map((memory, i) => (
              <MemoryCard key={i} memory={memory} index={i} />
            ))
          ) : (
            <div className="flex items-center justify-center w-full text-gray-400">
              <p>Add memories to see them here!</p>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
