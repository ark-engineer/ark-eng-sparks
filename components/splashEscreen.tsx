// components/SplashScreen.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type SplashScreenProps = {
  // se já receber via prop (SSR) ele usa direto; se não receber, ele consulta a /api
  imageSrc?: string | null;
  imageAlt?: string | null;
  apiCheckPath?: string; // ex: '/api/global-splash'
};

export const SplashScreen: React.FC<SplashScreenProps> = ({
  imageSrc,
  imageAlt,
  apiCheckPath = '/api/global-splash',
}) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [remoteSrc, setRemoteSrc] = useState<string | null>(null);
  const [remoteAlt, setRemoteAlt] = useState<string | null>(null);

  useEffect(() => {
    if (typeof imageSrc === 'string' && imageSrc.trim().length > 0) {
      setRemoteSrc(imageSrc.trim());
      setRemoteAlt(imageAlt ?? null);
      setChecked(true);
      return;
    }

    let mounted = true;
    fetch(apiCheckPath)
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setRemoteSrc(json?.image ?? null);
        setRemoteAlt(json?.alt ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setRemoteSrc(null);
        setRemoteAlt(null);
      })
      .finally(() => {
        if (!mounted) return;
        setChecked(true);
      });

    return () => {
      mounted = false;
    };
  }, [imageSrc, imageAlt, apiCheckPath]);

  if (!checked) return null;

  const hasImage = typeof remoteSrc === 'string' && remoteSrc.trim().length > 0;
  const safeSrc = hasImage ? remoteSrc! : '/animation/logoanimation.gif';
  const safeAlt = hasImage
    ? remoteAlt ?? 'splash logo'
    : (imageAlt ?? 'splash logo');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="flex flex-col items-center pointer-events-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -10, transition: { duration: 0.6 } }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="relative"
        >
          <div className="relative">
            <Image
              src={safeSrc}
              alt={safeAlt}
              unoptimized
              width={340}
              height={340}
              priority
              fetchPriority="high"
              className="drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))',
                display: 'block',
              }}
            />
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-xl pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(59, 130, 246, 0.28) 0%, transparent 70%)',
                transform: 'scale(1.12)',
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
