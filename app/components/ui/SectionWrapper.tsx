'use client';

import { useEffect, useRef } from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  pin?: boolean;
  horizontalScroll?: boolean;
  className?: string;
}

export function SectionWrapper({
  children,
  pin = false,
  horizontalScroll = false,
  className = ''
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className={`w-full min-h-screen flex items-center justify-center bg-[#0a0008] relative ${className}`}
    >
      <div className={horizontalScroll ? 'h-screen overflow-x-auto overflow-y-hidden' : 'w-full'}>
        {children}
      </div>
    </section>
  );
}
