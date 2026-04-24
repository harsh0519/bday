'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

type SectionTheme = 'romantic' | 'golden' | 'dreamy' | 'vintage' | 'celebration';
type EntranceDirection = 'up' | 'left' | 'right' | 'fade';

interface ThemeStyle {
  aura: string;
  edge: string;
}

const THEME_STYLES: Record<SectionTheme, ThemeStyle> = {
  romantic: {
    aura: 'radial-gradient(circle at 25% 20%, rgba(255,107,157,0.2), rgba(255,107,157,0) 52%)',
    edge: 'linear-gradient(180deg, rgba(255,107,157,0.12), rgba(255,215,0,0.04) 40%, rgba(10,0,8,0))'
  },
  golden: {
    aura: 'radial-gradient(circle at 75% 15%, rgba(255,215,0,0.22), rgba(255,215,0,0) 54%)',
    edge: 'linear-gradient(180deg, rgba(255,215,0,0.14), rgba(255,107,157,0.05) 45%, rgba(10,0,8,0))'
  },
  dreamy: {
    aura: 'radial-gradient(circle at 50% 12%, rgba(255,179,217,0.2), rgba(255,179,217,0) 55%)',
    edge: 'linear-gradient(180deg, rgba(255,179,217,0.1), rgba(255,107,157,0.05) 45%, rgba(10,0,8,0))'
  },
  vintage: {
    aura: 'radial-gradient(circle at 20% 18%, rgba(245,230,200,0.18), rgba(245,230,200,0) 56%)',
    edge: 'linear-gradient(180deg, rgba(245,230,200,0.12), rgba(255,215,0,0.05) 45%, rgba(10,0,8,0))'
  },
  celebration: {
    aura: 'radial-gradient(circle at 80% 18%, rgba(255,215,0,0.2), rgba(255,107,157,0.08) 35%, rgba(255,107,157,0) 60%)',
    edge: 'linear-gradient(180deg, rgba(255,107,157,0.12), rgba(255,215,0,0.12) 45%, rgba(10,0,8,0))'
  }
};

interface SectionWrapperProps {
  children: React.ReactNode;
  horizontalScroll?: boolean;
  className?: string;
  theme?: SectionTheme;
  entrance?: EntranceDirection;
}

export function SectionWrapper({
  children,
  horizontalScroll = false,
  className = '',
  theme = 'romantic',
  entrance = 'up'
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const themeStyle = THEME_STYLES[theme];

  const initialByEntrance: Record<EntranceDirection, { opacity: number; y?: number; x?: number; filter?: string }> = {
    up: { opacity: 0, y: 70, filter: 'blur(6px)' },
    left: { opacity: 0, x: -70, filter: 'blur(6px)' },
    right: { opacity: 0, x: 70, filter: 'blur(6px)' },
    fade: { opacity: 0, filter: 'blur(4px)' }
  };

  return (
    <motion.section
      ref={sectionRef}
      className={`w-full min-h-screen flex items-center justify-center bg-[#0a0008] relative overflow-hidden isolate ${className}`}
      initial={initialByEntrance[entrance]}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.22, margin: '-8% 0px -12% 0px' }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: themeStyle.aura }}
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: themeStyle.edge }}
      />
      <div className={`relative z-10 ${horizontalScroll ? 'h-screen overflow-x-auto overflow-y-hidden' : 'w-full'}`}>
        {children}
      </div>
    </motion.section>
  );
}
