'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { StarfieldBackdrop } from '@/components/ui/StarfieldBackdrop';

// Timeline images from public/timeline folder
const DEMO_IMAGES = [
  { src: '/timeline/WhatsApp Image 2026-05-07 at 03.05.52 (1).jpeg' },
  { src: '/timeline/WhatsApp Image 2026-05-07 at 03.05.52.jpeg' },
  { src: '/timeline/WhatsApp Image 2026-05-07 at 03.05.53 (1).jpeg' },
  { src: '/timeline/WhatsApp Image 2026-05-07 at 03.05.53.jpeg' },
  { src: '/timeline/WhatsApp Image 2026-05-07 at 03.05.54 (1).jpeg' },
  { src: '/timeline/WhatsApp Image 2026-05-07 at 03.05.54 (2).jpeg' },
  { src: '/timeline/WhatsApp Image 2026-05-07 at 03.05.54 (3).jpeg' },
  { src: '/timeline/WhatsApp Image 2026-05-07 at 03.05.54.jpeg' },
  { src: '/timeline/WhatsApp Image 2026-05-07 at 03.20.44.jpeg' },
  { src: '/timeline/WhatsApp Image 2026-05-07 at 03.27.50.jpeg' }
];

interface PolaroidPosition {
  x: number;
  y: number;
}

interface PolaroidImageProps {
  index: number;
  src: string;
  rotation: number;
  beautyLine: string;
  position: PolaroidPosition;
  onDragEnd: (index: number, x: number, y: number) => void;
}

function PolaroidImage({
  index,
  src,
  rotation,
  beautyLine,
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
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden group">
          <Image
            src={src}
            alt="Timeline memory"
            fill
            className="object-cover w-full h-full"
            sizes="320px"
            priority={index < 2}
            unoptimized
          />

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
        <div className="px-4 py-6 space-y-3 bg-white pointer-events-none">
          {/* Beautiful Line */}
          <p className="text-sm text-gray-700 leading-relaxed italic">
            {beautyLine}
          </p>

          {/* Decorative line */}
          <div className="h-px bg-gradient-to-r from-[#ff6b9d] to-[#ffd700] opacity-30" />

          {/* Emoji decoration */}
          <p
            className="text-lg text-center"
          >
            💕 👯 💕
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
    const beautyLines = [
      "My best friend forever and always.",
      "You make every day an adventure.",
      "Thanks for all the laughs and memories.",
      "You're my ride or die.",
      "Best friends till the end.",
      "Together we conquer the world.",
      "You make life so much fun.",
      "Friends like you are rare.",
      "My person, my best friend.",
      "Forever grateful for you."
    ];

    return {
      rotation: ((index * 17) % 12) - 6,
      beautyLine: beautyLines[index % beautyLines.length]
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
          My Beautiful Girl
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
                  src={image.src}
                  rotation={card.rotation}
                  position={position}
                  onDragEnd={handleDragEnd}
                  beautyLine={card.beautyLine}
                />
              );
            })}
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}
