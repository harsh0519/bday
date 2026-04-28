'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { StarfieldBackdrop } from '@/components/ui/StarfieldBackdrop';

// Demo images with gradient demonstrations
const DEMO_IMAGES = [
  { emoji: '💕', gradient: 'from-pink-400 to-rose-500' },
  { emoji: '✨', gradient: 'from-yellow-300 to-amber-400' },
  { emoji: '🌹', gradient: 'from-red-400 to-pink-500' },
  { emoji: '💫', gradient: 'from-purple-400 to-pink-500' },
  { emoji: '🎀', gradient: 'from-pink-300 to-purple-400' },
  { emoji: '💝', gradient: 'from-red-500 to-pink-600' },
  { emoji: '🌟', gradient: 'from-yellow-400 to-pink-400' },
  { emoji: '💖', gradient: 'from-pink-500 to-rose-600' },
  { emoji: '✨', gradient: 'from-blue-300 to-pink-400' },
  { emoji: '🎁', gradient: 'from-yellow-300 to-pink-400' },
];

interface PolaroidPosition {
  x: number;
  y: number;
}

interface PolaroidImageProps {
  index: number;
  emoji: string;
  gradient: string;
  rotation: number;
  date: string;
  title: string;
  position: PolaroidPosition;
  onDragEnd: (index: number, x: number, y: number) => void;
}

function PolaroidImage({
  index,
  emoji,
  gradient,
  rotation,
  date,
  title,
  position,
  onDragEnd
}: PolaroidImageProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      className="absolute"
      drag
      dragElastic={0.2}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100
      }}
      style={{
        rotate: `${rotation}deg`,
        x: position.x,
        y: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      whileDrag={{ scale: 1.1, rotate: 0, zIndex: 100 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event, info) => {
        setIsDragging(false);
        onDragEnd(index, position.x + info.offset.x, position.y + info.offset.y);
      }}
    >
      {/* Polaroid Card */}
      <div className="relative bg-white rounded-sm shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden w-64 h-80">
        {/* Image Area */}
        <div className={`w-full h-64 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden group`}>
          {/* Emoji Display */}
          <motion.div
            className="text-6xl select-none pointer-events-none"
            whileHover={{ scale: 1.2, rotate: 15 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {emoji}
          </motion.div>

          {/* Hover Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Pin decoration */}
          <motion.div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-md pointer-events-none"
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="absolute inset-0 rounded-full bg-red-600/30 blur-sm" />
          </motion.div>
        </div>

        {/* Polaroid Bottom Text Area */}
        <div className="px-4 py-6 space-y-2 bg-white pointer-events-none">
          {/* Date */}
          <div className="text-xs text-gray-500 font-mono tracking-widest uppercase">
            {date}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
            {title}
          </h3>

          {/* Decorative line */}
          <div className="h-px bg-gradient-to-r from-[#ff6b9d] to-[#ffd700] opacity-30" />

          {/* Handwritten-style note */}
          <p
            className="text-xs italic text-[#ff6b9d] tracking-wide"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            ✨ memories ✨
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const getLayout = () => {
    if (typeof window === 'undefined') {
      return {
        positions: DEMO_IMAGES.map(() => ({ x: 0, y: 0 })),
        gridHeight: null
      };
    }

    const width = Math.max(320, window.innerWidth);
    const height = Math.max(640, window.innerHeight);
    const paddingX = width < 900 ? 28 : 48;
    const paddingY = width < 900 ? 120 : 140;
    const usableWidth = Math.max(320, width - paddingX * 2);
    const usableHeight = Math.max(520, height - paddingY * 2);
    const columns = width < 900 ? 3 : 5;
    const rows = Math.ceil(DEMO_IMAGES.length / columns);
    const cellWidth = usableWidth / columns;
    const cellHeight = Math.max(260, usableHeight / Math.max(rows, 2));
    const nextGridHeight = Math.max(height - 220, paddingY * 2 + rows * cellHeight + 60);

    const nextPositions = DEMO_IMAGES.map((_, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const randomX = Math.random() * 28 - 14;
      const randomY = Math.random() * 24 - 12;

      return {
        x: paddingX + col * cellWidth + cellWidth / 2 - 128 + randomX,
        y: paddingY + row * cellHeight + cellHeight / 2 - 160 + randomY
      };
    });

    return {
      positions: nextPositions,
      gridHeight: nextGridHeight
    };
  };

  const initialLayout = getLayout();
  const [positions, setPositions] = useState<PolaroidPosition[]>(initialLayout.positions);
  const [gridHeight, setGridHeight] = useState<number | null>(initialLayout.gridHeight);

  const cardContent = DEMO_IMAGES.map((_, index) => {
    const titles = [
      'Beautiful Moment',
      'Special Day',
      'Happy Times',
      'Sweet Memory',
      'Precious Moment',
      'Love & Laughter',
      'Forever Memory',
      'Golden Hour',
      'Endless Love',
      'Pure Joy'
    ];

    const day = String(((index * 7) % 28) + 1).padStart(2, '0');
    const month = String(((index * 5) % 12) + 1).padStart(2, '0');
    const year = 2024 + (index % 2);

    return {
      rotation: ((index * 17) % 12) - 6,
      date: `${day}.${month}.${year}`,
      title: titles[index]
    };
  });

  // Calculate distance between two points
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Handle drag end and check for overlaps
  const handleDragEnd = (draggedIndex: number, draggedX: number, draggedY: number) => {
    setPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      const cardCenterX = draggedX + 128; // Card width/2
      const cardCenterY = draggedY + 160; // Card height/2

      // Check distance to all other cards
      let closestIndex = -1;
      let closestDistance = 150; // Threshold for overlap detection

      prevPositions.forEach((pos, index) => {
        if (index === draggedIndex) return;

        const otherCenterX = pos.x + 128;
        const otherCenterY = pos.y + 160;
        const distance = getDistance(cardCenterX, cardCenterY, otherCenterX, otherCenterY);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      // If overlapping with another card, swap positions
      if (closestIndex !== -1) {
        const temp = newPositions[draggedIndex];
        newPositions[draggedIndex] = newPositions[closestIndex];
        newPositions[closestIndex] = temp;
      } else {
        // Update the position of the dragged card
        newPositions[draggedIndex] = { x: draggedX, y: draggedY };
      }

      return newPositions;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      const nextLayout = getLayout();
      setPositions(nextLayout.positions);
      setGridHeight(nextLayout.gridHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SectionWrapper
      theme="golden"
      entrance="up"
      className="relative w-full min-h-screen overflow-hidden py-16 md:py-24"
      background={<StarfieldBackdrop className="absolute inset-0" />}
    >

      {/* Polaroid Gallery Content */}
      <div className="relative z-10 w-full h-full px-4 md:px-8">
        {/* Section Title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
          style={{
            backgroundImage: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Memories 📸
        </motion.h2>

        {/* Polaroid Grid Container - Draggable Pinned Layout */}
        <div
          ref={containerRef}
          className="relative w-full max-w-6xl mx-auto"
          style={{
            perspective: '1000px'
          }}
        >
          {/* Grid with absolute positioning for organic pinned effect */}
          <div
            className="relative w-full"
            style={{ minHeight: gridHeight ? `${gridHeight}px` : 'calc(100vh - 220px)', position: 'relative' }}
          >
            {DEMO_IMAGES.map((image, index) => {
              const card = cardContent[index];
              const position = positions[index] ?? { x: 0, y: 0 };

              return (
                <PolaroidImage
                  key={index}
                  index={index}
                  emoji={image.emoji}
                  gradient={image.gradient}
                  rotation={card.rotation}
                  position={position}
                  onDragEnd={handleDragEnd}
                  date={card.date}
                  title={card.title}
                />
              );
            })}
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}
