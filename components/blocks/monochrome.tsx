'use client';
import React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { PageBlocksMonochrome } from "@/tina/__generated__/types";


export const Monochrome = ({ data }: { data: PageBlocksMonochrome }) => {
  return (
    <Section
      className='mt-15 w-[90%] md:w-[75%] rounded-3xl bg-cover bg-center bg-no-repeat'
      style={{ 
        backgroundImage: `url(${data.backgroundImage})`, 
      }}
    >
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 min-h-[375px]">
        
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          {data.leftImage && (
            <img 
              src={data.leftImage} 
              alt="logos left" 
              className="max-w-[300px] w-full h-auto"
              data-tina-field={tinaField(data, 'leftImage')} 
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