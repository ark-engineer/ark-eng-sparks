'use client';
import { iconSchema } from '@/tina/fields/icon';
import * as React from 'react';
import type { Template } from 'tinacms';
import { PageBlocksHero } from '../../tina/__generated__/types';
import { Section, sectionBlockSchemaField } from '../layout/section';

export const Hero = ({ data }: { data: PageBlocksHero }) => {
  let gradientStyle: React.CSSProperties | undefined = undefined;
  if (data.background) {
    const colorName = data.background
      .replace(/\/\d{1,2}$/, '')
      .split('-')
      .slice(1)
      .join('-');
    const opacity = data.background.match(/\/(\d{1,3})$/)?.[1] || '100';
    gradientStyle = {
      '--tw-gradient-to': `color-mix(in oklab, var(--color-${colorName}) ${opacity}%, transparent)`,
    } as React.CSSProperties;
  }

  // Fix: Check if backgroundImage exists and has a value, otherwise use fallback
  const backgroundImageUrl = data.backgroundImage && data.backgroundImage.trim() 
    ? data.backgroundImage 
    : '/footer-icons/background.png';

  return (
    <Section
      background={data.background!}
      style={{
        padding: 0,
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...gradientStyle,
      }}
    >
      <div className="h-dvh hero-gradient"></div>
    </Section>
  );
};

export const heroBlockSchema: Template = {
  name: 'hero',
  label: 'Hero',
  ui: {
    previewSrc: '/blocks/hero.png',
    defaultItem: {
      tagline: "Here's some text above the other text",
      headline: 'This Big Text is Totally Awesome',
      text: 'Phasellus scelerisque, libero eu finibus rutrum, risus risus accumsan libero, nec molestie urna dui a leo.',
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Headline',
      name: 'headline',
    },
    {
      type: 'string',
      label: 'Tagline',
      name: 'tagline',
    },
    {
      type: 'image',
      label: 'Background Image',
      name: 'backgroundImage',
      ui: {
        format(value) {
          return value && !value.startsWith("/") ? `/${value}` : value;
        },
        parse(value) {
          return value && value.startsWith("/") ? value.slice(1) : value;
        },
      },
    },
    {
      label: 'Actions',
      name: 'actions',
      type: 'object',
      list: true,
      ui: {
        defaultItem: {
          label: 'Action Label',
          type: 'button',
          icon: true,
          link: '/',
        },
        itemProps: (item) => ({ label: item.label }),
      },
      fields: [
        {
          label: 'Label',
          name: 'label',
          type: 'string',
        },
        {
          label: 'Type',
          name: 'type',
          type: 'string',
          options: [
            { label: 'Button', value: 'button' },
            { label: 'Link', value: 'link' },
          ],
        },
        iconSchema as any,
        {
          label: 'Link',
          name: 'link',
          type: 'string',
        },
      ],
    },
    {
      type: 'object',
      label: 'Hero Image/Video',
      name: 'image',
      fields: [
        {
          name: 'src',
          label: 'Image Source',
          type: 'image',
        },
        {
          name: 'alt',
          label: 'Alt Text',
          type: 'string',
        },
        {
          name: 'videoUrl',
          label: 'Video URL',
          type: 'string',
          description: 'If using a YouTube video, make sure to use the embed version of the video URL',
        },
      ],
    },
  ],
};