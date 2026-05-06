'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { StarfieldBackdrop } from '@/components/ui/StarfieldBackdrop';
import { motion } from 'framer-motion';

const DEMO_IMAGES = [
  {
    src: '/gsec/WhatsApp Image 2026-05-07 at 02.52.06 (1).jpeg'
  },
  {
    src: '/gsec/WhatsApp Image 2026-05-07 at 02.52.06.jpeg'
  },
  {
    src: '/gsec/WhatsApp Image 2026-05-07 at 02.52.07.jpeg'
  },
  {
    src: '/gsec/WhatsApp Image 2026-05-07 at 02.53.54.jpeg'
  }
] as const;

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);
  const [ripples, setRipples] = useState<{ id: number; panel: number; x: number; y: number }[]>([]);

  const handlePanelClick = (panelIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    rippleIdRef.current += 1;
    const ripple = {
      id: rippleIdRef.current,
      panel: panelIndex,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((item) => item.id !== ripple.id));
    }, 800);
  };

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const section = sectionRef.current;
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.gallery-panel', section);
      const figures = gsap.utils.toArray<HTMLElement>('.gallery-figure', section);

      const scrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.set(track, { x: 0 });

      const horizontalTween = gsap.to(track, {
        x: () => -scrollDistance(),
        ease: 'none',
        scrollTrigger: {
          id: 'gallery-scroll',
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollDistance()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      figures.forEach((figure, i) => {
        gsap.fromTo(
          figure,
          {
            scale: 0.76,
            opacity: 0.78,
            filter: 'saturate(0.82)'
          },
          {
            scale: 1,
            opacity: 1,
            filter: 'saturate(1)',
            ease: 'none',
            scrollTrigger: {
              trigger: panels[i],
              start: 'left center',
              end: 'right center',
              scrub: true,
              invalidateOnRefresh: true,
              containerAnimation: horizontalTween
            }
          }
        );
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="panel-gallery relative z-10 w-full min-h-screen bg-[#0a0008]">
      <StarfieldBackdrop className="absolute inset-0 z-0" />
      <div className="gallery-container relative z-10 flex min-h-screen w-full overflow-hidden">
        <div
          ref={trackRef}
          className="container-inside flex min-h-screen w-max flex-shrink-0"
        >
          {DEMO_IMAGES.map((image, i) => (
            <div
              key={i}
              className="gallery-panel relative flex min-h-screen w-screen flex-shrink-0 items-center justify-center px-4 sm:px-8"
              style={{
                background: `linear-gradient(135deg, rgba(10,0,8,0.72) 0%, rgba(10,0,8,0.88) 65%)`
              }}
              onClick={(event) => handlePanelClick(i, event)}
            >
              {ripples
                .filter((ripple) => ripple.panel === i)
                .map((ripple) => (
                  <span
                    key={ripple.id}
                    className="gallery-ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                  />
                ))}
              <motion.figure
                className="gallery-figure group relative h-[68vh] max-h-[760px] w-[76vw] max-w-[520px] origin-center scale-[0.76] overflow-hidden rounded-2xl border border-white/20 bg-black/40 shadow-[0_35px_120px_rgba(0,0,0,0.55)] sm:h-[76vh] sm:w-[44vw]"
                whileHover={{ scale: 0.8, boxShadow: '0 40px 130px rgba(0,0,0,0.6)' }}
                transition={{ duration: 0.3 }}
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-white/0 via-white/35 to-white/0 blur-sm animate-[gallery-shine_1.4s_ease-in-out_infinite]" />
                </span>
                <Image
                  src={image.src}
                  alt="Gallery moment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 76vw, 44vw"
                  priority={i < 2}
                  unoptimized
                />
              </motion.figure>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute left-8 top-8 z-50">
          <h2
            className="text-3xl font-bold md:text-5xl"
            style={{
              background: 'linear-gradient(120deg, #ff6b9d, #ffd700)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Our Memories
          </h2>
        </div>
      </div>
    </section>
  );
}
