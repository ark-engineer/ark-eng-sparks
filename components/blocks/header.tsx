'use client';
import React from 'react';
import Link from 'next/link';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { useLayout } from '../layout/layout-context';

export const Header = ({ data }: { data?: any }) => {
  const { globalSettings } = useLayout();
  const header = data || globalSettings?.header;

  if (!header || !header.nav) return null;

  const logoAlt = header.name || 'home';

  return (
    <header>
      {/* DESKTOP */}
      <nav className="hidden lg:flex absolute z-50 left-0 right-0 mx-auto my-1 w-[93.59%] max-sm:w-[90%] h-[72px] max-md:h-[60px] px-4 py-[10px] text-white rounded-[20px] items-center justify-between">
        <Link
          href="/"
          aria-label={logoAlt}
          className="flex items-center space-x-2 px-2 py-2"
          data-tina-field={tinaField(header, 'name')}
        >
          {/* SVG logo */}
          <svg width='40' height='36' viewBox='0 0 40 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
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

        <ul className="flex gap-4 text-sm font-semibold" data-tina-field={tinaField(header, 'nav')}>
          {header.nav?.map((item: any, index: number) => {
            if (!item || !item.label) return null;
            return (
              <li key={index}>
                <Link
                  href={item.href || '/'}
                  className="flex items-center gap-2.5 rounded-lg cursor-pointer transition-colors"
                  data-tina-field={tinaField(item, 'href')}
                >
                  <span className="px-2 py-4" data-tina-field={tinaField(item, 'label')}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* MOBILE */}
      <div className="lg:hidden">
        {/* Fale Conosco topo direito */}
        <div className="fixed top-2 right-2 bg-black text-white rounded-sm px-3 py-2 text-sm z-50">
          {header.nav
            ?.filter((item: any) => item?.label === 'Fale Conosco')
            .map((item: any, index: number) => (
              <Link key={index} href={item.href || '/'} data-tina-field={tinaField(item, 'href')}>
                {item.label}
              </Link>
            ))}
        </div>

        {/* Logo, Sobre, Serviços no rodapé */}
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black text-white rounded-sm px-4 py-3 z-51 min-w-[65%] opacity-[0.9.4]">
          {/* Logo */}
          <Link
            href="/"
            aria-label={logoAlt}
            className="flex items-center"
            data-tina-field={tinaField(header, 'name')}
          >
            <svg width='40' height='36' viewBox='0 0 40 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
          <div className='flex ml-auto w-[100%] gap-6 justify-end'>
            {header.nav
              ?.filter((item: any) => item?.label !== 'Fale Conosco')
              .map((item: any, index: number) => (
                <Link
                  key={index}
                  href={item.href || '/'}
                  className="text-sm"
                  data-tina-field={tinaField(item, 'href')}
                >
                  {item.label}
                </Link>
              ))}

          </div></div>
      </div>
    </header>
  );
};

export const headerBlockSchema: Template = {
  name: 'header',
  label: 'Header',
  ui: {
    previewSrc: '/blocks/header.png',
    defaultItem: {
      nav: [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Sobre',
          href: '#Monochrome',
        },
        {
          label: 'Serviços',
          href: '#custom-services',
        },
        {
          label: 'Contato',
          href: '#contact',
        },
        {
          label: 'Fale Conosco',
          href: '#contact',
        },
      ],
    },
  },
  fields: [
    {
      type: 'object',
      label: 'Navegação',
      name: 'nav',
      list: true,
      ui: {
        itemProps: (item: any) => {
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
          description: 'Ex: /, #Monochrome, #contact, www.outro-site.com, etc.',
        },
      ],
    },
  ],
};

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
      type: 'string',
      label: 'Nome do Site',
      name: 'name',
      description: 'Nome do site usado como fallback para o alt do logo',
    },
    {
      type: 'string',
      label: 'Cor Principal',
      name: 'color',
      description: 'Cor principal do tema',
    },
    {
      type: 'object',
      label: 'Ícone',
      name: 'icon',
      fields: [
        {
          type: 'string',
          label: 'Nome',
          name: 'name',
        },
        {
          type: 'string',
          label: 'Cor',
          name: 'color',
        },
        {
          type: 'string',
          label: 'Estilo',
          name: 'style',
        },
      ],
    },
    {
      type: 'object',
      label: 'Itens da Navegação',
      name: 'nav',
      list: true,
      ui: {
        itemProps: (item: any) => {
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
