'use client';
import React from 'react';
import { motion, Variants, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { PageBlocksMonochrome } from "@/tina/__generated__/types";

const MotionSection = motion(Section);

export const Monochrome = ({ data }: { data: PageBlocksMonochrome }) => {
  const shouldReduceMotion = useReducedMotion();

  const motionRef = React.useRef<HTMLDivElement | null>(null) as React.MutableRefObject<HTMLDivElement | null>;

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,
  });

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      motionRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  const wrapperVariants: Variants = {
    hidden: { opacity: 0.8 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const sectionVariants: Variants = {
    hidden: { scale: 0.95 },
    visible: {
      scale: 1,
      transition: {
        duration: 1.2,
        delay: 0.2,
        ease: [0.25, 1, 0.5, 1] as unknown as any,
      },
    },
  };

  const finalWrapper = shouldReduceMotion ? { hidden: {}, visible: {} } : wrapperVariants;
  const finalSection = shouldReduceMotion ? { hidden: {}, visible: {} } : sectionVariants;

  return (
    <motion.div
      ref={setRefs}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={finalWrapper}
      style={{ willChange: 'opacity, transform' }}
    >
      <MotionSection
        variants={finalSection}
        className="mt-15 w-[90%] md:w-[75%] rounded-3xl bg-cover bg-center bg-no-repeat origin-center"
        style={{
          backgroundImage: `url(${data.backgroundImage})`,
          willChange: 'transform',
          transformOrigin: 'center center',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
        onAnimationComplete={() => {
          if (inView && !shouldReduceMotion) {
            window.requestAnimationFrame(() =>
              window.requestAnimationFrame(() =>
                motionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
              ),
            );
          }
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
                style={{ willChange: 'transform' }}
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
