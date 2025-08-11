'use client';
import { useEffect } from 'react';

export default function SlowSmoothScroll() {
  useEffect(() => {
    let targetScroll = window.scrollY;
    let currentScroll = window.scrollY;
    let isAnimating = false;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      targetScroll += e.deltaY; 
      targetScroll = Math.max(0, targetScroll); 
      startAnimation();
    }

    function startAnimation() {
      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(animate);
      }
    }

    function animate() {
      currentScroll += (targetScroll - currentScroll) * 0.1;
      window.scrollTo(0, currentScroll);

      if (Math.abs(targetScroll - currentScroll) > 0.5) {
        requestAnimationFrame(animate);
      } else {
        isAnimating = false;
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return null;
}
