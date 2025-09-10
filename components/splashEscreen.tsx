'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export const SplashScreen = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-70 flex items-center justify-center"
                    style={{
                        background: 'rgba(0, 0, 0, 0.20)',
                        backdropFilter: 'blur(30.75px)',
                        WebkitBackdropFilter: 'blur(30.75px)',
                    }}
                >
                    <div className="flex flex-col items-center">
                        <Image
                            priority={true}
                            src='/animation/logoanimation.gif'
                            alt="splash logo"
                            unoptimized
                            width={500}
                            height={500}
                            className="drop-shadow-xl"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};