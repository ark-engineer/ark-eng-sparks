'use client';
import React from 'react';
import Link from 'next/link';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { useLayout } from '../layout/layout-context';

interface HeaderNavItem {
  label: string;
  href: string;
}

interface HeaderData {
  nav: HeaderNavItem[];
  logo?: {
    alt?: string;
    width?: number;
    height?: number;
  };
}

export const Header = ({ data }: { data?: HeaderData }) => {
  const { globalSettings } = useLayout();

  const header = data || globalSettings?.header;

  if (!header) return null;

  return (
    <header>
      <nav
        className={`
          fixed z-50
          left-0 right-0
          mx-auto my-1
          w-full max-w-[1172px]
          h-[72px] max-md:h-[60px] max-sm:h-[52px]
          px-[12px] py-[6px]
          bg-black text-white
          rounded-[20px]
          flex items-center justify-between
          box-border
          lg:top-0
          lg:bottom-auto
          bottom-2 lg:bottom-auto
        `}
      >
        {/* Logo à esquerda */}
        <Link href='/' aria-label={header.logo?.alt || 'home'} className='flex items-center space-x-2' data-tina-field={tinaField(header, 'logo')}>
          <svg width={header.logo?.width || 40} height={header.logo?.height || 36} viewBox='0 0 40 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M11.7102 7.29765L14.6223 0.426758L29.1281 35.5742H23.4584L11.7102 7.29765Z' fill='white' />
            <path
              d='M3.11808 28.207C2.07872 30.6602 1.03936 33.114 0 35.5671C5.12373 35.5623 10.2475 35.5574 15.3718 35.5526C13.6228 35.2325 10.8043 34.4843 7.86436 32.5517C5.63163 31.0848 4.09584 29.439 3.11869 28.207H3.11808Z'
              fill='white'
            />
            <path
              d='M38.1314 28.2783H40.0006V35.5738H35.2078V33.3495C35.7858 32.5384 36.3837 31.6156 36.9659 30.5787C37.4146 29.7785 37.8005 29.0073 38.1314 28.2789V28.2783Z'
              fill='white'
            />
            <path
              d='M38.1308 7.72612H39.9994V0.430664H35.2078C35.2096 1.1898 35.2121 1.94894 35.2139 2.70868C35.7864 3.43762 36.4 4.31876 36.9852 5.35631C37.4599 6.19818 37.8343 6.99839 38.1308 7.72612Z'
              fill='white'
            />
            <path
              d='M33.8924 12.8965H35.2144V23.2647H33.9305C33.3767 22.4524 32.2008 20.9662 30.1747 19.8809C28.6038 19.0396 27.1496 18.7757 26.2395 18.6839H24.8444V17.5528H26.2014C27.1387 17.4241 28.5586 17.1113 30.0895 16.2755C32.0879 15.1848 33.2897 13.7414 33.8924 12.8965Z'
              fill='white'
            />
          </svg>
        </Link>

        {/* Menu items */}
        <div className='flex items-center gap-6 w-full justify-end'>
          {/* Desktop nav */}
          <ul className='hidden lg:flex gap-4 text-sm' data-tina-field={tinaField(header, 'nav')}>
            {header.nav?.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className='flex items-center gap-2.5 border border-[#2E2E2E] rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors'
                  data-tina-field={tinaField(item, 'href')}
                >
                  <span className='px-2 py-5' data-tina-field={tinaField(item, 'label')}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile nav (dock style) */}
          <ul className='flex lg:hidden justify-around w-full text-sm'>
            {header.nav
              ?.filter((item) => item.label !== 'Fale Conosco')
              .map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className='flex items-center gap-2.5 border border-[#2E2E2E] rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors'
                    data-tina-field={tinaField(item, 'href')}
                  >
                    <span className='px-2 py-5' data-tina-field={tinaField(item, 'label')}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

// Schema para o Tina CMS
export const headerBlockSchema: Template = {
  name: 'header',
  label: 'Header',
  ui: {
    previewSrc: '/blocks/header.png',
    defaultItem: {
      logo: {
        alt: 'Logo da empresa',
        width: 40,
        height: 36,
      },
      nav: [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Sobre',
          href: '/sobre',
        },
        {
          label: 'Serviços',
          href: '/servicos',
        },
        {
          label: 'Contato',
          href: '/contato',
        },
        {
          label: 'Fale Conosco',
          href: '/fale-conosco',
        },
      ],
    },
  },
  fields: [
    {
      type: 'object',
      label: 'Logo',
      name: 'logo',
      fields: [
        {
          type: 'string',
          label: 'Alt Text',
          name: 'alt',
          description: 'Texto alternativo para acessibilidade',
        },
        {
          type: 'number',
          label: 'Largura',
          name: 'width',
          description: 'Largura do logo em pixels',
        },
        {
          type: 'number',
          label: 'Altura',
          name: 'height',
          description: 'Altura do logo em pixels',
        },
      ],
    },
    {
      type: 'object',
      label: 'Navegação',
      name: 'nav',
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.label || 'Item do Menu' };
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Texto do Link',
          name: 'label',
          required: true,
        },
        {
          type: 'string',
          label: 'URL',
          name: 'href',
          required: true,
          description: 'Ex: /, /sobre, /contato, etc.',
        },
      ],
    },
  ],
};

// Schema para configuração global (caso você queira usar no tina/config.ts)
export const globalHeaderSchema = {
  label: 'Header Global',
  name: 'header',
  path: 'content/global',
  format: 'json',
  ui: {
    global: true,
  },
  fields: [
    {
      type: 'object',
      label: 'Logo',
      name: 'logo',
      fields: [
        {
          type: 'string',
          label: 'Alt Text',
          name: 'alt',
        },
        {
          type: 'number',
          label: 'Largura',
          name: 'width',
        },
        {
          type: 'number',
          label: 'Altura',
          name: 'height',
        },
      ],
    },
    {
      type: 'object',
      label: 'Itens da Navegação',
      name: 'nav',
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.label || 'Item do Menu' };
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Texto',
          name: 'label',
          required: true,
        },
        {
          type: 'string',
          label: 'Link',
          name: 'href',
          required: true,
        },
      ],
    },
  ],
};
