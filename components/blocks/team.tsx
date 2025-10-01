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
  const listRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])

  const [grayscales, setGrayscales] = useState<number[]>(
    Array((data.members?.length) || 0).fill(1)
  )

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(max-width: 767px)")
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener?.("change", handler)
    handler()
    return () => mq.removeEventListener?.("change", handler)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], ["30deg", "0deg", "-30deg"])
  const springRotate = useSpring(rotateX, { stiffness: 220, damping: 30 })

  useEffect(() => {
    if (!isMobile) return
    let rafId = 0
    let mounted = true

    const update = () => {
      if (!mounted) return
      const container = listRef.current
      if (!container) {
        rafId = requestAnimationFrame(update)
        return
      }

      const containerRect = container.getBoundingClientRect()
      const containerCenterX = containerRect.left + containerRect.width / 2

      const newGs = (itemRefs.current || []).map((el) => {
        if (!el) return 1
        const r = el.getBoundingClientRect()
        const itemCenterX = r.left + r.width / 2
        const dist = Math.abs(itemCenterX - containerCenterX)
        const norm = Math.min(1, dist / (containerRect.width / 2))
        const eased = Math.pow(norm, 1.2) // tweak exponent for feel
        return Math.min(1, Math.max(0, eased))
      })

      setGrayscales((prev) => {
        if (prev.length !== newGs.length) return newGs
        for (let i = 0; i < newGs.length; i++) {
          if (Math.abs((prev[i] || 0) - newGs[i]) > 0.01) return newGs
        }
        return prev
      })

      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)

    return () => {
      mounted = false
      cancelAnimationFrame(rafId)
    }
  }, [isMobile, data.members?.length])

  useEffect(() => {
    itemRefs.current = Array((data.members?.length) || 0).fill(null)
    setGrayscales(Array((data.members?.length) || 0).fill(1))
  }, [data.members?.length])

  return (
    <div className="w-full py-16 bg-white" data-tina-field={tinaField(data, "")}>
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

      <div className="flex justify-center my-18" ref={containerRef}>
        <motion.div
          ref={listRef}
          className={`flex flex-nowrap md:flex-wrap py-6 justify-start md:justify-center gap-y-12 lg:flex-nowrap md:gap-y-0 pl-4 pr-12 md:px-4 xl:px-8 scrollbar-hide overflow-x-auto md:overflow-hidden`}
          style={
            isMobile
              ? {
                  transformStyle: "preserve-3d",
                  perspective: 900,
                  rotateX: springRotate,
                  transformOrigin: "center center",
                }
              : undefined
          }
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
                ref={(el) => (itemRefs.current[index] = el)}
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