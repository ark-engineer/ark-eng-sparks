import React, { useState } from "react";
import type { Template } from "tinacms";
import { PageBlocksProjects, PageBlocksProjectsProjects } from "../../tina/__generated__/types";
import { Section } from "../layout/section";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { tinaField } from "tinacms/dist/react";
import { sectionBlockSchemaField } from '../layout/section';
import { MapPin, Ruler, Building, Home, Car, Users } from "lucide-react";

type ProjectType = "ARKENG" | "ebim" | "ARKANE";

export const Projects = ({ data }: { data: PageBlocksProjects }) => {
  const [activeTab, setActiveTab] = useState<ProjectType>("ARKENG");

  const filteredProjects = data.projects?.filter(project => 
    project?.services?.some(service => service?.company === activeTab)
  ) || [];

  return (
    <Section background={data.background!}>
      <div className="text-center">
        <h2 className="text-title text-3xl font-semibold" data-tina-field={tinaField(data, 'title')}>
          {data.title}
        </h2>
        <p className="text-body mt-6" data-tina-field={tinaField(data, 'description')}>
          {data.description}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-8">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(["ARKENG", "ebim", "ARKANE"] as ProjectType[]).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              onClick={() => setActiveTab(tab)}
              className="px-6 py-2"
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={index} project={project!} activeTab={activeTab} />
        ))}
      </div>
    </Section>
  );
};

const ProjectCard = ({ project, activeTab }: { 
  project: PageBlocksProjectsProjects; 
  activeTab: ProjectType;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = project.images || [];
  const mainImage = images.find(img => img?.isMain) || images[0];
  
  const activeServices = project.services?.filter(service => service?.company === activeTab) || [];

  return (
    <Card className="overflow-hidden">
      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="relative">
          <img 
            src={mainImage?.image || images[currentImageIndex]?.image || ''} 
            alt={project.constructorName || 'Projeto'}
            className="w-full h-48 object-cover"
            data-tina-field={tinaField(project, 'images')}
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <CardHeader>
        <h3 className="text-xl font-semibold" data-tina-field={tinaField(project, 'constructorName')}>
          {project.constructorName}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {project.landArea && (
            <div className="flex items-center space-x-2">
              <Ruler className="w-4 h-4 text-gray-500" />
              <span>Terreno: {project.landArea}m²</span>
            </div>
          )}
          {project.height && (
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span>Altura: {project.height}</span>
            </div>
          )}
          {project.location && (
            <div className="flex items-center space-x-2 col-span-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span data-tina-field={tinaField(project, 'location')}>{project.location}</span>
            </div>
          )}
          {project.pavilions && (
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span>Pavilhões: {project.pavilions}</span>
            </div>
          )}
          {project.builtArea && (
            <div className="flex items-center space-x-2">
              <Ruler className="w-4 h-4 text-gray-500" />
              <span>Área: {project.builtArea}m²</span>
            </div>
          )}
          {project.residentialUnits && (
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-gray-500" />
              <span>Resid.: {project.residentialUnits}</span>
            </div>
          )}
          {project.commercialUnits && (
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span>Comer.: {project.commercialUnits}</span>
            </div>
          )}
          {project.parkingSpaces && (
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-gray-500" />
              <span>Vagas: {project.parkingSpaces}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400" data-tina-field={tinaField(project, 'description')}>
            {project.description}
          </p>
        )}

        {/* Services for Active Tab */}
        {activeServices.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Serviços {activeTab}:
            </h4>
            <div className="space-y-2">
              {activeServices.map((service, serviceIndex) => (
                <div key={serviceIndex} className="space-y-1">
                  {service?.serviceItems?.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-2 text-sm">
                      {item?.icon && (
                        <span className="text-lg">{item.icon}</span>
                      )}
                      <span data-tina-field={tinaField(item, 'text')}>
                        {item?.text}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const projectsBlockSchema: Template = {
  name: "projects",
  label: "Projetos",
  ui: {
    previewSrc: "/blocks/projects.png",
    defaultItem: {
      title: "Nossos Projetos",
      description: "Conheça alguns dos projetos desenvolvidos pelas nossas empresas",
      projects: [
        {
          constructorName: "Exemplo Construtora",
          description: "Projeto residencial moderno",
          services: [
            {
              company: "ARKENG",
              serviceItems: [
                {
                  icon: "🏗️",
                  text: "Estrutura de Concreto"
                }
              ]
            }
          ]
        }
      ]
    }
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Título",
      name: "title"
    },
    {
      type: "string",
      label: "Descrição",
      name: "description",
      ui: {
        component: "textarea"
      }
    },
    {
      type: "object",
      list: true,
      label: "Projetos",
      name: "projects",
      ui: {
        defaultItem: {
          constructorName: "Nova Construtora",
          services: []
        },
        itemProps: (item) => {
          return {
            label: item.constructorName || "Projeto sem nome"
          };
        }
      },
      fields: [
        {
          type: "string",
          label: "Nome da Construtora",
          name: "constructorName",
          required: true
        },
        {
          type: "object",
          list: true,
          label: "Imagens",
          name: "images",
          fields: [
            {
              type: "image",
              label: "Imagem",
              name: "image"
            },
            {
              type: "boolean",
              label: "Imagem Principal",
              name: "isMain"
            }
          ]
        },
        {
          type: "string",
          label: "Descrição",
          name: "description",
          ui: {
            component: "textarea"
          }
        },
        {
          type: "string",
          label: "Área do Terreno (m²)",
          name: "landArea"
        },
        {
          type: "string",
          label: "Altura",
          name: "height"
        },
        {
          type: "string",
          label: "Localização",
          name: "location"
        },
        {
          type: "string",
          label: "Pavilhões",
          name: "pavilions"
        },
        {
          type: "string",
          label: "Área Construída (m²)",
          name: "builtArea"
        },
        {
          type: "string",
          label: "Unid. Residenciais",
          name: "residentialUnits"
        },
        {
          type: "string",
          label: "Unid. Comerciais",
          name: "commercialUnits"
        },
        {
          type: "string",
          label: "Vagas de Garagem",
          name: "parkingSpaces"
        },
        {
          type: "object",
          list: true,
          label: "Serviços",
          name: "services",
          ui: {
            max: 3
          },
          fields: [
            {
              type: "string",
              label: "Empresa",
              name: "company"
            },
            {
              type: "object",
              list: true,
              label: "Itens de Serviço",
              name: "serviceItems",
              fields: [
                {
                  type: "string",
                  label: "Ícone (emoji ou texto)",
                  name: "icon"
                },
                {
                  type: "string",
                  label: "Texto",
                  name: "text"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};