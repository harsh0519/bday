'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import * as THREE from 'three';
import { config } from '@/config';

export function IntroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Three.js setup - Realistic Galaxy Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0008);
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
      antialias: true,
      precision: 'highp'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create realistic star constellation
    const createStarConstellation = () => {
      const geometry = new THREE.BufferGeometry();
      const starCount = 800;
      
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
        // Position stars with depth for realism
        const distance = Math.random() * 600 - 100; // Depth variation
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() ** 0.5 * 400; // More stars towards center
        
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = distance;

        // Realistic star colors - mostly white with variations
        const brightness = Math.random();
        const colorChoice = Math.random();
        
        if (brightness < 0.1) {
          // Very bright white (rare)
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 0.95;
        } else if (colorChoice < 0.6) {
          // White/cool white stars (60%)
          const whiteVariation = 0.8 + Math.random() * 0.2;
          colors[i * 3] = whiteVariation;
          colors[i * 3 + 1] = whiteVariation;
          colors[i * 3 + 2] = 1;
        } else if (colorChoice < 0.8) {
          // Blue stars (20%)
          colors[i * 3] = 0.7 + Math.random() * 0.3;
          colors[i * 3 + 1] = 0.75 + Math.random() * 0.25;
          colors[i * 3 + 2] = 1;
        } else if (colorChoice < 0.95) {
          // Yellow stars (15%)
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
          colors[i * 3 + 2] = 0.6 + Math.random() * 0.2;
        } else {
          // Red giants (5%)
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.5 + Math.random() * 0.2;
          colors[i * 3 + 2] = 0.4 + Math.random() * 0.2;
        }

        // Realistic star size distribution - most small, few large
        const sizeRandom = Math.random();
        if (sizeRandom < 0.7) {
          sizes[i] = Math.random() * 1.5; // Most stars are tiny
        } else if (sizeRandom < 0.95) {
          sizes[i] = Math.random() * 2.5 + 0.5; // Medium stars
        } else {
          sizes[i] = Math.random() * 3.5 + 1.5; // Bright stars
        }
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85
      });

      return new THREE.Points(geometry, material);
    };

    const starConstellation = createStarConstellation();
    scene.add(starConstellation);

    // Add ambient lighting for constellation
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff6b9d, 0.6);
    pointLight1.position.set(200, 200, 200);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffd700, 0.5);
    pointLight2.position.set(-200, -200, 200);
    scene.add(pointLight2);

    // Animate name letters with proper GSAP context
    if (nameRef.current) {
      nameRef.current.innerHTML = '';
      
      // Split text into two lines
      const line1Text = `Happy Birthday Baby! 🎉`;
      const line2Text = `The one most beautiful girl in my life ✨`;
      
      // Create line 1
      const line1 = document.createElement('div');
      line1.style.display = 'block';
      line1.style.minHeight = '80px';
      line1.style.lineHeight = '1.2';
      nameRef.current.appendChild(line1);
      
      // Create line 2
      const line2 = document.createElement('div');
      line2.style.display = 'block';
      line2.style.minHeight = '80px';
      line2.style.lineHeight = '1.2';
      nameRef.current.appendChild(line2);
      
      // Populate line 1 letters
      const line1Letters = line1Text.split('');
      line1Letters.forEach((letter) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = letter === ' ' ? 'inline' : 'inline-block';
        span.style.position = 'relative';
        span.style.opacity = '0';
        span.style.marginRight = letter === ' ' ? '0.3em' : '0';
        span.style.letterSpacing = '0.05em';
        span.style.textShadow = '0 0 0 rgba(255, 0, 0, 0)';
        line1.appendChild(span);
      });
      
      // Populate line 2 letters
      const line2Letters = line2Text.split('');
      line2Letters.forEach((letter) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = letter === ' ' ? 'inline' : 'inline-block';
        span.style.position = 'relative';
        span.style.opacity = '0';
        span.style.marginRight = letter === ' ' ? '0.3em' : '0';
        span.style.letterSpacing = '0.05em';
        span.style.textShadow = '0 0 0 rgba(255, 0, 0, 0)';
        line2.appendChild(span);
      });

      // Animate all spans with staggered delays and shadow effect - SMOOTH DROP
      const allSpans = nameRef.current.querySelectorAll('span');
      allSpans.forEach((span, index) => {
        gsap.set(span, {
          y: -60,
          scale: 0.7,
          opacity: 0,
          textShadow: '0 0 0 rgba(255, 0, 0, 0)'
        });

        gsap.to(span, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: index * 0.05,
          ease: 'cubic.out',
          transformOrigin: 'center center'
        });

        // Add shadow effect on landing
        gsap.to(span, {
          textShadow: '0 8px 20px rgba(255, 0, 0, 0.4)',
          duration: 0.4,
          delay: index * 0.05 + 0.3,
          ease: 'power2.out'
        });
      });
    }

    // Mouse interaction for parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.0005;

      // Slowly rotate constellation
      starConstellation.rotation.x += 0.00005;
      starConstellation.rotation.y += 0.0001;
      starConstellation.rotation.z += 0.00003;

      // Subtle parallax with mouse
      camera.position.x = mouseRef.current.x * 80;
      camera.position.y = mouseRef.current.y * 80;
      camera.lookAt(0, 0, 0);

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
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      starConstellation.geometry.dispose();
      (starConstellation.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen overflow-hidden flex flex-col items-center justify-center relative"
    >
      {/* Galaxy Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* Centered Full Sentence - Letter Drop Animation - Two Lines */}
      <motion.div
        ref={nameRef}
        className="absolute inset-0 z-20 flex items-center justify-center text-4xl md:text-7xl font-bold text-center px-6 md:px-16 leading-tight"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          color: '#ff0000',
          filter: 'drop-shadow(0 0 30px rgba(255, 0, 0, 0.4))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flexWrap: 'wrap',
          wordSpacing: '0.4em',
          letterSpacing: '0.02em',
          lineHeight: '1.3',
          pointerEvents: 'none',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '20px'
        }}
      >
        {/* Text will be populated by GSAP animation */}
      </motion.div>

      {/* Bottom Center Enter Button */}
      <div className="absolute bottom-16 z-20">
        <motion.button
          className="px-10 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-[#ff6b9d] to-[#ffd700] text-black cursor-pointer border-none hover:border-none focus:outline-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 8, duration: 0.8, type: 'spring', stiffness: 100 }}
          whileHover={{ 
            scale: 1.1, 
            boxShadow: '0 0 40px rgba(255, 107, 157, 0.9), 0 0 60px rgba(255, 215, 0, 0.6)' 
          }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.scrollTo?.({ top: window.innerHeight, behavior: 'smooth' });
          }}
          type="button"
        >
          Enter ✨
        </motion.button>
      </div>
    </div>
  );
}
