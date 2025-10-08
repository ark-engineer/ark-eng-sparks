'use client';
import React, { PropsWithChildren, useEffect, useState, useRef, useCallback } from "react";
import { LayoutProvider } from "./layout-context";
import client from "../../tina/__generated__/client";
import { SplashScreen } from "../splashEscreen"; // adjust path if needed
import { motion, AnimatePresence } from 'framer-motion';

type LayoutProps = PropsWithChildren & {
  rawPageData?: any;
};

export default function Layout({ children, rawPageData }: LayoutProps) {
  const [globalData, setGlobalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [progress, setProgress] = useState<number>(0);
  const [contentReadyToRender, setContentReadyToRender] = useState(true);
  const isScrolling = useRef<boolean>(false);
  const rafId = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setContentReadyToRender(true);

    let progressInterval: number | null = null;

    async function fetchData() {
      try {
        setProgress(6);
        progressInterval = window.setInterval(() => {
          setProgress((p) => {
            if (p < 90) {
              return Math.min(90, p + 4 + Math.floor(Math.random() * 6));
            }
            return p;
          });
        }, 250) as unknown as number;

        const fetchGlobal = client.queries.global(
          { relativePath: "index.json" },
          { fetchOptions: { next: { revalidate: 60 } } }
        );
        const delay = new Promise((resolve) => setTimeout(resolve, 400));
        const [{ data }] = await Promise.all([fetchGlobal, delay]);

        setGlobalData(data?.global ?? { theme: {} });

        setProgress(100);

        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }

        progressTimerRef.current = window.setTimeout(() => {
          setOverlayVisible(false);
          window.setTimeout(() => setLoading(false), 450);
        }, 350) as unknown as number;
      } catch (error) {
        setGlobalData({ theme: {} });
        setProgress(100);
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        setTimeout(() => {
          setOverlayVisible(false);
          setTimeout(() => setLoading(false), 350);
        }, 300);
      }
    }

    fetchData();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    };
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
    if (!contentReadyToRender) return;

    document.documentElement.style.scrollBehavior = 'auto';

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
  }, [contentReadyToRender, smoothScrollTo]);

  const safeGlobalData = globalData || { theme: {} };

  // read splash image from global content (Tina CMS)
  const splashImage = safeGlobalData?.splash?.image ?? '/animation/logoanimation.gif';
  const splashAlt = safeGlobalData?.splash?.alt ?? 'splash logo';

  return (
    <>
      <LayoutProvider globalSettings={safeGlobalData} pageData={rawPageData}>
        <main
          className={`relative z-0 min-h-screen transition-filter duration-300 ${overlayVisible ? 'pointer-events-none select-none blur-sm' : 'pointer-events-auto select-auto blur-0'
            }`}
          aria-hidden={overlayVisible ? "true" : "false"}
        >
          {children}
        </main>
      </LayoutProvider>

      {/* Overlay / Splash */}
      <AnimatePresence mode="wait">
        {overlayVisible && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.98,
              transition: { duration: 0.45, ease: "easeInOut" }
            }}
            style={{
              WebkitBackdropFilter: 'blur(42px)',
              backdropFilter: 'blur(42px)'
            }}
          >
            <div className="w-full max-w-3xl px-6">
              <div className="mx-auto max-w-2xl">
                <SplashScreen imageSrc={splashImage} imageAlt={splashAlt} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}