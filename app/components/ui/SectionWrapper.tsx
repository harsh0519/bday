'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

type SectionTheme = 'romantic' | 'golden' | 'dreamy' | 'vintage' | 'celebration';
type EntranceDirection = 'up' | 'left' | 'right' | 'fade';

interface SectionWrapperProps {
  children: React.ReactNode;
  horizontalScroll?: boolean;
  className?: string;
  theme?: SectionTheme;
  entrance?: EntranceDirection;
  background?: React.ReactNode;
}

export function SectionWrapper({
  children,
  horizontalScroll = false,
  className = '',
  theme = 'romantic',
  entrance = 'up',
  background
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const initialByEntrance: Record<EntranceDirection, { opacity: number; y?: number; x?: number; filter?: string }> = {
    up: { opacity: 0, y: 70, filter: 'blur(6px)' },
    left: { opacity: 0, x: -70, filter: 'blur(6px)' },
    right: { opacity: 0, x: 70, filter: 'blur(6px)' },
    fade: { opacity: 0, filter: 'blur(4px)' }
  };

  void theme;

  return (
    <motion.section
      ref={sectionRef}
      className={`w-full min-h-screen flex items-center justify-center bg-[#0a0008] relative overflow-hidden isolate ${className}`}
      initial={initialByEntrance[entrance]}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.22, margin: '-8% 0px -12% 0px' }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
    >
      {background ? (
        <div className="absolute inset-0 z-0">{background}</div>
      ) : null}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(10,0,8,0.72) 0%, rgba(10,0,8,0.88) 65%)'
        }}
      />
      <div className={`relative z-10 ${horizontalScroll ? 'h-screen overflow-x-auto overflow-y-hidden' : 'w-full'}`}>
        {children}
      </div>
    </motion.section>
  );
}
