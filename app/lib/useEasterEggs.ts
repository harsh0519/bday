import { useEffect, useRef } from 'react';
import type { TouchEvent } from 'react';

interface EasterEgg {
  keys: string[];
  action: () => void;
}

export function useEasterEggs(easterEggs: EasterEgg[]) {
  const keysPressed = useRef<string[]>([]);
  const maxKeyLength = useRef(Math.max(...easterEggs.map(e => e.keys.length)));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      keysPressed.current.push(key);

      // Keep only the last N keys where N is the longest egg sequence
      if (keysPressed.current.length > maxKeyLength.current) {
        keysPressed.current.shift();
      }

      // Check each easter egg
      for (const egg of easterEggs) {
        const eggSequence = egg.keys.map(k => k.toLowerCase());
        
        // Check if the last keys match the egg sequence
        if (keysPressed.current.length >= eggSequence.length) {
          const lastKeys = keysPressed.current.slice(-eggSequence.length);
          const matches = lastKeys.every((key, i) => key === eggSequence[i]);
          
          if (matches) {
            egg.action();
            keysPressed.current = []; // Reset after triggering
            break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [easterEggs]);
}

export function useDoubleTap(callback: () => void, delay = 300) {
  const lastTap = useRef(0);

  return () => {
    const now = Date.now();
    if (now - lastTap.current < delay) {
      callback();
      lastTap.current = 0;
      return;
    }

    lastTap.current = now;
  };
}

export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold = 50
) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  return {
    onTouchStart: (event: TouchEvent) => {
      touchStartX.current = event.touches[0].clientX;
      touchStartY.current = event.touches[0].clientY;
    },
    onTouchEnd: (event: TouchEvent) => {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;

      const diffX = touchStartX.current - touchEndX;
      const diffY = Math.abs(touchStartY.current - touchEndY);

      if (diffY < threshold) {
        if (diffX > threshold && onSwipeLeft) {
          onSwipeLeft();
        } else if (diffX < -threshold && onSwipeRight) {
          onSwipeRight();
        }
      }
    }
  };
}
