'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { createConfetti, createBalloons } from '@/lib/confetti';
import * as THREE from 'three';
import { useEasterEggs } from '@/lib/useEasterEggs';

export function WishSection() {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const flamesRef = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Easter egg: Press "blow" to trigger candles
  useEasterEggs([
    {
      keys: ['b', 'l', 'o', 'w'],
      action: () => {
        // Auto-trigger blow
        const blowBtn = pageRef.current?.querySelector('button');
        if (blowBtn) {
          blowBtn.click();
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

        // Gold and pink for celebratory theme
        if (Math.random() > 0.5) {
          colors[i * 3] = 1; // #ffd700
          colors[i * 3 + 1] = 0.84;
          colors[i * 3 + 2] = 0;
        } else {
          colors[i * 3] = 1; // #ff6b9d
          colors[i * 3 + 1] = 0.42;
          colors[i * 3 + 2] = 0.61;
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

    const pointLight = new THREE.PointLight(0xffd700, 0.8);
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

  const handleBlow = async () => {
    setCandlesBlown(true);

    // Blow out candles
    flamesRef.current.forEach((flame, i) => {
      if (flame) {
        gsap.to(flame, {
          opacity: 0,
          duration: 0.2,
          delay: i * 0.05
        });
      }
    });

    // Wait then explode confetti/balloons
    setTimeout(() => {
      if (pageRef.current) {
        createConfetti(pageRef.current);
        createBalloons(pageRef.current);
      }
    }, 300);
  };

  return (
    <SectionWrapper>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      <div
        ref={pageRef}
        className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden z-10"
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
          Make a Wish
        </motion.div>

        {/* Cake */}
        <motion.div
          className="relative w-80 h-72 mb-16"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Cake body */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-32 bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-b-3xl shadow-2xl">
            {/* Frosting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-8 bg-gradient-to-r from-[#ff6b9d] to-[#ffe6f0] rounded-full" />
          </div>

          {/* Candles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`candle-${i}`}
              className="absolute left-1/2 bottom-32 -translate-x-1/2 w-2 h-16 bg-[#ff6b6b] rounded-sm cursor-pointer"
              style={{
                marginLeft: `${(i - 1) * 40}px`,
                willChange: 'transform'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 + 0.5 }}
              whileHover={{ scale: 1.1 }}
              onDoubleClick={handleBlow}
            >
              {/* Flame */}
              <motion.div
                ref={(el) => {
                  if (el) flamesRef.current[i] = el;
                }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-[#ffff00] to-[#ff6b6b] rounded-full opacity-1"
                animate={
                  !candlesBlown
                    ? {
                        scaleY: [1, 1.1, 1],
                        boxShadow: [
                          '0 0 10px rgba(255, 255, 0, 0.5)',
                          '0 0 15px rgba(255, 107, 107, 0.7)',
                          '0 0 10px rgba(255, 255, 0, 0.5)'
                        ]
                      }
                    : {}
                }
                transition={{
                  duration: 0.3,
                  repeat: !candlesBlown ? Infinity : 0,
                  repeatType: 'loop'
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Blow Button */}
        <motion.button
          onClick={handleBlow}
          disabled={candlesBlown}
          className="px-8 py-4 text-xl font-bold rounded-full bg-gradient-to-r from-[#ff6b9d] to-[#ffd700] text-black mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          whileHover={!candlesBlown ? { scale: 1.05 } : {}}
          whileTap={!candlesBlown ? { scale: 0.95 } : {}}
          style={{
            boxShadow: '0 0 20px rgba(255, 107, 157, 0.5)',
            willChange: 'transform'
          }}
        >
          {candlesBlown ? '🎉 Made a Wish!' : 'Blow Out the Candles'}
        </motion.button>

        {/* Final Message */}
        {candlesBlown && (
          <motion.div
            className="text-4xl font-bold text-center max-w-2xl px-4 absolute bottom-20"
            style={{
              background: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {config.finalMessage}
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  );
}
