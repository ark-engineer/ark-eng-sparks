'use client';
import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
  useSpring,
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
  const MotionSection = motion(Section);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  const scale = useTransform(smoothProgress, [0, 0.5, 0.9], [0.85, 0.9, 0.85]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 0.9], [0, 0.9, 0.9, 0]);

  const contentScale = useTransform(smoothProgress, [0, 0.5, 0.9], [0.9, 0.95, 0.9]);

  return (
    <MotionSection
      className="mt-15 w-[90%] md:w-[75%] rounded-3xl bg-cover bg-center bg-no-repeat gpu"
      style={{
        backgroundImage: `url(${data.backgroundImage})`,
        scale,
        opacity,
      }}
    >
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 min-h-[90%]">
        {/* Imagem com efeito */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          {data.leftImage && (
            <motion.img
              src={data.leftImage}
              alt="logos left"
              className="max-w-[26rem] w-full h-auto gpu"
              data-tina-field={tinaField(data, 'leftImage')}
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{
                scale: contentScale,
              }}
            />
          )}
        </div>

        {/* Texto com efeito */}
        <motion.p
          className="w-full md:w-1/2 text-white text-center md:text-left text-[18.317px] font-extralight leading-normal gpu"
          data-tina-field={tinaField(data, 'text')}
          style={{
            scale: contentScale,
            transformOrigin: 'center',
          }}
        >
          {data.text}
        </motion.p>
      </div>
    </MotionSection>
  );
}

export const Monochrome = ({ data }: { data: PageBlocksMonochrome }) => {
  const shouldReduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end start'],
  });

  if (shouldReduceMotion) {
    return (
      <Section
        id="Monochrome"
        className="mt-15 w-[90%] md:w-[75%] rounded-3xl bg-cover bg-center bg-no-repeat py-5 gpu"
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
                className="max-w-[26rem] w-full h-auto gpu"
                data-tina-field={tinaField(data, 'leftImage')}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          <p
            className="w-full md:w-1/2 text-white text-center md:text-left text-[18.317px] font-extralight leading-normal gpu"
            data-tina-field={tinaField(data, 'text')}
          >
            {data.text}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <div
      ref={wrapperRef}
      id="Monochrome"
      className="h-[100%] flex items-center justify-center"
    >
      <div className="sticky top-[10vh]">
        <AnimatedMonochrome data={data} scrollYProgress={scrollYProgress} />
      </div>
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
