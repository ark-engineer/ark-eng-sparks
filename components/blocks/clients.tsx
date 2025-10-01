'use client';

import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { sectionBlockSchemaField } from '../layout/section';
import Image from 'next/image';
import Marquee from "react-fast-marquee";
import { PageBlocksClientsCarousel, PageBlocksClientsCarouselClients } from '@/tina/__generated__/types';

export const ClientsCarousel = ({ data }: { data: PageBlocksClientsCarousel }) => {

    const handleClientClick = (client: PageBlocksClientsCarouselClients) => {
        if (!client.link) return;

        window.open(client.link, '_blank', 'noopener,noreferrer');
    };
    return (
        <div className="w-full bg-white overflow-hidden mb-18">
            <div className="text-center mb-12">
                <h2
                    className="text-[28px] sm:text-[36px] font-medium text-black text-center capitalize font-inter leading-normal not-italic"
                    data-tina-field={tinaField(data, 'carouselTitle')}
                >
                    {data.carouselTitle}
                </h2>
            </div>

            <div className="relative w-full">
                <Marquee
                    pauseOnHover={true}
                    gradient
                    autoFill
                    speed={data.speed || 50}
                >
                    {(data.clients as PageBlocksClientsCarouselClients[]).map((client, index) => (
                        <div
                            key={`${client.name}-${index}`}
                            className={`flex items-center justify-center mx-4 sm:mx-8 w-75 ${client.link ? 'cursor-pointer' : ''
                                }`}
                            onClick={() => handleClientClick(client)}
                            data-tina-field={tinaField(data, `clients.${index}` as any)}                        >
                            <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                <Image
                                    src={client.image || '/api/placeholder/200/100'}
                                    alt={client.alt || client.name || 'Cliente'}
                                    width={400}
                                    height={400}
                                    className=" max-w-full max-h-full filter grayscale-85 hover:grayscale-0 transition-all duration-300"
                                />
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>
        </div>
    );
};

export const clientsCarouselSchema: Template = {
    name: 'clientsCarousel',
    label: 'Carousel de Clientes',
    ui: {
        previewSrc: '/blocks/clients-carousel.png',
        defaultItem: {
            carouselTitle: 'Clientes',
            speed: 50,
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
            type: 'number',
            label: 'Velocidade',
            name: 'speed',
            description: 'Velocidade do carrossel em pixels/segundo (padrão: 50)',
            ui: {
                step: 10,
                min: 10,
                max: 200,
            },
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