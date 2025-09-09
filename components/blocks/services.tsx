"use client"

import { useState, useEffect } from "react"
import type { Template } from "tinacms"
import { tinaField } from "tinacms/dist/react"
import { sectionBlockSchemaField } from "../layout/section"

type ProjectType = "arkeng" | "ebim" | "arkane"

type ServiceModalContent = {
  detailedDescription?: string
  features?: string[]
  howItWorksUrl?: string
  howItWorksButtonText?: string
}

type Service = {
  serviceName: string
  modalContent?: ServiceModalContent
}

type SolutionsBlockCompany = {
  id: ProjectType
  name: string
  logo: string
  servicesTitle?: string
  services?: Service[]
}

const ServiceModal = ({
  isOpen,
  onClose,
  companyLogo,
  companyName,
  serviceName,
  modalContent,
}: {
  isOpen: boolean
  onClose: () => void
  companyLogo?: string
  companyName?: string
  serviceName?: string
  modalContent?: ServiceModalContent
}) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      // Small delay to ensure DOM is ready before animation
      const timer = setTimeout(() => {
        setIsAnimating(true)
      }, 10)
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleHowItWorksClick = () => {
    if (modalContent?.howItWorksUrl) {
      window.open(modalContent.howItWorksUrl, "_blank", "noopener,noreferrer")
    }
  }

  if (!shouldRender || !modalContent) return null

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out ${
        isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white shadow-lg rounded-3xl max-w-md w-full mx-4 relative transition-all duration-300 ease-out ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light transition-colors duration-200 z-10"
        >
          ×
        </button>

        <div className="p-8 text-center">
          <div className="mb-6">
            <img
              src={companyLogo || "/api/placeholder/120/60"}
              alt={companyName || "Logo da Empresa"}
              className="h-16 mx-auto object-contain"
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{serviceName}</h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {modalContent?.detailedDescription || "Descrição detalhada do serviço não disponível."}
          </p>

          {modalContent?.features && modalContent.features.length > 0 && (
            <div className="text-left mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Principais Características:</h3>
              <div className="space-y-3">
                {modalContent.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-900 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {modalContent?.howItWorksUrl && (
            <button
              onClick={handleHowItWorksClick}
              className="cursor-pointer w-full bg-white border-2 border-gray-900 text-gray-900 py-3 px-6 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <div className="w-6 h-6 rounded-full border border-gray-900 flex items-center justify-center">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M5 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {modalContent?.howItWorksButtonText ?? "Confira"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const AnimatedServiceButton = ({ 
  service, 
  index, 
  onServiceClick, 
  isVisible,
  delay 
}: { 
  service: Service
  index: number
  onServiceClick: (service: Service) => void
  isVisible: boolean
  delay: number
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShouldAnimate(true)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      setShouldAnimate(false)
    }
  }, [isVisible, delay])

  return (
    <button
      onClick={() => onServiceClick(service)}
      className="relative bg-white rounded-xl px-4 py-3 text-left 
                 w-full sm:w-auto
                 hover:bg-gray-50 group cursor-pointer transition-colors duration-200"
      style={{
        clipPath: shouldAnimate && isVisible 
          ? 'inset(0 0 0 0 round 1rem)' 
          : 'inset(0 0 0 100% round 1rem)',
        transition: `clip-path 600ms cubic-bezier(0.25, 0.1, 0.25, 1.0) ${isVisible ? delay : 0}ms, background-color 200ms ease`,
      }}
      data-tina-field={tinaField(service, "serviceName")}
    >
      {/* Texto ocupa todo espaço do botão e quebra se precisar */}
      <span className="block text-gray-900 font-medium break-words pr-8">
        {service.serviceName}
      </span>

      {/* Ícone fixo no canto superior direito */}
      <svg
        className="absolute top-3 right-3 w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M7.5 15L12.5 10L7.5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export const SolutionsBlock = ({ data }: { data: any }) => {
  const [activeCompany, setActiveCompany] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [servicesVisible, setServicesVisible] = useState(false)

  const currentCompany: SolutionsBlockCompany | undefined = data.companies?.[activeCompany]

  useEffect(() => {
    setServicesVisible(false)
    const timer = setTimeout(() => {
      setServicesVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [activeCompany])

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
    setModalOpen(true)
  }

  const handleCompanyChange = (index: number) => {
    if (index !== activeCompany) {
      setServicesVisible(false)
      setTimeout(() => {
        setActiveCompany(index)
      }, 200)
    }
  }

  return (
    <>
      <div
        className="mx-auto"
        style={{
          borderRadius: "1.25rem",
          background: "#000",
          display: "flex",
          width: "100%",
          maxWidth: "78.125rem",
          padding: "2.5rem 2.8125rem",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="text-center space-y-4">
            <h2 className="text-white text-3xl font-bold" data-tina-field={tinaField(data, "mainTitle")}>
              {data.mainTitle}
            </h2>
            <p className="text-white text-lg opacity-80" data-tina-field={tinaField(data, "description")}>
              {data.description}
            </p>
          </div>
          <div className="w-full">
            {/* Desktop: 3 images side by side */}
            <div className="hidden md:flex gap-0">
              {(data.images as { image?: string, alt?: string }[])?.slice(0, 3).map((img, index) => (
                <div
                  key={index}
                  style={{ width: "24.125rem", height: "19.1875rem" }}
                  className="overflow-hidden"
                  data-tina-field={tinaField(data, "images")}
                >
                  <img
                    src={img.image || "/api/placeholder/386/307"}
                    alt={img.alt || `Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: index === 0 ? "8px 0 0 8px" : index === 2 ? "0 8px 8px 0" : "0" }}
                  />
                </div>
              ))}
            </div>

            {/* Mobile: Horizontal scroll with snap */}
            <div className="md:hidden w-full overflow-x-auto">
              <div className="flex gap-4 pb-4 snap-x snap-mandatory snap-center scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {(data.images as { image?: string, alt?: string }[])?.map((img, index) => (
                  <div
                    key={index}
                    className="flex-none w-80 h-64 overflow-hidden rounded-lg snap-center"
                    data-tina-field={tinaField(data, "images")}
                  >
                    <img
                      src={img.image || "/api/placeholder/320/256"}
                      alt={img.alt || `Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
          </div>
        </div>

        <div className="flex w-full gap-12 flex-wrap">
          <div className="prose lg:prose-xl flex-1 space-y-6 max-w-[30rem]">
            <h3
              className="text-white font-medium leading-normal uppercase font-inter"
              data-tina-field={tinaField(data, "companiesTitle")}
            >
              {data.companiesTitle}
            </h3>
            <div className="flex flex-row gap-4">
              {(data.companies as any[])?.map((company: any, index: number) => (
                <button
                  key={company.id || index}
                  onClick={() => handleCompanyChange(index)}
                  className="cursor-pointer p-4 rounded-lg transition-all duration-300"
                  data-tina-field={tinaField(company, "logo")}
                >
                  <img
                    src={company.logo || "/api/placeholder/120/60"}
                    alt={company.name || `Empresa ${index + 1}`}
                    className={`w-full h-28 object-contain transition-all duration-300 ${
                      activeCompany === index ? "grayscale-0 opacity-100" : "grayscale opacity-50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4 text-right">
            {currentCompany && (
              <>
              {
                currentCompany.servicesTitle ?

                <h4
                className="text-white text-lg font-medium"
                data-tina-field={tinaField(currentCompany, "servicesTitle")}
                >
                  {currentCompany.servicesTitle}
                </h4>
                  : null
                }

                <div className="flex flex-col items-end space-y-3">
                  {currentCompany.services?.slice().reverse().map((service, index) => {
                    // Calculate delay based on reversed index (bottom to top)
                    const delay = index * 100
                    return (
                      <AnimatedServiceButton
                        key={`${activeCompany}-${service.serviceName}-${index}`}
                        service={service}
                        index={index}
                        onServiceClick={handleServiceClick}
                        isVisible={servicesVisible}
                        delay={delay}
                      />
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        companyLogo={currentCompany?.logo}
        companyName={currentCompany?.name}
        serviceName={selectedService?.serviceName}
        modalContent={selectedService?.modalContent}
      />
    </>
  )
}

export const solutionsBlockSchema: Template = {
  name: "solutions",
  label: "Soluções Personalizadas",
  ui: {
    previewSrc: "/blocks/solutions.png",
    defaultItem: {
      mainTitle: "Soluções Inovadoras",
      description: "Oferecemos soluções completas e personalizadas para o mercado imobiliário",
      companiesTitle: "Soluções personalizadas para suas necessidades imobiliárias",
      images: [
        { image: "/api/placeholder/386/307", alt: "Imagem 1" },
        { image: "/api/placeholder/386/307", alt: "Imagem 2" },
        { image: "/api/placeholder/386/307", alt: "Imagem 3" },
      ],
      companies: [
        {
          id: "arkeng",
          name: "ARKENG",
          logo: "/api/placeholder/120/60",
          servicesTitle: "Serviços de Engenharia",
          services: [
            {
              serviceName: "Projetos Estruturais",
              modalContent: {
                detailedDescription:
                  "Desenvolvemos projetos estruturais completos com foco na segurança e otimização de recursos.",
                features: ["Análise estrutural avançada", "Cálculo de fundações", "Projetos de concreto armado"],
                howItWorksUrl: "https://exemplo.com/projetos-estruturais",
                howItWorksButtonText: "Saiba Mais",
              },
            },
            {
              serviceName: "Consultoria Técnica",
              modalContent: {
                detailedDescription:
                  "Consultoria especializada para tomada de decisões técnicas em projetos de engenharia.",
                features: ["Análise de viabilidade técnica", "Pareceres especializados", "Auditoria de projetos"],
                howItWorksUrl: "https://exemplo.com/consultoria-tecnica",
              },
            },
          ],
        },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    { type: "string", label: "Título Principal", name: "mainTitle", required: true },
    { type: "string", label: "Descrição", name: "description", ui: { component: "textarea" } },
    {
      type: "object",
      list: true,
      label: "Imagens (máximo 3)",
      name: "images",
      ui: { max: 3, itemProps: (item) => ({ label: item.alt || "Imagem" }) },
      fields: [
        { type: "image", label: "Imagem", name: "image", required: true },
        { type: "string", label: "Texto Alternativo", name: "alt" },
      ],
    },
    { type: "string", label: "Título da Seção de Empresas", name: "companiesTitle", required: true },
    {
      type: "object",
      list: true,
      label: "Empresas",
      name: "companies",
      ui: {
        max: 3,
        defaultItem: {
          id: "arkeng",
          name: "Nova Empresa",
          servicesTitle: "Nossos Serviços",
          services: [{ serviceName: "Novo Serviço", modalContent: {} }],
        },
        itemProps: (item) => ({ label: item.name || "Empresa" }),
      },
      fields: [
        {
          type: "string",
          label: "Empresa",
          name: "id",
          required: true,
          ui: {
            component: "select",
          },
          options: ["arkeng", "ebim", "arkane"],
        },
        { type: "string", label: "Nome da Empresa", name: "name", required: true },
        { type: "image", label: "Logo da Empresa", name: "logo", required: true },
        { type: "string", label: "Título da Seção de Serviços", name: "servicesTitle", required: false },
        {
          type: "object",
          list: true,
          label: "Serviços",
          name: "services",
          ui: {
            defaultItem: {
              serviceName: "Novo Serviço",
              modalContent: { detailedDescription: "Descrição detalhada...", features: ["Recurso 1"] },
            },
            itemProps: (item) => ({ label: item.serviceName || "Serviço" }),
          },
          fields: [
            { type: "string", label: "Nome do Serviço", name: "serviceName", required: true },
            {
              type: "object",
              label: "Conteúdo do Modal",
              name: "modalContent",
              fields: [
                {
                  type: "string",
                  label: "Descrição Detalhada",
                  name: "detailedDescription",
                  ui: { component: "textarea" },
                },
                {
                  type: "string",
                  list: true,
                  label: "Lista de Recursos/Características",
                  name: "features",
                  ui: { defaultItem: "Novo Recurso" },
                },
                {
                  type: "string",
                  label: "URL do Botão",
                  name: "howItWorksUrl",
                  description: "Link que será aberto ao clicar no botão do modal",
                },
                {
                  type: "string",
                  label: "Texto do Botão",
                  name: "howItWorksButtonText",
                  description: "Texto personalizado para o botão",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}