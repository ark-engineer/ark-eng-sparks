'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type SplashScreenProps = {};

export const SplashScreen: React.FC<SplashScreenProps> = () => {

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 0.8, ease: 'easeInOut' },
            }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center pointer-events-none"
        >
            <div className="flex flex-col items-center pointer-events-auto">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{
                        scale: 0.9,
                        opacity: 0,
                        y: -10,
                        transition: { duration: 0.6 },
                    }}
                    transition={{
                        duration: 0.7,
                        delay: 0.2,
                        ease: 'easeOut',
                    }}
                    className="relative"
                >
                    <div className="relative">
                        <Image
                            priority
                            src="/animation/logoanimation.gif"
                            alt="splash logo"
                            unoptimized
                            width={340}
                            height={340}
                            className="drop-shadow-2xl"
                            style={{
                                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))',
                                display: 'block',
                            }}
                        />

                        <div
                            className="absolute inset-0 rounded-full opacity-20 blur-xl pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.28) 0%, transparent 70%)',
                                transform: 'scale(1.12)',
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
