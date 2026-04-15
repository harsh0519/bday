'use client';

import { useEffect, useState } from 'react';

export function DebugPanel() {
  const [scrollY, setScrollY] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);
  const [sectionCount, setSectionCount] = useState(0);

  useEffect(() => {
    console.log('🔧 Debug Panel Mounted');

    const updateMetrics = () => {
      const sh = document.documentElement.scrollHeight;
      const vh = window.innerHeight;
      const sections = document.querySelectorAll('section').length;
      setScrollHeight(sh);
      setViewportHeight(vh);
      setTotalHeight(sh - vh);
      setSectionCount(sections);
      console.log(`📊 METRICS: ScrollHeight=${sh}px | ViewportHeight=${vh}px | Sections=${sections}`);
    };

    // Initial measurement
    setTimeout(() => {
      updateMetrics();
    }, 100);

    const handleScroll = () => {
      setScrollY(window.scrollY);
      console.log(`📜 SCROLL: ${window.scrollY.toFixed(0)}px`);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', updateMetrics);
    window.addEventListener('resize', updateMetrics);

    // Test click
    const handleClick = () => {
      setClicks(c => c + 1);
      console.log('🖱️ Click detected');
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', updateMetrics);
      window.removeEventListener('resize', updateMetrics);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;

  return (
    <div
      className="fixed bottom-4 left-4 bg-black/80 text-green-400 p-3 rounded font-mono text-xs z-[9999] border border-green-400 max-w-xs"
      style={{ pointerEvents: 'none' }}
    >
      <div className="font-bold">🎯 DEBUG</div>
      <div>ScrollY: {scrollY.toFixed(0)}px</div>
      <div>ScrollHeight: {scrollHeight}px</div>
      <div>ViewportHeight: {viewportHeight}px</div>
      <div>Scrollable: {totalHeight}px</div>
      <div>Sections: {sectionCount}</div>
      <div>Progress: {progress.toFixed(1)}%</div>
      <div>Clicks: {clicks}</div>
    </div>
  );
}
