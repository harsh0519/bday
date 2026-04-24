'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function PageProgress() {
  const [activeSection, setActiveSection] = useState(1);
  const sections = 6;

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      const newSection = Math.min(Math.floor(progress * sections) + 1, sections);
      setActiveSection(newSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-8 left-1/2 -translate-x-1/2 flex gap-4 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {Array.from({ length: sections }).map((_, i) => {
        const sectionNum = i + 1;
        const isActive = activeSection === sectionNum;

        return (
          <motion.div
            key={sectionNum}
            className="relative"
            animate={{
              scale: isActive ? 1.2 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.button
              className="text-2xl cursor-pointer bg-transparent border-none p-0 m-0"
              animate={{ opacity: isActive ? 1 : 0.4 }}
              whileHover={{ scale: 1.15, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const scrollPosition = (sectionNum - 1) * window.innerHeight;
                window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
              }}
              style={{
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              type="button"
              aria-label={`Go to section ${sectionNum}`}
            >
              ❤️
            </motion.button>
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#ff6b9d]"
                layoutId="progress-pulse"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
