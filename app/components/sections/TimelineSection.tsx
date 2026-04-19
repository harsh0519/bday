'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import * as THREE from 'three';

interface MemoryCardProps {
  memory: typeof config.memories[0];
  index: number;
}

function MemoryCard({ memory, index }: MemoryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative flex-shrink-0 w-80 h-96 cursor-pointer"
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay: index * 0.1
      }}
      whileHover={{ y: -10, scale: 1.02 }}
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
          whileHover={{ boxShadow: '0 0 30px rgba(255, 107, 157, 0.5)' }}
        >
          <div>
            <div className="text-sm font-bold text-[#ffd700]">{memory.date}</div>
            <div className="text-2xl font-bold text-[#ff6b9d] mt-2">{memory.title}</div>
            <p className="text-gray-300 mt-4">{memory.description}</p>
          </div>
          <motion.div 
            className="text-5xl"
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            {memory.emoji}
          </motion.div>
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute w-full h-full p-8 rounded-2xl backdrop-blur-xl border border-[#ffd700]/30 bg-gradient-to-br from-[#ffd700]/10 to-[#ff6b9d]/10 flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
          whileHover={{ boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }}
        >
          <p className="text-[#ffe6f0] text-center font-serif italic">{memory.note}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

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

    // Create cute floating particles
    const createParticleField = () => {
      const geometry = new THREE.BufferGeometry();
      const particleCount = 500;

      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 600;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
        positions[i * 3 + 2] = Math.random() * 400 - 200;

        // Mix of pink and gold colors
        if (Math.random() > 0.5) {
          colors[i * 3] = 1; // #ff6b9d
          colors[i * 3 + 1] = 0.42;
          colors[i * 3 + 2] = 0.61;
        } else {
          colors[i * 3] = 1; // #ffd700
          colors[i * 3 + 1] = 0.84;
          colors[i * 3 + 2] = 0;
        }

        sizes[i] = Math.random() * 3 + 1;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
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
    <SectionWrapper pin horizontalScroll>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      <div className="h-screen w-screen flex items-center justify-start relative z-10">
        <motion.div
          className="absolute top-12 left-12 text-5xl font-bold"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
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
