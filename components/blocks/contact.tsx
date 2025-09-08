"use client"
import type { Template } from "tinacms"
import { tinaField } from "tinacms/dist/react"
import { sectionBlockSchemaField } from "../layout/section"

type ContactItem = {
  icon: string
  itemTitle: string
  itemDescription: string
  itemExtraText: string
}

type ContactBlockData = {
  contactTitle: string
  contactSubtitle: string
  backgroundImage: string
  contactItems: ContactItem[]
}

const ICONS = {
  chat: `<svg width="40" height="42" viewBox="0 0 40 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.433165" y="0.729064" width="38.9849" height="40.7175" rx="7.56683" stroke="white" stroke-width="0.86633"/>
<path d="M29.8071 20.9407C29.8071 26.2239 25.3293 30.5074 19.8071 30.5074C19.1578 30.5083 18.5103 30.4482 17.8725 30.3285C17.4135 30.2422 17.1839 30.1991 17.0237 30.2236C16.8634 30.2481 16.6363 30.3688 16.1821 30.6104C14.8973 31.2937 13.3991 31.535 11.9582 31.267C12.5059 30.5934 12.8799 29.7852 13.0449 28.9188C13.1449 28.3888 12.8971 27.874 12.526 27.4971C10.8405 25.7855 9.80713 23.4791 9.80713 20.9407C9.80713 15.6576 14.2849 11.374 19.8071 11.374C25.3293 11.374 29.8071 15.6576 29.8071 20.9407Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M19.8026 21.374H19.8116M23.7981 21.374H23.8071M15.8071 21.374H15.8161" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  location: `<svg width="41" height="42" viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1.41852" y="0.729064" width="38.9849" height="40.7175" rx="7.56683" stroke="white" stroke-width="0.86633"/>
<path d="M23.6039 18.1367C23.6039 19.5174 22.4846 20.6367 21.1039 20.6367C19.7232 20.6367 18.6039 19.5174 18.6039 18.1367C18.6039 16.756 19.7232 15.6367 21.1039 15.6367C22.4846 15.6367 23.6039 16.756 23.6039 18.1367Z" stroke="white" stroke-width="1.5"/>
<path d="M22.3613 26.6303C22.024 26.9551 21.5732 27.1367 21.1041 27.1367C20.6349 27.1367 20.1841 26.9551 19.8468 26.6303C16.7582 23.6375 12.6191 20.2942 14.6376 15.4404C15.729 12.816 18.3488 11.1367 21.1041 11.1367C23.8593 11.1367 26.4791 12.816 27.5705 15.4404C29.5865 20.2881 25.4575 23.6478 22.3613 26.6303Z" stroke="white" stroke-width="1.5"/>
<path d="M27.1039 29.1367C27.1039 30.2413 24.4176 31.1367 21.1039 31.1367C17.7902 31.1367 15.1039 30.2413 15.1039 29.1367" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
  phone: `<svg width="41" height="42" viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1.40375" y="0.729064" width="38.9849" height="40.7175" rx="7.56683" stroke="white" stroke-width="0.86633"/>
<path d="M12.8667 20.7647C11.9187 19.1116 11.461 17.7617 11.185 16.3935C10.7767 14.3698 11.7109 12.3931 13.2585 11.1317C13.9126 10.5986 14.6623 10.7808 15.0491 11.4747L15.9223 13.0412C16.6144 14.2828 16.9605 14.9037 16.8918 15.5619C16.8232 16.2201 16.3565 16.7561 15.4231 17.8283L12.8667 20.7647ZM12.8667 20.7647C14.7856 24.1106 17.797 27.1236 21.1467 29.0447M21.1467 29.0447C22.7998 29.9927 24.1496 30.4505 25.5179 30.7265C27.5415 31.1347 29.5183 30.2005 30.7796 28.6529C31.3127 27.9989 31.1306 27.2491 30.4367 26.8623L28.8702 25.9891C27.6285 25.297 27.0077 24.951 26.3495 25.0196C25.6913 25.0882 25.1552 25.5549 24.0831 26.4883L21.1467 29.0447Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M23.0891 11.8223V14.6223M28.0393 13.873L26.0594 15.8529M30.0891 18.8223H27.2891" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
  users: `<svg width="41" height="42" viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="1.38898" y="0.729064" width="38.9849" height="40.7175" rx="7.56683" stroke="white" stroke-width="0.86633"/> <path d="M21.0743 16.3223C21.0743 18.2553 19.5073 19.8223 17.5743 19.8223C15.6413 19.8223 14.0743 18.2553 14.0743 16.3223C14.0743 14.3893 15.6413 12.8223 17.5743 12.8223C19.5073 12.8223 21.0743 14.3893 21.0743 16.3223Z" stroke="white" stroke-width="1.5"/> <path d="M22.5743 19.8223C24.5073 19.8223 26.0743 18.2553 26.0743 16.3223C26.0743 14.3893 24.5073 12.8223 22.5743 12.8223" stroke="white" stroke-width="1.5" stroke-linecap="round"/> <path d="M22.2172 28.8223H12.9315C11.9058 28.8223 11.0743 28.0548 11.0743 27.108C11.0743 24.7411 13.153 22.8223 15.7172 22.8223H19.4314C20.4766 22.8223 21.4412 23.1411 22.2172 23.6791" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M28.0743 22.8223V28.8223M31.0743 25.8223H25.0743" stroke="white" stroke-width="1.5" stroke-linecap="round"/> </svg>`
}

export const ContactBlock = ({ data }: { data: ContactBlockData }) => {
  const getIconSvg = (iconType: string) => {
    return ICONS[ iconType as keyof typeof ICONS ] || ICONS.chat
  }

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }

    if (imagePath.startsWith('/')) {
      return imagePath
    }

    return `/${imagePath}`
  }

  const backgroundImageUrl = getImageUrl(data.backgroundImage)

  const backgroundStyle =
  {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${backgroundImageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }

  return (
    <div
      id="contact"
      className="relative py-16 px-6 min-h-[600px] flex items-center mx-[2.75rem] rounded-xl"
      style={backgroundStyle}
    >
      {!backgroundImageUrl && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2
            className="text-white font-inter text-4xl font-medium leading-normal mb-4"
            data-tina-field={tinaField(data, "contactTitle")}
          >
            {data.contactTitle}
          </h2>
          <p
            className="text-white font-inter text-sm font-medium leading-normal"
            data-tina-field={tinaField(data, "contactSubtitle")}
          >
            {data.contactSubtitle}
          </p>
        </div>

        {/* Contact Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.contactItems?.map((item, index) => (
            <div key={index} className="flex flex-row items-start text-left">
              {/* Icon and Title Row */}
                <div
                  className="mr-4 flex-shrink-0"
                  data-tina-field={tinaField(item, "icon")}
                  dangerouslySetInnerHTML={{
                    __html: getIconSvg(item.icon),
                  }}
                />
                <div>

              <div className="flex items-center mb-3 w-full">
                <h3
                  className="text-white font-inter text-lg font-medium leading-normal"
                  data-tina-field={tinaField(item, "itemTitle")}
                >
                  {item.itemTitle}
                </h3>
              </div>

              {/* Description */}
              <p
                className="text-white font-inter text-base font-medium leading-normal opacity-60 mb-2"
                data-tina-field={tinaField(item, "itemDescription")}
              >
                {item.itemDescription}
              </p>

              {/* Extra Text */}
              <p
                className="text-white font-inter text-base font-medium leading-normal"
                data-tina-field={tinaField(item, "itemExtraText")}
              >
                {item.itemExtraText}
              </p>
                              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const contactBlockSchema: Template = {
  name: "contact",
  label: "Contato",
  ui: {
    previewSrc: "uploads/contato/Rectangle 7.png",
    defaultItem: {
      contactTitle: "Tem alguma dúvida? Entre em contato conosco!",
      contactSubtitle: "Sua opinião é importante para nós! Entre em contato e deixe seu feedback.",
      backgroundImage: "uploads/contato/Rectangle 7.png",
      contactItems: [
        {
          icon: "chat",
          itemTitle: "Chat Online",
          itemDescription: "Converse conosco em tempo real",
          itemExtraText: "Disponível 24/7",
        },
        {
          icon: "location",
          itemTitle: "Endereço",
          itemDescription: "Nos visite em nosso escritório",
          itemExtraText: "Rua das Flores, 123 - Centro",
        },
        {
          icon: "phone",
          itemTitle: "Telefone",
          itemDescription: "Ligue para nós",
          itemExtraText: "(11) 99999-9999",
        },
        {
          icon: "users",
          itemTitle: "Suporte",
          itemDescription: "Nossa equipe está pronta para ajudar",
          itemExtraText: "suporte@empresa.com",
        },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Título Principal",
      name: "contactTitle",
      required: true,
    },
    {
      type: "string",
      label: "Subtítulo",
      name: "contactSubtitle",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "image",
      label: "Imagem de Fundo",
      name: "backgroundImage",
      ui: {
        format(value) {
          return value && !value.startsWith("/") ? `/${value}` : value
        },
        parse(value) {
          return value && value.startsWith("/") ? value.slice(1) : value
        },
      },
    },
    {
      type: "object",
      list: true,
      label: "Itens de Contato (máximo 4)",
      name: "contactItems",
      ui: {
        max: 4,
        defaultItem: {
          icon: "chat",
          itemTitle: "Novo Item",
          itemDescription: "Descrição do item",
          itemExtraText: "Texto adicional",
        },
        itemProps: (item) => ({
          label: item.itemTitle || "Item de Contato",
        }),
      },
      fields: [
        {
          type: "string",
          label: "Ícone",
          name: "icon",
          options: [
            { value: "chat", label: "Chat/Mensagem" },
            { value: "location", label: "Localização" },
            { value: "phone", label: "Telefone" },
            { value: "users", label: "Usuários/Suporte" },
          ],
          required: true,
        },
        {
          type: "string",
          label: "Título do Item",
          name: "itemTitle",
          required: true,
        },
        {
          type: "string",
          label: "Descrição do Item",
          name: "itemDescription",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "string",
          label: "Texto Extra do Item",
          name: "itemExtraText",
          ui: {
            component: "textarea",
          },
        },
      ],
    },
  ],
}