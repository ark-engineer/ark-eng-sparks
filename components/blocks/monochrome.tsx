'use client';
import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
  useInView,
  MotionValue,
} from 'framer-motion';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import type { PageBlocksMonochrome } from "@/tina/__generated__/types";


type AnimatedProps = {
  data: PageBlocksMonochrome;
  scrollYProgress: MotionValue<number>;
};

function AnimatedMonochrome({ data, scrollYProgress }: AnimatedProps) {
  const MotionSection = motion.create(Section);
  
  return (
    <motion.div
      id="Monochrome-animated"
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
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
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
              />
            )}
          </div>
          <motion.p
            className="w-full md:w-1/2 text-white text-center md:text-left text-[18.317px] font-extralight leading-normal"
            data-tina-field={tinaField(data, 'text')}
          >
            {data.text}
          </motion.p>
        </div>
      </MotionSection>
    </motion.div>
  );
}

export const Monochrome = ({ data }: { data: PageBlocksMonochrome }) => {
  const shouldReduceMotion = useReducedMotion();

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(wrapperRef, { amount: 0.05 });

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end start'],
  });

  if (shouldReduceMotion) return (
        <Section
        id="Monochrome"
        ref={wrapperRef}
          className="mt-15 w-[90%] md:w-[75%] rounded-3xl bg-cover bg-center bg-no-repeat py-5"
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
    );
  

  return (
    <div ref={wrapperRef} id="Monochrome">
      <AnimatedMonochrome data={data} scrollYProgress={scrollYProgress} />
    </div>
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
