import { useEffect, useRef } from 'react';

interface EasterEgg {
  keys: string[];
  action: () => void;
}

export function useEasterEggs(easterEggs: EasterEgg[]) {
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());

      // Check each easter egg
      easterEggs.forEach((egg) => {
        if (
          egg.keys.every((key) => keysPressed.current.has(key.toLowerCase()))
        ) {
          egg.action();
          keysPressed.current.clear();
        }
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [easterEggs]);
}

// Double tap detection for touch devices
export function useDoubleTap(callback: () => void, delay: number = 300) {
  const lastTap = useRef<number>(0);

  return (e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap.current < delay) {
      callback();
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };
}

// Swipe detection
export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  return {
    onTouchStart: (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX.current - touchEndX;
      const diffY = Math.abs(touchStartY.current - touchEndY);

      // Only trigger if vertical movement is minimal (horizontal swipe)
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
