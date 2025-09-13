'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { sectionBlockSchemaField } from '../layout/section';
import Image from 'next/image';

type ClientLogo = {
  image: string;
  alt?: string;
  link?: string;
  name: string;
};

export const ClientsCarousel = ({ data }: { data: any }) => {
  const duplicatedClients = data.clients ? [...data.clients, ...data.clients, ...data.clients] : [];
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [speed, setSpeed] = useState(isMobile ? 3.5 : 1.0);

  const [translateX, setTranslateX] = useState(0);
  const duration = 30000;
  const cycleDistance = 33.333;

  const animate = useCallback(
    (currentTime: number) => {
      const elapsed = (currentTime - startTimeRef.current) * speed;
      const progress = (elapsed % duration) / duration;
      const newTranslateX = -cycleDistance * progress;
      setTranslateX(newTranslateX);
      rafRef.current = requestAnimationFrame(animate);
    },
    [speed, duration, cycleDistance]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    startTimeRef.current = Date.now();
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate]);

  const handleMouseEnter = useCallback(() => {
    setSpeed(isMobile ? 2.0 : 0.5); // Reduzir velocidade no hover, mas ainda rápida no mobile
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setSpeed(isMobile ? 3.5 : 1.0); // Restaurar velocidade alta no mobile
  }, [isMobile]);

  const handleClientClick = (client: ClientLogo) => {
    if (client.link) {
      window.open(client.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="w-full bg-white overflow-hidden mb-18"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-center mb-12">
        <h2
          className="text-[28px] sm:text-[36px] font-medium text-black text-center capitalize font-inter leading-normal not-italic"
          data-tina-field={tinaField(data, 'carouselTitle')}
        >
          {data.carouselTitle}
        </h2>
      </div>
      <div className="relative w-full">
        <div
          ref={trackRef}
          className="carousel-track flex items-center p-[5dvh] will-change-transform transition-transform duration-0"
          style={{
            transform: `translateX(${translateX}%) translateZ(0)`,
          }}
        >
          {duplicatedClients.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className={`flex items-center justify-center mx-4 sm:mx-8 w-75 ${
                client.link ? 'cursor-pointer' : ''
              }`}
              onClick={() => handleClientClick(client)}
              data-tina-field={tinaField(data, 'clients')}
            >
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <Image
                  src={client.image || '/api/placeholder/200/100'}
                  alt={client.alt || client.name || 'Cliente'}
                  width={400}
                  height={400}
                  className="
                    shit-flicker
                    max-w-full
                    max-h-full
                    filter grayscale-85 hover:grayscale-0
                    transition-all duration-300
                  "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// O schema permanece inalterado
export const clientsCarouselSchema: Template = {
  name: 'clientsCarousel',
  label: 'Carousel de Clientes',
  ui: {
    previewSrc: '/blocks/clients-carousel.png',
    defaultItem: {
      carouselTitle: 'Clientes',
      clients: [
        {
          name: 'Cliente 1',
          image: '/api/placeholder/200/100',
          alt: 'Logo Cliente 1',
          link: 'https://exemplo1.com',
        },
        {
          name: 'Cliente 2',
          image: '/api/placeholder/200/100',
          alt: 'Logo Cliente 2',
          link: 'https://exemplo2.com',
        },
        {
          name: 'Cliente 3',
          image: '/api/placeholder/200/100',
          alt: 'Logo Cliente 3',
          link: '',
        },
        {
          name: 'Cliente 4',
          image: '/api/placeholder/200/100',
          alt: 'Logo Cliente 4',
          link: 'https://exemplo4.com',
        },
        {
          name: 'Cliente 5',
          image: '/api/placeholder/200/100',
          alt: 'Logo Cliente 5',
          link: '',
        },
        {
          name: 'Cliente 6',
          image: '/api/placeholder/200/100',
          alt: 'Logo Cliente 6',
          link: 'https://exemplo6.com',
        },
        {
          name: 'Cliente 7',
          image: '/api/placeholder/200/100',
          alt: 'Logo Cliente 7',
          link: '',
        },
        {
          name: 'Cliente 8',
          image: '/api/placeholder/200/100',
          alt: 'Logo Cliente 8',
          link: 'https://exemplo8.com',
        },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Título',
      name: 'carouselTitle',
    },
    {
      type: 'object',
      list: true,
      label: 'Clientes',
      name: 'clients',
      ui: {
        defaultItem: {
          name: 'Novo Cliente',
          image: '/api/placeholder/200/100',
          alt: '',
          link: '',
        },
        itemProps: (item) => ({
          label: item.name || 'Cliente',
        }),
      },
      fields: [
        {
          type: 'string',
          label: 'Nome do Cliente',
          name: 'name',
          required: true,
        },
        {
          type: 'image',
          label: 'Logo',
          name: 'image',
          required: true,
        },
        {
          type: 'string',
          label: 'Texto Alternativo',
          name: 'alt',
        },
        {
          type: 'string',
          label: 'Link (opcional)',
          name: 'link',
          description: 'URL para redirecionar quando clicar no logo',
        },
      ],
    },
  ],
};