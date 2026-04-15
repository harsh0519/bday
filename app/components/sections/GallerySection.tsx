'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';

interface Polaroid {
  id: number;
  caption: string;
  angle: number;
  x: number;
  y: number;
}

export function GallerySection() {
  const [polaroids, setPolaroids] = useState<Polaroid[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    setPolaroids(
      config.photos.map((photo, i) => ({
        id: i,
        caption: photo.caption,
        angle: (Math.random() - 0.5) * 20,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 10
      }))
    );
  }, []);

  return (
    <SectionWrapper>
      <div className="w-full min-h-screen overflow-hidden flex items-center justify-center">
        <motion.div
          className="absolute top-12 left-12 text-5xl font-bold"
          style={{
            background: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Our Moments
        </motion.div>

        <div className="relative w-full h-full">
          {polaroids.length > 0 ? (
            polaroids.map((polaroid, idx) => (
              <motion.div
                key={polaroid.id}
                className="absolute w-64 h-80 bg-white rounded-lg shadow-2xl p-3 cursor-pointer overflow-hidden"
                style={{
                  left: `${polaroid.x}%`,
                  top: `${polaroid.y}%`
                }}
                initial={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  opacity: 0,
                  rotate: polaroid.angle
                }}
                whileInView={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  rotate: polaroid.angle
                }}
                transition={{
                  type: 'spring',
                  stiffness: 75,
                  damping: 15,
                  delay: idx * 0.1
                }}
                whileHover={{
                  scale: 1.08,
                  rotate: 0,
                  zIndex: 20
                }}
                onClick={() => setSelectedId(polaroid.id)}
              >
                <div className="w-full h-56 bg-gradient-to-br from-[#ff6b9d] to-[#ffd700] rounded flex items-center justify-center text-white font-bold text-sm">
                  Photo {polaroid.id + 1}
                </div>
                <p className="text-center text-gray-700 text-xs mt-2 font-serif">
                  {polaroid.caption}
                </p>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <p>Add photos to see them here!</p>
            </div>
          )}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedId !== null && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/80 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
              />
              <motion.div
                className="fixed inset-1/2 w-96 h-[32rem] bg-white rounded-lg shadow-2xl p-4 z-50"
                style={{ x: '-50%', y: '-50%' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="w-full h-64 bg-gradient-to-br from-[#ff6b9d] to-[#ffd700] rounded flex items-center justify-center text-white font-bold">
                  Photo {selectedId + 1}
                </div>
                <p className="text-center text-gray-700 mt-4 font-serif">
                  {polaroids.find((p) => p.id === selectedId)?.caption}
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
