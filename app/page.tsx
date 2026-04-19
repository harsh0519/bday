'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
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
    console.log('🚀 Initializing page...');
    
    // Initialize Lenis with proper configuration
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false
    } as any);

    lenisRef.current = lenis;
    console.log('✅ Lenis initialized:', lenis);

    // Update ScrollTrigger on every Lenis scroll
    lenis.on('scroll', () => {
      console.log('📜 Scroll event fired, window.scrollY:', window.scrollY);
      ScrollTrigger.update();
    });

    // Animation loop - properly connected
    let rafId: number;
    const animate = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    console.log('🎬 RAF loop started');

    // Refresh ScrollTrigger after a minimal delay to ensure DOM is ready
    const refreshTimout = setTimeout(() => {
      console.log('🔄 ScrollTrigger refresh called');
      ScrollTrigger.refresh();
      // Hide loader after 2.5 seconds
      setIsLoading(false);
    }, 2500);

    const handleResize = () => {
      console.log('📐 Window resized, refreshing ScrollTrigger');
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
          <DebugPanel />
          <CustomCursor />
          <AudioPlayer musicUrl={config.musicUrl} />

          {/* All sections stacked vertically */}
          <IntroSection key="intro" />
          {config.memories.length > 0 && <GallerySection key="gallery" />}
          {config.memories.length > 0 && <TimelineSection key="timeline" />}
          {config.loveReasons.length > 0 && <StarsSection key="stars" />}
          {config.letterContent && <LoveLetterSection key="letter" />}
          {config.finalMessage && <WishSection key="wish" />}
        </>
      )}
    </main>
  );
}

