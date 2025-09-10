'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { PageBlocksMonochrome } from "@/tina/__generated__/types";

const MotionSection = motion.create(Section);

export const Monochrome = ({ data }: { data: PageBlocksMonochrome }) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const containerTransform = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.7, 0.8, 1],
    [
      "scale(0.8) translateY(50px) translateZ(0)",
      "scale(0.95) translateY(25px) translateZ(0)", 
      "scale(1) translateY(0px) translateZ(0)",
      "scale(1) translateY(0px) translateZ(0)",
      "scale(0.98) translateY(-15px) translateZ(0)",
      "scale(0.95) translateY(-30px) translateZ(0)"
    ]
  );

  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [0.3, 1, 1, 0.7]
  );

  const leftImageScale = useTransform(
    scrollYProgress, 
    [0.2, 0.6], 
    [0.95, 1.05]
  );

  const textOpacity = useTransform(
    scrollYProgress, 
    [0.1, 0.4], 
    [0.5, 1]
  );

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
        transform: containerTransform,
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
                style={{
                  scale: leftImageScale,
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                transition={{
                  type: "tween",
                  ease: "easeOut"
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
            transition={{
              type: "tween",
              ease: "easeOut"
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