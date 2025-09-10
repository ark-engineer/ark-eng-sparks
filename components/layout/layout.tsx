'use client';
import React, { PropsWithChildren, useEffect, useState, useRef } from "react";
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
  const smoothScrollY = useSpring(scrollY, {
    damping: 30,
    stiffness: 100,
    mass: 1
  });

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
        console.error('Erro ao carregar dados:', error);
        setGlobalData({ theme: {} });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  
  useEffect(() => {
    if (shouldReduceMotion || loading) return;
  
    const scrollSpeed = 0.3;
    let targetScrollY = 0;
  
    const handleWheel = (e: WheelEvent) => {
      const projectSidebar = document.querySelector('.project-sidebar-scrollable');
      if (projectSidebar && projectSidebar.contains(e.target as Node)) {
        return; 
      }
  
      e.preventDefault();
      targetScrollY += e.deltaY * scrollSpeed;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));
      scrollY.set(targetScrollY);
    };
  
    const handleKeyScroll = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space'];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
        let scrollAmount = 0;
        switch (e.key) {
          case 'ArrowUp': scrollAmount = -50; break;
          case 'ArrowDown': scrollAmount = 50; break;
          case 'PageUp': scrollAmount = -window.innerHeight * 0.8; break;
          case 'PageDown':
          case 'Space':
            scrollAmount = window.innerHeight * 0.8;
            break;
          case 'Home':
            targetScrollY = 0;
            scrollY.set(0);
            return;
          case 'End':
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetScrollY = maxScroll;
            scrollY.set(maxScroll);
            return;
        }
        targetScrollY += scrollAmount * scrollSpeed;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));
        scrollY.set(targetScrollY);
      }
    };
  
    const handleScrollToTop = (e: CustomEvent) => {
      targetScrollY = 0;
      scrollY.set(0);
    };
  
    const unsubscribe = smoothScrollY.on("change", (value) => {
      window.scrollTo(0, value);
    });
  
    document.body.style.overflow = "hidden";
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyScroll);
    window.addEventListener('scrollToTop', handleScrollToTop as EventListener);
  
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyScroll);
      window.removeEventListener('scrollToTop', handleScrollToTop as EventListener);
      unsubscribe();
    };
  }, [shouldReduceMotion, loading, scrollY, smoothScrollY]);
  const safeGlobalData = globalData || { theme: {} };
  return (
    <>
      {loading && (
        <motion.div
          className="fixed inset-0 z-70 bg-transparent"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.8,
              ease: "easeInOut"
            }
          }}
        >
          <SplashScreen />
        </motion.div>
      )}
      <LayoutProvider globalSettings={safeGlobalData} pageData={rawPageData}>
        <motion.main
          className="overflow-x-hidden relative z-0 min-h-screen"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: "easeOut"
          }}
        >
          {children}
        </motion.main>
      </LayoutProvider>
    </>
  );
}