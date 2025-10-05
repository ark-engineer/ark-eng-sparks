"use client"
import type { Template } from "tinacms"
import { tinaField } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import { sectionBlockSchemaField } from "../layout/section"
import Image from "next/image"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export const TeamSection = ({ data }: { data: any }) => {
  const getZIndex = (index: number, total: number): number => {
    const middleIndex = Math.floor(total / 2)
    const distanceFromMiddle = Math.abs(index - middleIndex)
    return Math.max(1, 40 - distanceFromMiddle * 5)
  }

  const containerRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])

  // Inicialize isMobile como false para combinar com o render do servidor
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [viewportWidth, setViewportWidth] = useState<number>(0)
  const [viewportHeight, setViewportHeight] = useState<number>(0)
  const [stickyTop, setStickyTop] = useState<number>(0)
  const [grayscales, setGrayscales] = useState<number[]>(
    Array((data.members?.length) || 0).fill(1)
  )

  // Detecte isMobile, viewportWidth e viewportHeight apenas após o mount no client-side
  useEffect(() => {
    if (typeof window === "undefined") return

    const mq = window.matchMedia("(max-width: 767px)")
    const handleMediaChange = () => setIsMobile(mq.matches)
    mq.addEventListener("change", handleMediaChange)
    handleMediaChange()

    const handleResize = () => {
      setViewportWidth(window.innerWidth)
      setViewportHeight(window.innerHeight)
    }
    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      mq.removeEventListener("change", handleMediaChange)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Calcule o top para sticky no meio da tela
  useEffect(() => {
    if (!isMobile || !stickyRef.current || viewportHeight === 0) return

    const updateStickyTop = () => {
      const stickyHeight = stickyRef.current?.getBoundingClientRect().height || 0
      const newTop = (viewportHeight - stickyHeight) / 2
      setStickyTop(newTop)
    }

    updateStickyTop()

    // Atualize ao redimensionar ou quando o conteúdo mudar
    const resizeObserver = new ResizeObserver(updateStickyTop)
    if (stickyRef.current) {
      resizeObserver.observe(stickyRef.current)
    }

    return () => {
      if (stickyRef.current) {
        resizeObserver.unobserve(stickyRef.current)
      }
    }
  }, [isMobile, viewportHeight, data])

  // Scroll tracking for mobile horizontal animation
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  })

  // Rotation animation
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], ["30deg", "0deg", "-30deg"])
  const springRotate = useSpring(rotateX, { stiffness: 220, damping: 30 })

  // Calculate horizontal scroll for mobile with centering
  const CARD_WIDTH = 180 // min-w-[180px] from your component
  const CARD_OVERLAP = 24 // -ml-6 = 24px overlap
  const spacing = CARD_WIDTH - CARD_OVERLAP

  const totalMembers = data.members?.length || 0
  const lastPos = (totalMembers - 1) * spacing
  const maxScale = 1.06 // Max scale for centered item
  const scaledCardWidth = CARD_WIDTH * maxScale
  const centerOffset = viewportWidth > 0 ? (viewportWidth - scaledCardWidth) / 2 : 0
  const initialX = centerOffset
  const finalX = centerOffset - lastPos

  // Map scroll progress to horizontal translation with asymmetric plateaus for better visibility on reverse scroll
  const x = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [initialX, initialX, finalX, finalX])
  const springX = useSpring(x, { stiffness: 100, damping: 30 })

  // Update grayscale based on position during scroll
  useEffect(() => {
    if (!isMobile || viewportWidth === 0) return

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const centerPosition = viewportWidth / 2
      const newGs = data.members?.map((_: any, index: number) => {
        // Calculate item position based on scroll
        const itemPosition = index * spacing + springX.get()
        const itemCenter = itemPosition + CARD_WIDTH / 2
        const distance = Math.abs(itemCenter - centerPosition)
        const maxDistance = viewportWidth / 2
        const normalized = Math.min(1, distance / maxDistance)
        return Math.min(1, Math.max(0, Math.pow(normalized, 1.2)))
      }) || []
      setGrayscales(newGs)
    })

    return () => unsubscribe()
  }, [isMobile, viewportWidth, data.members, scrollYProgress, springX, spacing, CARD_WIDTH])

  useEffect(() => {
    itemRefs.current = Array((data.members?.length) || 0).fill(null)
    setGrayscales(Array((data.members?.length) || 0).fill(1))
  }, [data.members?.length])

  // Mobile wrapper height for scroll area - increased to 400vh for slower animation, giving more time to view items
  const mobileWrapperHeight = isMobile ? "400vh" : "auto"

  // If viewportWidth not set yet, fallback to non-mobile render to avoid hydration issues
  if (isMobile && viewportWidth === 0) {
    return null // Or a loading spinner, but since quick, null is fine
  }

  return (
    <div
      className="w-full py-16 bg-white"
      data-tina-field={tinaField(data, "")}
      ref={wrapperRef}
      style={{ height: mobileWrapperHeight }}
    >
      <div
        ref={stickyRef}
        className={`${isMobile ? 'sticky' : ''}`}
        style={{ top: isMobile ? `${stickyTop}px` : undefined }}
      >
        <div className="text-center mb-16">
          <h2
            className="text-4xl font-bold text-gray-900 leading-[4rem]"
            data-tina-field={tinaField(data, "title_section")}
          >
            {data.title_section}
          </h2>
          <div
            className="prose prose-lg max-w-4xl mx-auto text-gray-700 leading-relaxed text-center"
            data-tina-field={tinaField(data, "teamDescription")}
          >
            <TinaMarkdown content={data.teamDescription} />
          </div>
        </div>
        <div
          className={`w-full flex ${isMobile ? 'justify-start' : 'justify-center'} my-18 overflow-hidden`}
          ref={containerRef}
        >
          <motion.div
            ref={listRef}
            className={`flex flex-nowrap md:flex-wrap py-6 justify-start md:justify-center gap-y-12 lg:flex-nowrap md:gap-y-0 ${
              isMobile ? '' : 'pl-4 pr-12 md:px-4 xl:px-8 scrollbar-hide overflow-x-auto md:overflow-hidden'
            }`}
            style={{
              ...(isMobile ? {
                transformStyle: "preserve-3d",
                perspective: 900,
                rotateX: springRotate,
                transformOrigin: "center center",
                x: springX,
                width: "max-content",
              } : undefined)
            }}
          >
            {data.members?.map((member: any, index: number) => {
              const nameParts = (member.name || "").split(" ").slice(0, 2)
              const initials = nameParts.map((p: string) => p.charAt(0)?.toUpperCase() || "").join("")
              const g = grayscales[index] ?? 1
              const scale = 1 + (1 - g) * 0.06
              const z = getZIndex(index, data.members.length)
              return (
                <div
                  key={index}
                  ref={(el: any) => (itemRefs.current[index] = el)}
                  className={`
                    relative flex flex-col items-center text-center
                    min-w-[180px] md:w-full md:min-w-0 sm:w-1/2 mb-8 md:mb-0 flex-shrink-0 md:flex-shrink
                    ${index > 0 ? "-ml-6 md:ml-0 lg:-ml-[calc(2rem+10px)]" : ""}
                  `}
                  data-tina-field={tinaField(data.members, `${index}`)}
                  style={{
                    zIndex: z,
                    transform: isMobile ? `scale(${scale})` : undefined,
                    transition: "transform 220ms cubic-bezier(.2,.9,.2,1), filter 200ms ease",
                  }}
                >
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name || "Membro da equipe"}
                      className="relative inline-block object-cover size-44 min-w-44 min-h-44 lg:min-w-0 lg:min-h-0 lg:max-w-35 lg:max-h-35 transition-all duration-300 ease-in-out hover:-translate-y-3 hover:scale-102 rounded-full border-[10px] border-white md:grayscale md:hover:grayscale-0"
                      style={{
                        background: "lightgray 50% / cover no-repeat",
                        filter: isMobile ? `grayscale(${Math.round(g * 100)}%)` : undefined,
                      }}
                      width={193}
                      height={193}
                    />
                  ) : (
                    <div
                      className="relative grid place-items-center size-44 min-w-44 min-h-44 lg:min-w-0 lg:min-h-0 lg:max-w-35 lg:max-h-35 transition-all duration-300 ease-in-out hover:-translate-y-3 hover:scale-110 rounded-full border-[10px] border-white text-xl font-bold text-gray-700 md:grayscale md:hover:grayscale-0"
                      style={{
                        backgroundColor: "lightgray",
                        filter: isMobile ? `grayscale(${Math.round(g * 100)}%)` : undefined,
                      }}
                    >
                      <span className="font-extralight">{initials || "MN"}</span>
                    </div>
                  )}
                  <h3
                    className="prose-2xl lg:prose-xl text-black text-center font-medium capitalize mb-0 leading-[20px] lg:leading-6"
                    data-tina-field={tinaField(member, "name")}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="prose-xl lg:prose-md mt-2 lg:mt-0 opacity-[0.5] text-center font-medium capitalize leading-[1.25rem]"
                    data-tina-field={tinaField(member, "position")}
                  >
                    {member.position}
                  </p>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export const teamSectionSchema: Template = {
  name: "teamSection",
  label: "Seção da Equipe",
  ui: {
    previewSrc: "/blocks/team-section.png",
    defaultItem: {
      title_section: "Nossa Equipe",
      members: [
        {
          name: "Ana Silva",
          position: "CEO & Fundadora",
          photo: "/api/placeholder/200/200",
          alt: "Foto da Ana Silva",
        },
        {
          name: "Carlos Santos",
          position: "Diretor Técnico",
          photo: "/api/placeholder/200/200",
          alt: "Foto do Carlos Santos",
        },
        {
          name: "Maria Oliveira",
          position: "Arquiteta Senior",
          photo: "/api/placeholder/200/200",
          alt: "Foto da Maria Oliveira",
        },
        {
          name: "João Costa",
          position: "Engenheiro Civil",
          photo: "/api/placeholder/200/200",
          alt: "Foto do João Costa",
        },
        {
          name: "Luciana Ferreira",
          position: "Gerente de Projetos",
          photo: "/api/placeholder/200/200",
          alt: "Foto da Luciana Ferreira",
        },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Título",
      name: "title_section",
      required: true,
    },
    {
      type: "rich-text",
      label: "Descrição do time",
      name: "teamDescription",
      toolbarOverride: ["bold", "italic", "link", "heading", "quote", "ul", "ol"],
    },
    {
      type: "object",
      list: true,
      label: "Membros da Equipe",
      name: "members",
      ui: {
        defaultItem: {
          name: "Nome do Membro",
          position: "Cargo",
          photo: null,
          alt: "",
        },
        itemProps: (item) => ({
          label: item.name || "Membro da Equipe",
        }),
      },
      fields: [
        {
          type: "string",
          label: "Nome",
          name: "name",
          required: true,
        },
        {
          type: "string",
          label: "Cargo",
          name: "position",
          required: false,
        },
        {
          type: "image",
          label: "Foto",
          name: "photo",
          required: false,
        },
        {
          type: "string",
          label: "Texto Alternativo",
          name: "alt",
          description: "Descrição da imagem para acessibilidade",
        },
      ],
    },
  ],
}