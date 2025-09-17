"use client"

import type { Template } from "tinacms"
import { tinaField } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import { sectionBlockSchemaField } from "../layout/section"

type AboutUsColumn = {
  columnTitle: string
  description: any // Rich-text content (AST)
}

type AboutUsBlockData = {
  titleAbout: string
  description: string
  purposeTitle: string
  purposeDescription: any 
  columns: AboutUsColumn[]
}

export const AboutUsBlock = ({ data }: { data: any }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h2 
          className="text-4xl font-bold text-gray-900 mb-6"
          data-tina-field={tinaField(data, "titleAbout")}
        >
          {data.titleAbout}
        </h2>
        <p 
          className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          data-tina-field={tinaField(data, "description")}
        >
          <TinaMarkdown content={data.description} />
        </p>
      </div>

      <div className="mb-16">
        <h3 
          className="text-2xl font-semibold text-gray-900 mb-6 text-center"
          data-tina-field={tinaField(data, "purposeTitle")}
        >
          <TinaMarkdown content={data.purposeTitle} />
        </h3>
        <div 
          className="prose prose-lg max-w-4xl mx-auto text-gray-700 leading-relaxed text-center"
          data-tina-field={tinaField(data, "purposeDescription")}
        >
          <TinaMarkdown content={data.purposeDescription} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {(data.columns as AboutUsColumn[])?.map((column, index) => (
          <div key={index} className="text-center">
            <h4 
              className="text-xl font-semibold text-gray-900 mb-4"
              data-tina-field={tinaField(column, "columnTitle")}
            >
              {column.columnTitle}
            </h4>
            <div 
              className="prose prose-gray max-w-none text-gray-600 leading-relaxed"
              data-tina-field={tinaField(column, "description")}
            >
              <TinaMarkdown content={column.description} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const aboutUsBlockSchema: Template = {
  name: "aboutUs",
  label: "Sobre Nós",
  ui: {
    previewSrc: "/blocks/about-us.png",
    defaultItem: {
      titleAbout: "Sobre Nós",
      description: "Conheça nossa história, valores e a paixão que nos move a criar soluções inovadoras para o mercado imobiliário.",
      purposeTitle: "Propósito",
      purposeDescription: {
        type: "root",
        children: [
          {
            type: "p",
            children: [
              {
                type: "text",
                text: "Nosso propósito é "
              },
              {
                type: "text",
                text: "transformar ideias em realidade",
                bold: true
              },
              {
                type: "text",
                text: " através de soluções integradas que "
              },
              {
                type: "text",
                text: "conectam tecnologia, criatividade e expertise técnica",
                italic: true
              },
              {
                type: "text",
                text: " para entregar projetos que superam expectativas e criam valor duradouro para nossos clientes."
              }
            ]
          }
        ]
      },
      columns: [
        {
          columnTitle: "Nossa História",
          description: {
            type: "root",
            children: [
              {
                type: "p",
                children: [
                  {
                    type: "text",
                    text: "Fundada com a visão de "
                  },
                  {
                    type: "text",
                    text: "revolucionar o mercado imobiliário",
                    bold: true
                  },
                  {
                    type: "text",
                    text: ", nossa empresa nasceu da união de profissionais experientes que compartilhavam o mesmo sonho: criar soluções que "
                  },
                  {
                    type: "text",
                    text: "fazem a diferença",
                    italic: true
                  },
                  {
                    type: "text",
                    text: " na vida das pessoas."
                  }
                ]
              }
            ]
          }
        },
        {
          columnTitle: "Nossos Valores",
          description: {
            type: "root",
            children: [
              {
                type: "p",
                children: [
                  {
                    type: "text",
                    text: "Acreditamos na "
                  },
                  {
                    type: "text",
                    text: "excelência",
                    bold: true
                  },
                  {
                    type: "text",
                    text: ", "
                  },
                  {
                    type: "text",
                    text: "transparência",
                    bold: true
                  },
                  {
                    type: "text",
                    text: " e "
                  },
                  {
                    type: "text",
                    text: "inovação",
                    bold: true
                  },
                  {
                    type: "text",
                    text: ". Cada projeto é tratado com "
                  },
                  {
                    type: "text",
                    text: "dedicação única",
                    italic: true
                  },
                  {
                    type: "text",
                    text: ", garantindo resultados que superam as expectativas dos nossos clientes."
                  }
                ]
              }
            ]
          }
        },
        {
          columnTitle: "Nossa Visão",
          description: {
            type: "root",
            children: [
              {
                type: "p",
                children: [
                  {
                    type: "text",
                    text: "Ser reconhecida como a "
                  },
                  {
                    type: "text",
                    text: "empresa líder",
                    bold: true
                  },
                  {
                    type: "text",
                    text: " em soluções integradas para o mercado imobiliário, sempre "
                  },
                  {
                    type: "text",
                    text: "inovando e criando valor",
                    italic: true
                  },
                  {
                    type: "text",
                    text: " para nossos clientes, colaboradores e sociedade."
                  }
                ]
              }
            ]
          }
        }
      ]
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Título Principal",
      name: "titleAbout",
      required: true,
    },
    {
      type: "string",
      label: "Descrição",
      name: "description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      label: "Título do Propósito",
      name: "purposeTitle",
      required: true,
    },
    {
      type: "rich-text",
      label: "Descrição do Propósito",
      name: "purposeDescription",
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
      label: "Colunas (máximo 3)",
      name: "columns",
      ui: {
        max: 3,
        defaultItem: {
          columnTitle: "Nova Seção",
          description: {
            type: "root",
            children: [
              {
                type: "p",
                children: [
                  {
                    type: "text",
                    text: "Adicione seu conteúdo aqui com formatação em "
                  },
                  {
                    type: "text",
                    text: "negrito",
                    bold: true
                  },
                  {
                    type: "text",
                    text: " ou "
                  },
                  {
                    type: "text",
                    text: "itálico",
                    italic: true
                  },
                  {
                    type: "text",
                    text: "."
                  }
                ]
              }
            ]
          }
        },
        itemProps: (item) => ({
          label: item.columnTitle || "Coluna"
        })
      },
      fields: [
        {
          type: "string",
          label: "Título da Seção",
          name: "columnTitle",
          required: true,
        },
        {
          type: "rich-text",
          label: "Descrição",
          name: "description",
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
      ],
    },
  ],
}