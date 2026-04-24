'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';

const DEMO_IMAGES = [
  {
    src: 'https://placedog.net/650/900?id=1',
    title: 'First Smile'
  },
  {
    src: 'https://placedog.net/650/900?id=2',
    title: 'Coffee Date'
  },
  {
    src: 'https://placedog.net/650/900?id=3',
    title: 'Sunset Walk'
  },
  {
    src: 'https://placedog.net/650/900?id=4',
    title: 'Movie Night'
  },
  {
    src: 'https://placedog.net/650/900?id=5',
    title: 'Rainy Day'
  },
  {
    src: 'https://placedog.net/650/900?id=6',
    title: 'Road Trip'
  },
  {
    src: 'https://placedog.net/650/900?id=7',
    title: 'Golden Hour'
  },
  {
    src: 'https://placedog.net/650/900?id=8',
    title: 'Silly Moment'
  },
  {
    src: 'https://placedog.net/650/900?id=9',
    title: 'Forever Us'
  }
] as const;

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="panel-gallery relative z-10 w-full bg-[#0a0008]">
      <div className="gallery-container relative flex h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 z-40 h-screen w-[3px] -translate-x-1/2 bg-black/70" />

        <div
          ref={trackRef}
          className="container-inside flex h-screen w-max flex-shrink-0"
        >
          {DEMO_IMAGES.map((image, i) => (
            <div
              key={`${image.title}-${i}`}
              className="gallery-panel relative flex h-screen w-screen flex-shrink-0 items-center justify-center px-4 sm:px-8"
              style={{
                background: `linear-gradient(135deg, rgba(255,107,157,${0.08 + (i % 3) * 0.02}) 0%, rgba(10,0,8,0.94) 65%)`
              }}
            >
              <div className="pointer-events-none absolute left-1/2 top-0 z-30 h-screen w-[3px] -translate-x-1/2 bg-[#4b75ff]/60" />

              <figure className="gallery-figure relative h-[68vh] max-h-[760px] w-[76vw] max-w-[520px] origin-center scale-[0.76] overflow-hidden rounded-2xl border border-white/20 bg-black/40 shadow-[0_35px_120px_rgba(0,0,0,0.55)] sm:h-[76vh] sm:w-[44vw]">
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 76vw, 44vw"
                  priority={i < 2}
                  unoptimized
                />
                <figcaption className="absolute bottom-4 left-4 rounded-full bg-black/65 px-4 py-2 text-sm tracking-wide text-white/95 backdrop-blur-sm">
                  {image.title}
                </figcaption>
              </figure>
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
            Our Moments
          </h2>
        </div>
      </div>
    </section>
  );
}
