import { useEffect, useRef } from 'react';
import type { TouchEvent } from 'react';

interface EasterEgg {
  keys: string[];
  action: () => void;
}

export function useEasterEggs(easterEggs: EasterEgg[]) {
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.key.toLowerCase());

      for (const egg of easterEggs) {
        const unlocked = egg.keys.every((key) =>
          keysPressed.current.has(key.toLowerCase())
        );

        if (unlocked) {
          egg.action();
          keysPressed.current.clear();
          break;
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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
