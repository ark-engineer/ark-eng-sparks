'use client';
import React, { PropsWithChildren, useEffect, useState, useRef, useCallback } from "react";
import { LayoutProvider } from "./layout-context";
import client from "../../tina/__generated__/client";
import { SplashScreen } from "../splashEscreen";
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

type LayoutProps = PropsWithChildren & {
  rawPageData?: any;
};

export default function Layout({ children, rawPageData }: LayoutProps) {
  const [globalData, setGlobalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const scrollY = useMotionValue(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const smoothScrollY = useSpring(scrollY, {
    damping: isMobile ? 20 : 30,
    stiffness: isMobile ? 150 : 100,
    mass: isMobile ? 0.7 : 1,
    restDelta: 0.5
  });
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0); // NEW: Track X for horizontal detection
  const touchStartTime = useRef<number>(0);
  const lastTouchY = useRef<number>(0);
  const lastTouchX = useRef<number>(0); // NEW: Track last X
  const velocityY = useRef<number>(0);
  const isScrolling = useRef<boolean>(false);
  const rafId = useRef<number>();
  const targetScrollY = useRef<number>(0);
  const scrollDirection = useRef<'vertical' | 'horizontal' | null>(null); // NEW: Track gesture direction

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchGlobal = client.queries.global(
          { relativePath: "index.json" },
          { fetchOptions: { next: { revalidate: 60 } } }
        );
        const delay = new Promise((resolve) => setTimeout(resolve, 2000));
        const { data } = await Promise.all([fetchGlobal, delay]).then(([res]) => res);
        setGlobalData(data.global);
      } catch (error) {
        setGlobalData({ theme: {} });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const isInsideProjectSidebar = useCallback((target: EventTarget | null): boolean => {
    const projectSidebar = document.querySelector('.project-sidebar-scrollable');
    return projectSidebar ? projectSidebar.contains(target as Node) : false;
  }, []);

  const clampScrollValue = useCallback((value: number): number => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, Math.min(value, maxScroll));
  }, []);

  const updateScroll = useCallback((newValue: number) => {
    targetScrollY.current = clampScrollValue(newValue);
    scrollY.set(targetScrollY.current);
  }, [scrollY, clampScrollValue]);

  useEffect(() => {
    if (shouldReduceMotion || loading) return;

    const scrollSpeed = isMobile ? 0.6 : 0.3;
    const touchScrollMultiplier = isMobile ? 1.4 : 1.2;

    const handleWheel = (e: WheelEvent) => {
      if (isInsideProjectSidebar(e.target)) return;
      e.preventDefault();
      const delta = e.deltaY * scrollSpeed;
      updateScroll(targetScrollY.current + delta);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isInsideProjectSidebar(e.target)) return;
      const touch = e.touches[0];
      touchStartY.current = touch.clientY;
      touchStartX.current = touch.clientX; // NEW
      lastTouchY.current = touch.clientY;
      lastTouchX.current = touch.clientX; // NEW
      touchStartTime.current = Date.now();
      velocityY.current = 0;
      isScrolling.current = true;
      scrollDirection.current = null; // NEW: Reset direction
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = undefined;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling.current || isInsideProjectSidebar(e.target)) return;

      const touch = e.touches[0];
      const currentY = touch.clientY;
      const currentX = touch.clientX;
      const currentTime = Date.now();

      const deltaY = lastTouchY.current - currentY;
      const deltaX = lastTouchX.current - currentX; // NEW
      const deltaTime = Math.max(currentTime - touchStartTime.current, 1);
      velocityY.current = deltaY / deltaTime;

      // NEW: Detect direction if not already set (based on initial movement)
      if (scrollDirection.current === null) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        if (absDeltaX > absDeltaY && absDeltaX > 5) { // Threshold to avoid noise
          scrollDirection.current = 'horizontal';
        } else if (absDeltaY > absDeltaX && absDeltaY > 5) {
          scrollDirection.current = 'vertical';
        }
      }

      // NEW: If horizontal, don't preventDefault or handle scroll—let browser do it
      if (scrollDirection.current === 'horizontal') {
        lastTouchY.current = currentY;
        lastTouchX.current = currentX;
        touchStartTime.current = currentTime;
        return; // Skip custom handling
      }

      e.preventDefault(); // Only prevent if vertical
      const scrollDelta = deltaY * touchScrollMultiplier;
      updateScroll(targetScrollY.current + scrollDelta);
      lastTouchY.current = currentY;
      lastTouchX.current = currentX; // NEW
      touchStartTime.current = currentTime;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isScrolling.current || isInsideProjectSidebar(e.target)) return;
      isScrolling.current = false;
      // NEW: Skip inertia if horizontal
      if (scrollDirection.current !== 'vertical') {
        scrollDirection.current = null;
        return;
      }
      if (isMobile && Math.abs(velocityY.current) > 0.5) {
        const inertiaVelocity = velocityY.current * 450;
        const friction = 0.94;
        const animateInertia = () => {
          if (Math.abs(velocityY.current) < 0.1) return;
          velocityY.current *= friction;
          updateScroll(targetScrollY.current + velocityY.current * 16);
          rafId.current = requestAnimationFrame(animateInertia);
        };
        velocityY.current = Math.max(-15, Math.min(15, inertiaVelocity / 300));
        rafId.current = requestAnimationFrame(animateInertia);
      }
      scrollDirection.current = null; // NEW: Reset
    };

    const handleKeyScroll = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space'];
      if (!scrollKeys.includes(e.key)) return;
      e.preventDefault();
      let scrollAmount = 0;
      const viewportHeight = window.innerHeight;
      switch (e.key) {
        case 'ArrowUp': scrollAmount = isMobile ? -80 : -50; break;
        case 'ArrowDown': scrollAmount = isMobile ? 80 : 50; break;
        case 'PageUp': scrollAmount = -viewportHeight * 0.8; break;
        case 'PageDown':
        case 'Space': scrollAmount = viewportHeight * 0.8; break;
        case 'Home': updateScroll(0); return;
        case 'End':
          const maxScroll = document.documentElement.scrollHeight - viewportHeight;
          updateScroll(maxScroll);
          return;
      }
      updateScroll(targetScrollY.current + scrollAmount);
    };

    const handleScrollToTop = () => {
      updateScroll(0);
    };

    const unsubscribe = smoothScrollY.on("change", (value) => {
      window.scrollTo(0, value);
    });

    const bodyStyle = document.body.style;
    const originalOverflow = bodyStyle.overflow;
    const originalTouchAction = bodyStyle.touchAction;
    (bodyStyle as any).webkitOverflowScrolling = "touch";
    bodyStyle.overflow = "hidden";
    bodyStyle.touchAction = "none";

    const wheelOptions = { passive: false, capture: false };
    const touchOptions = { passive: false, capture: false };
    const keyboardOptions = { passive: false };

    window.addEventListener('wheel', handleWheel, wheelOptions);
    window.addEventListener('touchstart', handleTouchStart, touchOptions);
    window.addEventListener('touchmove', handleTouchMove, touchOptions);
    window.addEventListener('touchend', handleTouchEnd, touchOptions);
    window.addEventListener('keydown', handleKeyScroll, keyboardOptions);
    window.addEventListener('scrollToTop', handleScrollToTop);

    return () => {
      bodyStyle.overflow = originalOverflow;
      bodyStyle.touchAction = originalTouchAction;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyScroll);
      window.removeEventListener('scrollToTop', handleScrollToTop);
      unsubscribe();
    };
  }, [shouldReduceMotion, loading, scrollY, smoothScrollY, isMobile, isInsideProjectSidebar, clampScrollValue, updateScroll]);

  const safeGlobalData = globalData || { theme: {} };

  return (
    <>
      {loading && (
        <motion.div
          className="fixed inset-0 z-70 bg-transparent"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          <SplashScreen />
        </motion.div>
      )}
      <LayoutProvider globalSettings={safeGlobalData} pageData={rawPageData}>
        <motion.main
          className="overflow-x-hidden relative z-0 min-h-screen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.main>
      </LayoutProvider>
    </>
  );
}