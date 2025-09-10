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

const MotionSection = motion.create(Section);

type AnimatedProps = {
  data: PageBlocksMonochrome;
  scrollYProgress: MotionValue<number>;
};

function AnimatedMonochrome({ data, scrollYProgress }: AnimatedProps) {
  // Keyframes simplificados e suavizados para evitar saltos no final
  const rawScale = useTransform(
    scrollYProgress,
    // menos pontos, final mais estável
    [0, 0.15, 0.6, 1],
    [0.88, 1, 1, 0.98]
  );

  const rawY = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [48, 0, -18]
  );

  // Opacidade vai a zero no fim para um desaparecimento suave
  const rawOpacity = useTransform(scrollYProgress, [0, 0.15, 0.7, 1], [0.25, 1, 1, 0]);

  const rawLeftImageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.04, 1]);
  const rawTextOpacity = useTransform(scrollYProgress, [0.05, 0.35, 0.7], [0.45, 1, 0.95]);

  // Molas com damping maior e stiffness reduzido para cortar overshoot
  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const scale = useSpring(rawScale, springConfig);
  const y = useSpring(rawY, springConfig);
  const opacity = useSpring(rawOpacity, { damping: 28, stiffness: 120, mass: 1 });
  const leftImageScale = useSpring(rawLeftImageScale, { damping: 24, stiffness: 120, mass: 1 });
  const textOpacity = useSpring(rawTextOpacity, { damping: 24, stiffness: 120, mass: 1 });

  return (
    <motion.div
      id="Monochrome-animated"
      style={{
        scale,
        y,
        opacity,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        // ajuda a forçar composição em camada GPU
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
                  scale: leftImageScale,
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
}

export const Monochrome = ({ data }: { data: PageBlocksMonochrome }) => {
  const shouldReduceMotion = useReducedMotion();

  // wrapperRef é usado para observar entrada na viewport e também como target para useScroll
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // useInView: diminuí a quantidade exigida para considerar "in view"
  // (mantém o componente animado montado mais tempo e evita desmontagens bruscas)
  const isInView = useInView(wrapperRef, { amount: 0.05 });

  // useScroll no wrapper — mantemos o hook no escopo do wrapper e passamos progress adiante
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end start'],
  });

  if (shouldReduceMotion) {
    return (
      <div ref={wrapperRef} id="Monochrome">
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

  // Em vez de desmontar o AnimatedMonochrome quando sair da viewport,
  // mantemos montado e apenas deixamos o isInView controlar se queremos
  // fazer render otimizado no futuro (aqui mantemos montado para evitar flicker)
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
