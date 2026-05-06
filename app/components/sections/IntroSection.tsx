'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { useEasterEggs } from '@/lib/useEasterEggs';
import { StarfieldBackdrop } from '@/components/ui/StarfieldBackdrop';

export function IntroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [heartPositions] = useState<{ x: number; y: number }[]>(() =>
    [...Array(5)].map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerWidth
    }))
  );

  // Easter eggs
  useEasterEggs([
    {
      keys: ['l', 'o', 'v', 'e'],
      action: () => {
        setTimeout(() => {
          // Create heart burst
          const hearts = containerRef.current?.querySelectorAll('[data-heart]');
          hearts?.forEach((heart) => {
            gsap.to(heart, {
              scale: 1.5,
              duration: 0.3,
              yoyo: true,
              repeat: 1
            });
          });
        }, 0);
      }
    }
  ]);

  useEffect(() => {
    if (!nameRef.current) return;

    nameRef.current.innerHTML = '';

    const line1Text = 'Happy Birthday Baby! ';
    const line2Text = 'The one most beautiful girl in my life ✨';

    const line1 = document.createElement('div');
    line1.style.display = 'block';
    line1.style.minHeight = '80px';
    line1.style.lineHeight = '1.2';
    nameRef.current.appendChild(line1);

    const line2 = document.createElement('div');
    line2.style.display = 'block';
    line2.style.minHeight = '80px';
    line2.style.lineHeight = '1.2';
    nameRef.current.appendChild(line2);

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

      gsap.to(span, {
        textShadow: '0 8px 20px rgba(255, 0, 0, 0.4)',
        duration: 0.4,
        delay: index * 0.05 + 0.3,
        ease: 'power2.out'
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-screen min-h-screen overflow-hidden flex flex-col items-center justify-center relative bg-[#0a0008]"
    >
      <StarfieldBackdrop className="absolute inset-0 z-0" enableParallax />

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
      
        {/* Floating GIF decorations */}
        <motion.div className="absolute -top-32 right-20 w-32 h-32 z-5 pointer-events-none" animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <Image src="/gif/intro.gif" alt="intro" width={128} height={128} unoptimized />
        </motion.div>
        <motion.div className="absolute -bottom-20 left-16 w-28 h-28 z-5 pointer-events-none" animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <Image src="/gif/intro2.gif" alt="intro2" width={112} height={112} unoptimized />
        </motion.div>
        <motion.div className="absolute top-40 right-1/4 w-24 h-24 z-5 pointer-events-none" animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity }}>
          <Image src="/gif/intro3.gif" alt="intro3" width={96} height={96} unoptimized />
        </motion.div>
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
          onDoubleClick={() => {
            // Easter egg: shake effect - disabled for now
          }}
        >
          Enter ✨
        </motion.button>
      </div>

      {/* Cute floating hearts overlay */}
      {heartPositions.map((pos, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-4xl pointer-events-none"
          data-heart
          initial={{
            x: pos.x,
            y: window.innerHeight + 50,
            opacity: 0
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 1, 0],
            x: pos.x + (Math.sin(i) * 50)
          }}
          transition={{
            duration: 4 + i,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
            delay: i * 0.8
          }}
          whileHover={{ scale: 1.2 }}
        >
          💕
        </motion.div>
      ))}
    </div>
  );
}
