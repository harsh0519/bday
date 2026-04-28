'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { ScrollTrigger } from '@/lib/gsap';
import { CustomCursor, AudioPlayer, PageLoader } from '@/components/ui';
import { DebugPanel } from '@/components/ui/DebugPanel';
import {
  IntroSection,
  TimelineSection,
  StarsSection,
  GallerySection,
  LoveLetterSection,
  WishSection
} from '@/components/sections';
import { config } from '@/config';

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    // Initialize Lenis with proper configuration
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    lenisRef.current = lenis;

    // Update ScrollTrigger on every Lenis scroll
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Animation loop - properly connected
    let rafId: number;
    const animate = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    // Refresh ScrollTrigger after a minimal delay to ensure DOM is ready
    const refreshTimout = setTimeout(() => {
      ScrollTrigger.refresh();
      // Hide loader after 2.5 seconds
      setIsLoading(false);
    }, 2500);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    const handleSparkle = (event: MouseEvent) => {
      const sparkleCount = 18;
      for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle-burst';
        const angle = (Math.PI * 2 * i) / sparkleCount;
        const radius = 42 + Math.random() * 26;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;
        sparkle.style.left = `${event.clientX}px`;
        sparkle.style.top = `${event.clientY}px`;
        sparkle.style.setProperty('--sparkle-x', `${event.clientX + offsetX}px`);
        sparkle.style.setProperty('--sparkle-y', `${event.clientY + offsetY}px`);
        document.body.appendChild(sparkle);

        window.setTimeout(() => {
          sparkle.remove();
        }, 1100);
      }
    };

    window.addEventListener('click', handleSparkle);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleSparkle);
      cancelAnimationFrame(rafId);
      clearTimeout(refreshTimout);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-screen bg-[#0a0008] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <PageLoader key="loader" isLoading={isLoading} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          {process.env.NODE_ENV === 'development' && <DebugPanel />}
          <CustomCursor />
          <AudioPlayer musicUrl={config.musicUrl} />

          {/* All sections stacked vertically */}
          <IntroSection key="intro" />
          {config.memories.length > 0 && <GallerySection key="gallery" />}
          <TimelineSection key="timeline" />
          <StarsSection key="stars" />
          {config.letterContent && <LoveLetterSection key="letter" />}
          {config.finalMessage && <WishSection key="wish" />}
        </>
      )}
    </main>
  );
}

