'use client';
import React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { PageBlocksMonochrome } from "@/tina/__generated__/types";

export const Monochrome = ({ data }: { data: PageBlocksMonochrome }) => {
  return (
    <Section
    className='mt-15 grid center w-[75%] min-h-[375px] rounded-3xl bg-cover bg-center bg-no-repeat'
    style={{ 
      backgroundImage: `url(${data.backgroundImage})`, 
    }}>
      <div className="mx-8 flex flex-row items-center gap-8">
        <div className="w-[70%]">
        {data.leftImage && (
          <img 
            src={data.leftImage} 
            alt="logos left" 
            className="max-w-[300px] md:w-1/2 h-auto" 
            data-tina-field={tinaField(data, 'leftImage')} 
          />
        )}
        </div>
        <p 
          className="text-white text-[18.317px] font-extralight leading-normal" 
          data-tina-field={tinaField(data, 'text')}
        >
          {data.text}
        </p>
      </div>
    </Section>
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