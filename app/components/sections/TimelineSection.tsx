'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import * as THREE from 'three';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Initialize positions for all cards
  const [positions, setPositions] = useState<PolaroidPosition[]>(() => {
    return DEMO_IMAGES.map((_, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      const randomX = Math.random() * 40 - 20;
      const randomY = Math.random() * 30 - 15;

      return {
        x: col * 280 + randomX,
        y: row * 300 + randomY
      };
    });
  });

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

  // Setup Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: false,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0008);
    rendererRef.current = renderer;

    // Create a galaxy-like band where density falls off from the center line
    const createParticleField = () => {
      const geometry = new THREE.BufferGeometry();
      const particleCount = 700;

      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        // Radius uses squared random for higher density near the galaxy core
        const radius = Math.pow(Math.random(), 1.8) * 340;
        const angle = Math.random() * Math.PI * 2;
        const armOffset = (Math.random() - 0.5) * 0.5;

        // Dense center band: y is concentrated around 0 and falls off outward
        const normalized = radius / 340;
        const bandSpread = 10 + normalized * 90;
        const y = (Math.random() - 0.5) * bandSpread;

        positions[i * 3] = Math.cos(angle + armOffset + radius * 0.02) * radius;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(angle + armOffset + radius * 0.02) * radius * 0.7;

        // Brighter stars near the dense center line
        const centerBoost = Math.max(0.2, 1 - Math.min(1, Math.abs(y) / 120));

        if (Math.random() > 0.45) {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.42 + 0.15 * centerBoost;
          colors[i * 3 + 2] = 0.61 + 0.1 * centerBoost;
        } else {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.84;
          colors[i * 3 + 2] = 0.1 * centerBoost;
        }

        sizes[i] = Math.random() * 2.2 + 0.6 + centerBoost * 0.6;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 2.2,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      return new THREE.Points(geometry, material);
    };

    const particles = createParticleField();
    scene.add(particles);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff6b9d, 0.8);
    pointLight.position.set(200, 200, 200);
    scene.add(pointLight);

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (particles) {
        particles.rotation.x += 0.00005;
        particles.rotation.y += 0.0001;
        particles.rotation.z += 0.00003;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      particles.geometry.dispose();
      (particles.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <SectionWrapper theme="golden" entrance="up" className="relative w-full min-h-screen overflow-hidden py-16 md:py-24">
      {/* Three.js Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />

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
          className="relative w-full max-w-6xl mx-auto h-auto"
          style={{
            perspective: '1000px'
          }}
        >
          {/* Grid with absolute positioning for organic pinned effect */}
          <div className="relative w-full" style={{ height: '900px', position: 'relative' }}>
            {DEMO_IMAGES.map((image, index) => {
              const card = cardContent[index];

              return (
                <PolaroidImage
                  key={index}
                  index={index}
                  emoji={image.emoji}
                  gradient={image.gradient}
                  rotation={card.rotation}
                  position={positions[index]}
                  onDragEnd={handleDragEnd}
                  date={card.date}
                  title={card.title}
                />
              );
            })}
          </div>

          {/* Extra height for all polaroids */}
          <div style={{ height: '200px' }} />
        </div>

        {/* Bottom spacing */}
        <div className="h-24" />
      </div>
    </SectionWrapper>
  );
}
