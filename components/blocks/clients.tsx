"use client"

import { useRef, useEffect } from "react"
import type { Template } from "tinacms"
import { tinaField } from "tinacms/dist/react"
import { sectionBlockSchemaField } from "../layout/section"

type ClientLogo = {
  image: string
  alt?: string
  link?: string
  name: string
}

type ClientsCarouselData = {
  carouselTitle: string
  clients: ClientLogo[]
}

export const ClientsCarousel = ({ data }: { data: any }) => {
  const duplicatedClients = data.clients ? [ ...data.clients, ...data.clients, ...data.clients ] : []

  const trackRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)

  useEffect(() => {
    if (trackRef.current && !animationRef.current) {
      animationRef.current = trackRef.current.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-33.333%)" },
        ],
        {
          duration: 30000,
          iterations: Infinity,
          easing: "linear",
        }
      )
    }
  }, [])

  const handleMouseEnter = () => {
    if (animationRef.current) {
      animationRef.current.playbackRate = 0.5
    }
  }

  const handleMouseLeave = () => {
    if (animationRef.current) {
      animationRef.current.playbackRate = 1.0
    }
  }

  const handleClientClick = (client: ClientLogo) => {
    if (client.link) {
      window.open(client.link, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div
      className="w-full lg:py-10 bg-white overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-center mb-12">
        <h2
          className="text-[28px] sm:text-[36px] font-medium text-black text-center capitalize font-inter leading-normal not-italic"
          data-tina-field={tinaField(data, "carouselTitle")}
        >
          {data.carouselTitle}
        </h2>
      </div>

      <div
        className="carousel-container relative w-full"
      >
        <div ref={trackRef} className="carousel-track flex items-center p-[5dvh]">
          {duplicatedClients.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className={`carousel-item flex-shrink-0 flex items-center justify-center mx-4 sm:mx-8 ${client.link ? "cursor-pointer" : ""
                }`}
              onClick={() => handleClientClick(client)}
              data-tina-field={tinaField(data, "clients")}
            >
              <img
                src={client.image || "/api/placeholder/200/100"}
                alt={client.alt || client.name || "Cliente"}
                className="
                   sm:max-h-28 lg:max-h-44
                  max-w-[8rem] sm:max-w-[12rem]
                  object-contain filter grayscale hover:grayscale-0
                  transition-all duration-300 hover:scale-105
                "
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const clientsCarouselSchema: Template = {
  name: "clientsCarousel",
  label: "Carousel de Clientes",
  ui: {
    previewSrc: "/blocks/clients-carousel.png",
    defaultItem: {
      carouselTitle: "Clientes",
      clients: [
        {
          name: "Cliente 1",
          image: "/api/placeholder/200/100",
          alt: "Logo Cliente 1",
          link: "https://exemplo1.com",
        },
        {
          name: "Cliente 2",
          image: "/api/placeholder/200/100",
          alt: "Logo Cliente 2",
          link: "https://exemplo2.com",
        },
        {
          name: "Cliente 3",
          image: "/api/placeholder/200/100",
          alt: "Logo Cliente 3",
          link: "",
        },
        {
          name: "Cliente 4",
          image: "/api/placeholder/200/100",
          alt: "Logo Cliente 4",
          link: "https://exemplo4.com",
        },
        {
          name: "Cliente 5",
          image: "/api/placeholder/200/100",
          alt: "Logo Cliente 5",
          link: "",
        },
        {
          name: "Cliente 6",
          image: "/api/placeholder/200/100",
          alt: "Logo Cliente 6",
          link: "https://exemplo6.com",
        },
        {
          name: "Cliente 7",
          image: "/api/placeholder/200/100",
          alt: "Logo Cliente 7",
          link: "",
        },
        {
          name: "Cliente 8",
          image: "/api/placeholder/200/100",
          alt: "Logo Cliente 8",
          link: "https://exemplo8.com",
        },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Título",
      name: "carouselTitle",
    },
    {
      type: "object",
      list: true,
      label: "Clientes",
      name: "clients",
      ui: {
        defaultItem: {
          name: "Novo Cliente",
          image: "/api/placeholder/200/100",
          alt: "",
          link: "",
        },
        itemProps: (item) => ({
          label: item.name || "Cliente",
        }),
      },
      fields: [
        {
          type: "string",
          label: "Nome do Cliente",
          name: "name",
          required: true,
        },
        {
          type: "image",
          label: "Logo",
          name: "image",
          required: true,
        },
        {
          type: "string",
          label: "Texto Alternativo",
          name: "alt",
        },
        {
          type: "string",
          label: "Link (opcional)",
          name: "link",
          description: "URL para redirecionar quando clicar no logo",
        },
      ],
    },
  ],
}
