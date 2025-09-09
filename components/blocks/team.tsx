"use client"

import type { Template } from "tinacms"
import { tinaField } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import { sectionBlockSchemaField } from "../layout/section"

type TeamMember = {
  name: string
  position: string
  photo: string
  alt?: string
}

export const TeamSection = ({ data }: { data: any }) => {
  const getZIndex = (index: number, total: number): number => {
    const middleIndex = Math.floor(total / 2)
    const distanceFromMiddle = Math.abs(index - middleIndex)
    return 40 - distanceFromMiddle * 10
  }

  return (
    <div className="w-full py-16 bg-white">
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

      <div className="flex justify-center my-14">
        <div className="flex flex-wrap justify-center gap-y-12 md:flex-nowrap md:gap-y-0">
          {data.members?.map((member: any, index: number) => (
            <div
              key={index}
              className={`
                relative flex flex-col items-center text-center 
                w-full sm:w-1/2 mb-8 md:mb-0
                ${index > 0 ? "md:-ml-[calc(2rem+10px)]" : ""}
              `}
              data-tina-field={tinaField(data.members, `${index}`)}
              style={{ zIndex: getZIndex(index, data.members.length) }}
            >
              <img
                src={member.photo || "/api/placeholder/200/200"}
                alt={member.alt || member.name || "Membro da equipe"}
                className="relative inline-block object-cover size-44 transition-all duration-300 ease-in-out hover:-translate-y-3 hover:scale-110 z-10 rounded-full border-[10px] border-white"
                style={{
                  background: `url(${member.photo || "/api/placeholder/200/200"}) lightgray 50% / cover no-repeat`,
                }}
              />
              <h3
                className="prose-2xl text-black text-center font-medium capitalize mb-0 leading-[20px]"
                data-tina-field={tinaField(member, "name")}
              >
                {member.name}
              </h3>
              <p
                className="prose-xl mt-2 text-gray-500 text-center font-medium capitalize leading-[1.25rem]"
                data-tina-field={tinaField(member, "position")}
              >
                {member.position}
              </p>
            </div>
          ))}
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
          alt: "Foto da Ana Silva"
        },
        {
          name: "Carlos Santos",
          position: "Diretor Técnico",
          photo: "/api/placeholder/200/200",
          alt: "Foto do Carlos Santos"
        },
        {
          name: "Maria Oliveira",
          position: "Arquiteta Senior",
          photo: "/api/placeholder/200/200",
          alt: "Foto da Maria Oliveira"
        },
        {
          name: "João Costa",
          position: "Engenheiro Civil",
          photo: "/api/placeholder/200/200",
          alt: "Foto do João Costa"
        },
        {
          name: "Luciana Ferreira",
          position: "Gerente de Projetos",
          photo: "/api/placeholder/200/200",
          alt: "Foto da Luciana Ferreira"
        }
      ]
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
      toolbarOverride: [
        "bold",
        "italic",
        "link",
        "heading",
        "quote",
        "ul",
        "ol",
      ],
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
          photo: "/api/placeholder/200/200",
          alt: ""
        },
        itemProps: (item) => ({
          label: item.name || "Membro da Equipe"
        })
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
          required: true,
        },
        {
          type: "image",
          label: "Foto",
          name: "photo",
          required: true,
        },
        {
          type: "string",
          label: "Texto Alternativo",
          name: "alt",
          description: "Descrição da imagem para acessibilidade"
        },
      ],
    },
  ],
}