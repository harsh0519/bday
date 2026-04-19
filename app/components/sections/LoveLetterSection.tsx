'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Howl } from 'howler';
import * as THREE from 'three';
import { useEasterEggs } from '@/lib/useEasterEggs';

export function LoveLetterSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (config.musicUrl && config.musicUrl !== '[MUSIC URL]') {
      const newSound = new Howl({
        src: [config.musicUrl],
        loop: true,
        volume: 0.3
      });
      setSound(newSound);

      return () => {
        newSound.unload();
      };
    }
  }, []);

  // Easter egg: Press "open" to open the letter
  useEasterEggs([
    {
      keys: ['o', 'p', 'e', 'n'],
      action: () => {
        setIsOpen(true);
        if (sound && !sound.playing()) {
          sound.play();
        }
        // Burst effect
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            duration: 0.3,
            filter: 'brightness(1.5)',
            repeat: 1,
            yoyo: true
          });
        }
      }
    }
  ]);

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

        // Pink and light pink
        if (Math.random() > 0.5) {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.42;
          colors[i * 3 + 2] = 0.61;
        } else {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.7;
          colors[i * 3 + 2] = 0.85;
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

  const handleOpen = () => {
    setIsOpen(true);
    if (sound && !sound.playing()) {
      sound.play();
    }
  };

  return (
    <SectionWrapper>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      <div 
        ref={containerRef}
        className="h-screen w-screen flex items-center justify-center relative z-10"
      >
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
          Love Letter
        </motion.div>

        <motion.div
          className="relative w-80 h-56"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        >
          {/* Envelope */}
          <motion.div
            className="relative w-full h-full bg-[#f5e6c8] border-4 border-[#ffd700] rounded-sm flex items-center justify-center cursor-pointer shadow-2xl"
            onClick={handleOpen}
            animate={{ scale: isOpen ? 0.95 : 1 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)' }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Flap */}
            <motion.div
              ref={flapRef}
              className="absolute top-0 left-0 w-full h-1/2 bg-[#e8d4b8] border-4 border-b-0 border-[#ffd700] flex items-center justify-center flex-col"
              animate={{ rotateX: isOpen ? -120 : 0 }}
              transition={{ duration: 0.6 }}
              style={{
                transformOrigin: 'top',
                transformStyle: 'preserve-3d'
              }}
            >
              <span className="text-5xl mb-2">💌</span>
              <p className="text-sm text-gray-700 font-serif">Click to open</p>
            </motion.div>

            {/* Letter inside */}
            {!isOpen && (
              <motion.div className="text-center" initial={{ opacity: 1 }} animate={{ opacity: isOpen ? 0 : 1 }}>
                <p className="text-gray-600 font-serif text-sm">Open Letter</p>
              </motion.div>
            )}
          </motion.div>

          {/* Letter content when opened */}
          {isOpen && (
            <motion.div
              ref={letterRef}
              className="absolute -bottom-96 left-1/2 -translate-x-1/2 w-96 bg-[#f5e6c8] rounded-lg p-8 shadow-2xl max-h-96 overflow-y-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-xs text-gray-600 mb-4 font-serif">Today</p>
              <div className="space-y-4">
                {config.letterContent
                  .split('\n')
                  .map((line, idx) => (
                    <motion.p
                      key={idx}
                      className="text-sm text-gray-800 font-serif leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {line}
                    </motion.p>
                  ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
