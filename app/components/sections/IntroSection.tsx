'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import * as THREE from 'three';
import { createStarField, createParticles, animateParticles } from '@/lib/three-scene';
import { config } from '@/config';

export function IntroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Three.js setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create star field
    const stars = createStarField(200);
    scene.add(stars);

    // Animation timeline
    const tl = gsap.timeline();

    // Fade in stars
    (stars as any).material.opacity = 0;
    tl.to((stars as any).material, {
      opacity: 0.8,
      duration: 2,
      ease: 'power2.inOut'
    }, 0);

    // Animate individual star positions
    const positions = (stars as any).geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const startY = positions[i + 1];
      tl.to(
        positions,
        {
          [i + 1]: startY + 50,
          duration: 2,
          ease: 'sine.inOut'
        },
        0
      );
    }

    // Particle explosion at 1.5s
    tl.call(() => {
      const particles = createParticles(500);
      scene.add(particles);

      let lastTime = Date.now();
      const particleAnimation = setInterval(() => {
        const now = Date.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        animateParticles(particles, dt);
      }, 1000 / 60);

      setTimeout(() => {
        clearInterval(particleAnimation);
        scene.remove(particles);
      }, 3000);
    }, undefined, 1.5);

    // Reveal name
    if (nameRef.current) {
      nameRef.current.textContent = '';
      tl.to(
        nameRef.current,
        {
          text: config.name,
          duration: 1.5,
          ease: 'power2.inOut'
        },
        2.5
      );
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate star field
      stars.rotation.x += 0.0001;
      stars.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center relative"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: '#0a0008' }}
      />

      <motion.div
        className="relative z-10 text-center"
      >
        <motion.div
          ref={nameRef}
          className="text-7xl font-bold mb-12"
          style={{
            background: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 107, 157, 0.5)',
            filter: 'drop-shadow(0 0 20px rgba(255, 107, 157, 0.4))'
          }}
        >
          {config.name}
        </motion.div>

        <motion.button
          ref={buttonRef}
          className="px-8 py-4 text-xl font-semibold rounded-full bg-gradient-to-r from-[#ff6b9d] to-[#ffd700] text-black cursor-pointer relative z-20 border-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            console.log('🔘 Enter button clicked!');
            e.preventDefault();
            e.stopPropagation();
            const nextPosition = window.innerHeight;
            console.log('📍 Scrolling to position:', nextPosition);
            window.scrollTo?.({ top: nextPosition, behavior: 'smooth' });
            setTimeout(() => {
              document.documentElement.scrollTop = nextPosition;
              document.body.scrollTop = nextPosition;
              console.log('✅ Scroll position set to:', document.documentElement.scrollTop);
            }, 100);
          }}
          style={{
            boxShadow: '0 0 20px rgba(255, 107, 157, 0.5)',
            willChange: 'transform',
            pointerEvents: 'auto'
          }}
          type="button"
        >
          Enter ✦
        </motion.button>
      </motion.div>
    </div>
  );
}
