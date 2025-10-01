"use client"

import type { Template } from "tinacms"
import { tinaField } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import { sectionBlockSchemaField } from "../layout/section"
import Image from "next/image"

export const TeamSection = ({ data }: { data: any }) => {
  const getZIndex = (index: number, total: number): number => {
    const middleIndex = Math.floor(total / 2)
    const distanceFromMiddle = Math.abs(index - middleIndex)
    return Math.max(1, 40 - distanceFromMiddle * 5)
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

      <div className="flex justify-center my-18">
        <div className="flex flex-wrap py-6 justify-center gap-y-12 lg:flex-nowrap md:gap-y-0 px-4 xl:px-8 scrollbar-hide overflow-hidden">
          {data.members?.map((member: any, index: number) => (
            <div
              key={index}
              className={`
                relative flex flex-col items-center text-center 
                w-full sm:w-1/2 mb-8 md:mb-0
                ${index > 0 ? "lg:-ml-[calc(2rem+10px)]" : ""}
              `}
              data-tina-field={tinaField(data.members, `${index}`)}
              style={{ zIndex: getZIndex(index, data.members.length) }}
            >
              {(() => {
                const nameParts = (member.name || '').split(' ').slice(0, 2);
                const initials = nameParts.map((part: string) => part.charAt(0)?.toUpperCase() || '').join('');

                return member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name || "Membro da equipe"}
                    className="relative inline-block object-cover size-44 min-w-44 min-h-44 lg:min-w-0 lg:min-h-0 lg:max-w-35 lg:max-h-35 transition-all duration-300 ease-in-out hover:-translate-y-3 hover:scale-102 z-10 filter grayscale-85 hover:grayscale-0 rounded-full border-[10px] border-white"
                    style={{
                      background: "lightgray 50% / cover no-repeat",
                    }}
                    width={193}
                    height={193}
                  />
                ) : (
                  <div
                    className="relative grid place-items-center size-44 min-w-44 min-h-44 lg:min-w-0 lg:min-h-0 lg:max-w-35 lg:max-h-35 transition-all duration-300 ease-in-out hover:-translate-y-3 hover:scale-110 z-10 rounded-full border-[10px] border-white text-xl font-bold text-gray-700"
                    style={{
                      backgroundColor: "lightgray",
                    }}
                  >
                    <span className="font-extralight">
                      {initials || 'MN'}
                    </span>
                  </div>
                );
              })()}
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
          photo: null,
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
          description: "Descrição da imagem para acessibilidade"
        },
      ],
    },
  ],
}