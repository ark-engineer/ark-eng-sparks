'use client';
import React, { PropsWithChildren, useEffect, useState, useRef, useCallback } from "react";
import { LayoutProvider } from "./layout-context";
import client from "../../tina/__generated__/client";
import { SplashScreen } from "../splashEscreen";
import { motion, useMotionValue, useSpring, useReducedMotion, animate } from 'framer-motion';

type LayoutProps = PropsWithChildren & {
  rawPageData?: any;
};

export default function Layout({ children, rawPageData }: LayoutProps) {
  const [globalData, setGlobalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const scrollY = useMotionValue(0);
  
  // Configurações otimizadas para mobile e desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const smoothScrollY = useSpring(scrollY, {
    damping: isMobile ? 25 : 30,
    stiffness: isMobile ? 200 : 100,
    mass: isMobile ? 0.8 : 1,
    restDelta: 0.5
  });

  // Refs otimizados
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const lastTouchY = useRef<number>(0);
  const velocityY = useRef<number>(0);
  const isScrolling = useRef<boolean>(false);
  const rafId = useRef<number>();
  const targetScrollY = useRef<number>(0);

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

  // Função helper memoizada para verificar sidebar
  const isInsideProjectSidebar = useCallback((target: EventTarget | null): boolean => {
    const projectSidebar = document.querySelector('.project-sidebar-scrollable');
    return projectSidebar ? projectSidebar.contains(target as Node) : false;
  }, []);

  // Função helper memoizada para limitar scroll
  const clampScrollValue = useCallback((value: number): number => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, Math.min(value, maxScroll));
  }, []);

  // Função otimizada para atualizar scroll
  const updateScroll = useCallback((newValue: number) => {
    targetScrollY.current = clampScrollValue(newValue);
    scrollY.set(targetScrollY.current);
  }, [scrollY, clampScrollValue]);

  useEffect(() => {
    if (shouldReduceMotion || loading) return;

    // Configurações diferenciadas para mobile/desktop
    const scrollSpeed = isMobile ? 1.2 : 0.3;
    const touchScrollMultiplier = isMobile ? 2.5 : 1.5;

    // Mouse wheel handler otimizado
    const handleWheel = (e: WheelEvent) => {
      if (isInsideProjectSidebar(e.target)) return;
      
      e.preventDefault();
      const delta = e.deltaY * scrollSpeed;
      updateScroll(targetScrollY.current + delta);
    };

    // Touch handlers otimizados para mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (isInsideProjectSidebar(e.target)) return;
      
      const touch = e.touches[0];
      touchStartY.current = touch.clientY;
      lastTouchY.current = touch.clientY;
      touchStartTime.current = Date.now();
      velocityY.current = 0;
      isScrolling.current = true;

      // Cancelar animação de inércia se houver
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = undefined;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling.current || isInsideProjectSidebar(e.target)) return;
      
      e.preventDefault();
      
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const currentTime = Date.now();
      
      const deltaY = lastTouchY.current - currentY;
      const deltaTime = Math.max(currentTime - touchStartTime.current, 1);
      
      // Calcular velocidade mais precisa
      velocityY.current = deltaY / deltaTime;
      
      // Aplicar scroll com multiplicador otimizado para mobile
      const scrollDelta = deltaY * touchScrollMultiplier;
      updateScroll(targetScrollY.current + scrollDelta);
      
      lastTouchY.current = currentY;
      touchStartTime.current = currentTime;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isScrolling.current || isInsideProjectSidebar(e.target)) return;
      
      isScrolling.current = false;
      
      // Implementar inércia no mobile apenas se a velocidade for significativa
      if (isMobile && Math.abs(velocityY.current) > 0.5) {
        const inertiaVelocity = velocityY.current * 300; // Fator de inércia
        const friction = 0.92; // Fator de atrito
        
        const animateInertia = () => {
          if (Math.abs(velocityY.current) < 0.1) return;
          
          velocityY.current *= friction;
          updateScroll(targetScrollY.current + velocityY.current * 16); // ~60fps
          
          rafId.current = requestAnimationFrame(animateInertia);
        };
        
        velocityY.current = Math.max(-15, Math.min(15, inertiaVelocity / 300)); // Limitar velocidade
        rafId.current = requestAnimationFrame(animateInertia);
      }
    };

    // Keyboard handler otimizado
    const handleKeyScroll = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space'];
      if (!scrollKeys.includes(e.key)) return;
      
      e.preventDefault();
      let scrollAmount = 0;
      const viewportHeight = window.innerHeight;
      
      switch (e.key) {
        case 'ArrowUp': 
          scrollAmount = isMobile ? -80 : -50; 
          break;
        case 'ArrowDown': 
          scrollAmount = isMobile ? 80 : 50; 
          break;
        case 'PageUp': 
          scrollAmount = -viewportHeight * 0.8; 
          break;
        case 'PageDown':
        case 'Space':
          scrollAmount = viewportHeight * 0.8;
          break;
        case 'Home':
          updateScroll(0);
          return;
        case 'End':
          const maxScroll = document.documentElement.scrollHeight - viewportHeight;
          updateScroll(maxScroll);
          return;
      }
      
      updateScroll(targetScrollY.current + scrollAmount);
    };

    // Custom scroll to top handler
    const handleScrollToTop = () => {
      updateScroll(0);
    };

    // Subscribe to smooth scroll changes com otimização
    const unsubscribe = smoothScrollY.on("change", (value) => {
      window.scrollTo(0, value);
    });

    // Aplicar estilos com otimização para performance
    const bodyStyle = document.body.style;
    const originalOverflow = bodyStyle.overflow;
    const originalTouchAction = bodyStyle.touchAction;
    
    bodyStyle.overflow = "hidden";
    bodyStyle.touchAction = "none";
    bodyStyle.webkitOverflowScrolling = "touch"; // Para iOS

    // Event listeners com options otimizadas
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
      // Cleanup otimizado
      bodyStyle.overflow = originalOverflow;
      bodyStyle.touchAction = originalTouchAction;
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyScroll);
      window.removeEventListener('scrollToTop', handleScrollToTop);
      
      unsubscribe();
    };
  }, [
    shouldReduceMotion, 
    loading, 
    scrollY, 
    smoothScrollY, 
    isMobile,
    isInsideProjectSidebar,
    clampScrollValue,
    updateScroll
  ]);

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