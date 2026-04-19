'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { motion } from 'framer-motion';
import { config } from '@/config';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import * as THREE from 'three';

export function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const containerInsideRef = useRef<HTMLDivElement>(null);
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

    // Create cute floating particles (stars and sparkles)
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

        // Pink and gold colors
        if (Math.random() > 0.5) {
          colors[i * 3] = 1; // R - #ff6b9d
          colors[i * 3 + 1] = 0.42;
          colors[i * 3 + 2] = 0.61;
        } else {
          colors[i * 3] = 1; // R - #ffd700
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

  // Setup horizontal scroll animation
  useEffect(() => {
    if (!sectionRef.current || !galleryContainerRef.current || !containerInsideRef.current) {
      return;
    }

    const container = galleryContainerRef.current;
    const width = container.scrollWidth;
    const widthScrollable = width - window.innerWidth;

    const ctx = gsap.context(() => {
      const horizontalTween = gsap.to(container, {
        x: -widthScrollable,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${width}px`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          markers: false
        }
      });

      const memoryCards = sectionRef.current?.querySelectorAll('.memory-card');
      memoryCards?.forEach((element) => {
        const card = (element as HTMLElement).querySelector('.card-inner');
        if (!card) return;

        gsap.fromTo(
          card,
          { scale: 0.8, opacity: 0.6 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: 'left center',
              end: 'right center',
              scrub: true,
              invalidateOnRefresh: true,
              markers: false
            }
          }
        );
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <SectionWrapper>
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen bg-[#0a0008] will-change-transform overflow-hidden flex flex-col"
      >
        {/* Three.js Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0"
        />
        <motion.div 
          className="absolute top-16 left-12 z-20 pointer-events-none"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <h2
            className="text-6xl font-bold"
            style={{
              background: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Our Moments
          </h2>
        </motion.div>

        {/* Memory Container */}
        <div className="w-screen h-screen flex items-center overflow-hidden relative z-10">
          {/* Main gallery container */}
          <div
            ref={galleryContainerRef}
            className="flex h-screen will-change-transform"
          >
            <div ref={containerInsideRef} className="flex h-full">
              {config.memories.length > 0 ? (
                config.memories.map((memory, index) => (
                  <motion.div
                    key={index}
                    className="memory-card flex items-center justify-center h-screen w-screen flex-shrink-0 relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Memory Card Content */}
                    <motion.div 
                      className="card-inner w-80 h-96 rounded-2xl backdrop-blur-xl border border-[#ff6b9d]/40 bg-gradient-to-br from-[#ff6b9d]/15 to-[#ffd700]/15 p-8 flex flex-col justify-between shadow-2xl transform transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.05, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      onDoubleClick={() => {
                        // Easter egg: reveal animation
                        gsap.to('.card-inner', {
                          duration: 0.5,
                          backgroundColor: 'rgba(255, 107, 157, 0.3)',
                          repeat: 1,
                          yoyo: true
                        });
                      }}
                    >
                      {/* Top Section */}
                      <div className="space-y-4">
                        <div className="text-sm font-bold text-[#ffd700] tracking-wide uppercase">
                          {memory.date}
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-4xl font-bold text-[#ff6b9d]">
                            {memory.title}
                          </h3>
                          <motion.span 
                            className="text-5xl"
                            whileHover={{ scale: 1.3, rotate: 15 }}
                          >
                            {memory.emoji}
                          </motion.span>
                        </div>
                        <p className="text-gray-300 text-base leading-relaxed">
                          {memory.description}
                        </p>
                      </div>

                      {/* Bottom Section - Memory Note */}
                      <div className="pt-6 border-t border-[#ff6b9d]/20">
                        <p className="text-[#ffe6f0] text-sm italic font-serif text-center">
                          &ldquo;{memory.note}&rdquo;
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center w-screen h-screen text-gray-400 text-lg">
                  <p>Add memories to see them here!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
}
