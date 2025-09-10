'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    motion,
    useScroll,
    useTransform,
    useReducedMotion,
} from 'framer-motion';
import { tinaField } from 'tinacms/dist/react';
import type { Template } from 'tinacms';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    InstagramIcon,
    MapsSquare01Icon,
    WhatsappIcon,
} from '@hugeicons/core-free-icons';
import type { PageBlocksFooter } from '@/tina/__generated__/types';

const options = ['instagram', 'whatsapp', 'location'];
const iconsMap: Record<string, IconSvgObject> = {
    instagram: InstagramIcon,
    whatsapp: WhatsappIcon,
    location: MapsSquare01Icon,
};

const CustomSelect = ({ input }: any) => {
    return (
        <select {...input} className='bg-black-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

type IconSvgObject = ([string, {
    [key: string]: string | number;
}])[] | readonly (readonly [string, {
    readonly [key: string]: string | number;
}])[];

export const Footer = ({ data }: { data: PageBlocksFooter }) => {
    const ref = useRef<HTMLDivElement>(null);

    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        const scrollEvent = new CustomEvent('scrollToTop', {
            detail: { smooth: true }
        });
        window.dispatchEvent(scrollEvent);
    };

    return (
        <motion.footer
            ref={ref}
            className="flex justify-between rounded-3xl bg-black h-[83px] w-[95%] mx-auto my-3 mb-4 text-white text-base flex-wrap xs:mb-6"
        >
            <motion.div
                className="grid place-items-center mx-5"
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 200 }}
            >
                {data.logo && (
                    <button
                        onClick={scrollToTop}
                        aria-label="Voltar ao topo"
                        className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg p-1"
                    >
                        <Image
                            src={data.logo}
                            width={38}
                            height={38}
                            alt="logo"
                            data-tina-field={tinaField(data, 'logo')}
                            className="transition-transform duration-200"
                        />
                    </button>
                )}
            </motion.div>

            <div className="flex flex-col justify-end p-[20px]">
                <div className="flex flex-row gap-4">
                    {data?.links?.map((link, i) => {
                        const IconComp = link?.icon ? iconsMap[link.icon] : null;
                        return (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.2, y: -3 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Link
                                    href={link?.url || '/'}
                                    aria-label={link?.label || 'footer link'}
                                    data-tina-field={tinaField(link, 'url')}
                                >
                                    {IconComp && (
                                        <HugeiconsIcon
                                            name={link?.icon as string}
                                            icon={IconComp}
                                            className="cursor-pointer transition-transform duration-200"
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <div>
                    <p data-tina-field={tinaField(data, 'text')}>
                        {data.text ||
                            `Copyright © ${new Date().getFullYear()}. Todos os direitos reservados`}
                    </p>
                </div>
            </div>
        </motion.footer>
    );
};

export const footerBlockSchema: Template = {
    name: 'footer',
    label: 'Footer',
    ui: {
        previewSrc: '/blocks/footer.png',
        defaultItem: {
            logo: '/uploads/project-logos/AE.svg',
            text: `Copyright © ${new Date().getFullYear()}. Todos os direitos reservados`,
            links: [
                { label: 'Instagram', url: '/', icon: 'instagram' },
                { label: 'Whatsapp', url: '/', icon: 'whatsapp' },
                { label: 'Location', url: '/', icon: 'location' },
            ],
        },
    },
    fields: [
        {
            type: 'image',
            name: 'logo',
            label: 'Logo',
        },
        {
            type: 'string',
            name: 'text',
            label: 'Texto Copyright',
            
            ui: {
                component: 'textarea',
            },
        },
        {
            type: 'object',
            name: 'links',
            label: 'Links',
            list: true,
            ui: {
                itemProps: (item) => ({ label: item?.label || 'Link' }),
            },
            fields: [
                {
                    type: 'string',
                    name: 'label',
                    label: 'Label',
                },
                {
                    type: 'string',
                    name: 'url',
                    label: 'URL',
                },
                {
                    type: 'string',
                    name: 'icon',
                    label: 'Ícone',
                    ui: {
                        component: CustomSelect,
                    },
                },
            ],
        },
    ],
};