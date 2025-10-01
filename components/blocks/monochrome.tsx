'use client';
import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
  useSpring,
} from 'framer-motion';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import type { PageBlocksMonochrome } from '@/tina/__generated__/types';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import Image from 'next/image';

type RichText = any;
type MonochromeData = Omit<PageBlocksMonochrome, 'text'> & { textRich?: RichText };

export const Monochrome = ({ data }: { data: MonochromeData }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const MotionSection = motion.create(Section);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  const opacity = useTransform(smoothProgress, [0, 0.2, 0.4, 0.8, 0.9], [0, 0.9, 0.9, 1, 0.4]);
  const contentY = useTransform(smoothProgress, [0, 0.5, 0.9], [50, 0, -50]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.15, 0.8, 0.9], [0, 1, 1, 0]);

  const content = data.textRich ?? { type: 'root', children: [] };

  return (
    <div ref={wrapperRef} id="Monochrome" className="h-[100%] flex items-center justify-center">
      <div>
        <MotionSection
          className="mt-15 mb-5 w-[90%] md:w-[75%] rounded-3xl bg-cover bg-center bg-no-repeat gpu"
          style={{
            backgroundImage: `url(${data.backgroundImage})`,
            y: contentY,
            opacity,
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8 p-8" style={{ minHeight: 'inherit' }}>
            <motion.div
              className="w-full md:w-1/2 flex justify-center md:justify-start"
              style={{ y: contentY, opacity: contentOpacity }}
            >
              {data.leftImage && (
                <Image
                  src={data.leftImage}
                  alt="logos left"
                  className="max-w-[36rem] w-full h-auto gpu"
                  data-tina-field={tinaField(data, 'leftImage')}
                  width={414}
                  height={226}
                  priority={true}
                  decoding="async"
                  unoptimized
                  quality={100}
                />
              )}
            </motion.div>

            <motion.div
              className="w-full md:w-1/2 gpu"
              data-tina-field={tinaField(data, 'textRich')}
              style={{ y: contentY, opacity: contentOpacity }}
            >
              <div className="text-white text-center md:text-left text-2xl font-extralight leading-normal max-w-none">
                <TinaMarkdown content={content} />
              </div>
            </motion.div>
          </div>
        </MotionSection>
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
      textRich: {
        type: 'root',
        children: [
          {
            type: 'p',
            children: [
              {
                type: 'text',
                text: 'Seu texto aqui à direita.',
              },
            ],
          },
        ],
      },
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
      type: 'rich-text',
      label: 'Text (Right Side)',
      name: 'textRich',
      toolbarOverride: ['heading', 'bold', 'italic', 'link', 'ul', 'ol'],
    },
  ],
};