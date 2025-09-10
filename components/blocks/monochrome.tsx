'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { PageBlocksMonochrome } from "@/tina/__generated__/types";

const MotionSection = motion(Section);

export const Monochrome = ({ data }: { data: PageBlocksMonochrome }) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.95]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.3, 1, 1, 0.7]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [50, 0, 0, -30]
  );

  const finalScale = shouldReduceMotion ? 1 : scale;
  const finalOpacity = shouldReduceMotion ? 1 : opacity;
  const finalY = shouldReduceMotion ? 0 : y;

  return (
    <motion.div
      ref={ref}
      id="Monochrome"
      style={{
        scale: finalScale,
        opacity: finalOpacity,
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
      }}
    >
      <MotionSection
        className="mt-15 w-[90%] md:w-[75%] rounded-3xl bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${data.backgroundImage})`,
          transformOrigin: 'center center',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          y: finalY,
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 p-8 min-h-[90%]">
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            {data.leftImage && (
              <motion.img
                src={data.leftImage}
                alt="logos left"
                className="max-w-[26rem] w-full h-auto"
                data-tina-field={tinaField(data, 'leftImage')}
                loading="lazy"
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                  scale: shouldReduceMotion ? 1 : useTransform(scrollYProgress, [0.2, 0.6], [0.95, 1.05]),
                }}
              />
            )}
          </div>
          <motion.p
            className="w-full md:w-1/2 text-white text-center md:text-left text-[18.317px] font-extralight leading-normal"
            data-tina-field={tinaField(data, 'text')}
            style={{
              opacity: shouldReduceMotion ? 1 : useTransform(scrollYProgress, [0.1, 0.4], [0.5, 1]),
            }}
          >
            {data.text}
          </motion.p>
        </div>
      </MotionSection>
    </motion.div>
  );
};

export const monochromeBlockSchema: Template = {
  name: 'monochrome',
  label: 'Monochrome',
  ui: {
    previewSrc: '/blocks/content.png',
    defaultItem: {
      backgroundImage: '/default-background.jpg',
      leftImage: '/default-left-image.jpg',
      text: 'Seu texto aqui à direita.',
    },
  },
  fields: [
    {
      type: 'image',
      label: 'Background Image',
      name: 'backgroundImage',
    },
    {
      type: 'image',
      label: 'Left Image',
      name: 'leftImage',
    },
    {
      type: 'string',
      label: 'Text (Right Side)',
      name: 'text',
      ui: {
        component: 'textarea',
      },
    },
  ],
};