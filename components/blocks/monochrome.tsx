'use client';
import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { PageBlocksMonochrome } from "@/tina/__generated__/types";

const MotionSection = motion.create(Section);

export const Monochrome = ({ data }: { data: PageBlocksMonochrome }) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.7, 0.8, 1],
    [0.8, 0.95, 1, 1, 0.98, 0.95]
  );

  const rawY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.7, 0.8, 1],
    [50, 25, 0, 0, -15, -30]
  );

  const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.7]);
  const rawLeftImageScale = useTransform(scrollYProgress, [0.2, 0.6], [0.95, 1.05]);
  const rawTextOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0.5, 1]);

  const springConfig = { damping: 26, stiffness: 140 };
  const scale = useSpring(rawScale, springConfig);
  const y = useSpring(rawY, springConfig);
  const opacity = useSpring(rawOpacity, { damping: 20, stiffness: 120 });
  const leftImageScale = useSpring(rawLeftImageScale, { damping: 18, stiffness: 120 });
  const textOpacity = useSpring(rawTextOpacity, { damping: 18, stiffness: 120 });

  if (shouldReduceMotion) {
    return (
      <div ref={ref} id="Monochrome">
        <Section
          className="mt-15 w-[90%] md:w-[75%] rounded-3xl bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${data.backgroundImage})`,
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 min-h-[90%]">
            <div className="w-full md:w-1/2 flex justify-center md:justify-start">
              {data.leftImage && (
                <img
                  src={data.leftImage}
                  alt="logos left"
                  className="max-w-[26rem] w-full h-auto"
                  data-tina-field={tinaField(data, 'leftImage')}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
            <p
              className="w-full md:w-1/2 text-white text-center md:text-left text-[18.317px] font-extralight leading-normal"
              data-tina-field={tinaField(data, 'text')}
            >
              {data.text}
            </p>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      id="Monochrome"
      style={{
        scale,
        y,
        opacity,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <MotionSection
        className="mt-15 w-[90%] md:w-[75%] rounded-3xl bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${data.backgroundImage})`,
          transformOrigin: 'center center',
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
                decoding="async"
                draggable={false}
                style={{
                  scale: leftImageScale,
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              />
            )}
          </div>
          <motion.p
            className="w-full md:w-1/2 text-white text-center md:text-left text-[18.317px] font-extralight leading-normal"
            data-tina-field={tinaField(data, 'text')}
            style={{
              opacity: textOpacity,
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
      leftImage: '/uploads/animation/monochrome-animation-compressed.gif',
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
