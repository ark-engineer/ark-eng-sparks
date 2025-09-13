'use client';
import React, { PropsWithChildren, useEffect, useState, useRef, useCallback } from "react";
import { LayoutProvider } from "./layout-context";
import client from "../../tina/__generated__/client";
import { SplashScreen } from "../splashEscreen";
import { motion, AnimatePresence } from 'framer-motion';

type LayoutProps = PropsWithChildren & {
  rawPageData?: any;
};

export default function Layout({ children, rawPageData }: LayoutProps) {
  const [globalData, setGlobalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const isScrolling = useRef<boolean>(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchGlobal = client.queries.global(
          { relativePath: "index.json" },
          { fetchOptions: { next: { revalidate: 60 } } }
        );
        const delay = new Promise((resolve) => setTimeout(resolve, 1500));
        const [{ data }] = await Promise.all([fetchGlobal, delay]);
        setGlobalData(data.global);
      } catch (error) {
        setGlobalData({ theme: {} });
      } finally {
        setLoading(false);
        setTimeout(() => setShowContent(true), 100);
      }
    }
    fetchData();
  }, []);

  const smoothScrollTo = useCallback((targetY: number) => {
    if (isScrolling.current) return;

    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const duration = Math.min(Math.abs(distance) * 0.5, 600);
    const startTime = performance.now();

    isScrolling.current = true;

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentY = startY + (distance * easedProgress);
      window.scrollTo(0, currentY);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        isScrolling.current = false;
        rafId.current = null;
      }
    };

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (loading || !showContent) return;

    document.documentElement.style.scrollBehavior = 'smooth';

    const handleKeyScroll = (e: KeyboardEvent) => {
      if (isScrolling.current) return;

      const scrollKeys = ['Home', 'End'];
      if (!scrollKeys.includes(e.key)) return;

      e.preventDefault();

      if (e.key === 'Home') {
        smoothScrollTo(0);
      } else if (e.key === 'End') {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        smoothScrollTo(maxScroll);
      }
    };

    const handleScrollToTop = () => {
      smoothScrollTo(0);
    };

    window.addEventListener('keydown', handleKeyScroll);
    window.addEventListener('scrollToTop', handleScrollToTop);

    return () => {
      document.documentElement.style.scrollBehavior = '';
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      window.removeEventListener('keydown', handleKeyScroll);
      window.removeEventListener('scrollToTop', handleScrollToTop);
    };
  }, [loading, showContent, smoothScrollTo]);

  const safeGlobalData = globalData || { theme: {} };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-50 bg-white"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: {
                duration: 0.6,
                ease: "easeInOut"
              }
            }}
          >
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <LayoutProvider globalSettings={safeGlobalData} pageData={rawPageData}>
        <AnimatePresence>
          {showContent && (
            <motion.main
              key="content"
              className="relative z-0 min-h-screen"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut"
              }}
            >
              {children}
            </motion.main>
          )}
        </AnimatePresence>
      </LayoutProvider>
    </>
  );
}