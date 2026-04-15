'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import * as THREE from 'three';
import { createStarField } from '@/lib/three-scene';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';

interface StarCard {
  id: number;
  reason: string;
  position: { x: number; y: number };
}

export function StarsSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [starCards, setStarCards] = useState<StarCard[]>([]);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

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
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create larger star field
    const stars = createStarField(1000);
    scene.add(stars);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleClick = (e: MouseEvent) => {
      if (config.loveReasons.length === 0) return;

      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObject(stars);

      if (intersects.length > 0 && config.loveReasons.length > 0) {
        const randomReason = config.loveReasons[Math.floor(Math.random() * config.loveReasons.length)];
        const newCard: StarCard = {
          id: Date.now(),
          reason: randomReason,
          position: { x: e.clientX, y: e.clientY }
        };
        setStarCards([...starCards, newCard]);

        setTimeout(() => {
          setStarCards((prev) => prev.filter((card) => card.id !== newCard.id));
        }, 4000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate and parallax
      stars.rotation.x += 0.00003;
      stars.rotation.y += 0.0001;

      // Subtle cursor tracking
      const rotX = mouseY * 0.05;
      const rotY = mouseX * 0.05;
      stars.rotation.z += (rotX - stars.rotation.z) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <SectionWrapper>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, #2a2a3e 0%, #0a0008 100%)' }}
      />

      <motion.div
        className="absolute top-12 left-12 text-5xl font-bold"
        style={{
          background: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Why I Love You
      </motion.div>

      <AnimatePresence>
        {starCards.map((card) => (
          <motion.div
            key={card.id}
            className="fixed p-4 rounded-lg backdrop-blur-xl border border-[#ff6b9d]/30 bg-[#ff6b9d]/10 max-w-xs z-20"
            style={{
              left: card.position.x,
              top: card.position.y
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            drag
            dragElastic={0.2}
          >
            <p className="text-[#ffb3d9] text-center font-serif italic">{card.reason}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      {config.loveReasons.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <p>Add love reasons to see them here!</p>
        </div>
      )}
    </SectionWrapper>
  );
}
