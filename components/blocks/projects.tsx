import React, { useState } from 'react';
import type { Template } from 'tinacms';
import { PageBlocksProjects, PageBlocksProjectsProjects } from '../../tina/__generated__/types';
import { Section } from '../layout/section';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { tinaField } from 'tinacms/dist/react';
import { sectionBlockSchemaField } from '../layout/section';
import { MapPin, Ruler, Building, Home, Car, Users, X } from 'lucide-react';

type ProjectType = 'ARKENG' | 'ebim' | 'ARKANE';

export const Projects = ({ data }: { data: PageBlocksProjects }) => {
  const [activeTab, setActiveTab] = useState<ProjectType>('ARKENG');
  const [selectedProject, setSelectedProject] = useState<PageBlocksProjectsProjects | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredProjects = data.projects?.filter((project) => project?.services?.some((service) => service?.company === activeTab)) || [];

  const openProjectSidebar = (project: PageBlocksProjectsProjects) => {
    setSelectedProject(project);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedProject(null);
  };

  return (
    <Section background={data.background!}>
      <div className='flex flex-row justify-between'>
        {/* Title */}
        <h2 className='text-title text-3xl font-semibold' data-tina-field={tinaField(data, 'title')}>
          {data.title}
        </h2>
        {/* <p className='text-body mt-6' data-tina-field={tinaField(data, 'description')}>
          {data.description}
        </p> */}

      {/* Tabs */}
      <div className='flex justify-center '>
        <div className='flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1'>
          {(['ARKENG', 'ebim', 'ARKANE'] as ProjectType[]).map((tab) => (
            <Button key={tab} variant={activeTab === tab ? 'default' : 'ghost'} onClick={() => setActiveTab(tab)} className='px-6 py-2'>
              {tab}
            </Button>
          ))}
        </div>
      </div>
      </div>

      {/* Projects Grid */}
      <div className='mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {filteredProjects.map((project, index) => (
          <ProjectCard key={index} project={project!} activeTab={activeTab} onProjectClick={() => openProjectSidebar(project!)} />
        ))}
      </div>

      {/* Sidebar */}
      {sidebarOpen && selectedProject && <ProjectSidebar project={selectedProject} activeTab={activeTab} onClose={closeSidebar} />}
    </Section>
  );
};

const ProjectCard = ({
  project,
  activeTab,
  onProjectClick,
}: {
  project: PageBlocksProjectsProjects;
  activeTab: ProjectType;
  onProjectClick: () => void;
}) => {
  const images = project.images || [];
  const mainImage = images.find((img) => img?.isMain) || images[0];

  return (
    <Card
      className='overflow-hidden grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer max-w-[17.6rem] max-h-[25.6rem]'
      onClick={onProjectClick}
    >
      {images.length > 0 && (
        <div className='relative'>
          <img
            src={mainImage?.image || images[0]?.image || ''}
            alt={project.constructorName || 'Projeto'}
            className='object-cover h-full'
            data-tina-field={tinaField(project, 'images')}
          />
        </div>
      )}
    </Card>
  );
};

const ProjectSidebar = ({
  project,
  activeTab,
  onClose,
}: {
  project: PageBlocksProjectsProjects;
  activeTab: ProjectType;
  onClose: () => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = project.images || [];
  const activeServices = project.services?.filter((service) => service?.company === activeTab) || [];

  return (
    <>
      {/* Overlay */}
      <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={onClose} />

      {/* Sidebar */}
      <div className='fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-2xl font-semibold' data-tina-field={tinaField(project, 'constructorName')}>
            {project.constructorName}
          </h2>
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='w-5 h-5' />
          </Button>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className='space-y-4'>
              <img
                src={images[currentImageIndex]?.image || ''}
                alt={project.constructorName || 'Projeto'}
                className='w-full h-48 object-cover rounded-lg'
                data-tina-field={tinaField(project, 'images')}
              />

              {images.length > 1 && (
                <div className='flex space-x-2 overflow-x-auto pb-2'>
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img?.image || ''}
                      alt={`${project.constructorName} - ${index + 1}`}
                      className={`w-16 h-16 object-cover rounded-md cursor-pointer flex-shrink-0 ${
                        index === currentImageIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div>
              <h3 className='text-lg font-semibold mb-3'>Descrição</h3>
              <p className='text-gray-600 dark:text-gray-400' data-tina-field={tinaField(project, 'description')}>
                {project.description}
              </p>
            </div>
          )}

          {/* Project Details */}
          <div>
            <h3 className='text-lg font-semibold mb-3'>Detalhes do Projeto</h3>
            <div className='grid grid-cols-1 gap-3 text-sm'>
              {project.location && (
                <div className='flex items-center space-x-3'>
                  <MapPin className='w-5 h-5 text-gray-500' />
                  <span data-tina-field={tinaField(project, 'location')}>
                    <strong>Localização:</strong> {project.location}
                  </span>
                </div>
              )}
              {project.landArea && (
                <div className='flex items-center space-x-3'>
                  <Ruler className='w-5 h-5 text-gray-500' />
                  <span>
                    <strong>Terreno:</strong> {project.landArea}m²
                  </span>
                </div>
              )}
              {project.builtArea && (
                <div className='flex items-center space-x-3'>
                  <Ruler className='w-5 h-5 text-gray-500' />
                  <span>
                    <strong>Área Construída:</strong> {project.builtArea}m²
                  </span>
                </div>
              )}
              {project.height && (
                <div className='flex items-center space-x-3'>
                  <Building className='w-5 h-5 text-gray-500' />
                  <span>
                    <strong>Altura:</strong> {project.height}
                  </span>
                </div>
              )}
              {project.pavilions && (
                <div className='flex items-center space-x-3'>
                  <Building className='w-5 h-5 text-gray-500' />
                  <span>
                    <strong>Pavilhões:</strong> {project.pavilions}
                  </span>
                </div>
              )}
              {project.residentialUnits && (
                <div className='flex items-center space-x-3'>
                  <Home className='w-5 h-5 text-gray-500' />
                  <span>
                    <strong>Unidades Residenciais:</strong> {project.residentialUnits}
                  </span>
                </div>
              )}
              {project.commercialUnits && (
                <div className='flex items-center space-x-3'>
                  <Building className='w-5 h-5 text-gray-500' />
                  <span>
                    <strong>Unidades Comerciais:</strong> {project.commercialUnits}
                  </span>
                </div>
              )}
              {project.parkingSpaces && (
                <div className='flex items-center space-x-3'>
                  <Car className='w-5 h-5 text-gray-500' />
                  <span>
                    <strong>Vagas de Garagem:</strong> {project.parkingSpaces}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Services for Active Tab */}
          {activeServices.length > 0 && (
            <div>
              <h3 className='text-lg font-semibold mb-3'>Serviços {activeTab}</h3>
              <div className='space-y-4'>
                {activeServices.map((service, serviceIndex) => (
                  <div key={serviceIndex} className='space-y-2'>
                    {service?.serviceItems?.map((item, itemIndex) => (
                      <div key={itemIndex} className='flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                        {item?.icon && <span className='text-xl'>{item.icon}</span>}
                        <span className='flex-1' data-tina-field={tinaField(item, 'text')}>
                          {item?.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const projectsBlockSchema: Template = {
  name: 'projects',
  label: 'Projetos',
  ui: {
    previewSrc: '/blocks/projects.png',
    defaultItem: {
      title: 'Nossos Projetos',
      description: 'Conheça alguns dos projetos desenvolvidos pelas nossas empresas',
      projects: [
        {
          constructorName: 'Exemplo Construtora',
          description: 'Projeto residencial moderno',
          services: [
            {
              company: 'ARKENG',
              serviceItems: [
                {
                  icon: '🏗️',
                  text: 'Estrutura de Concreto',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Título',
      name: 'title',
    },
    {
      type: 'string',
      label: 'Descrição',
      name: 'description',
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'object',
      list: true,
      label: 'Projetos',
      name: 'projects',
      ui: {
        defaultItem: {
          constructorName: 'Nova Construtora',
          services: [],
        },
        itemProps: (item) => {
          return {
            label: item.constructorName || 'Projeto sem nome',
          };
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Nome da Construtora',
          name: 'constructorName',
          required: true,
        },
        {
          type: 'object',
          list: true,
          label: 'Imagens',
          name: 'images',
          fields: [
            {
              type: 'image',
              label: 'Imagem',
              name: 'image',
            },
            {
              type: 'boolean',
              label: 'Imagem Principal',
              name: 'isMain',
            },
          ],
        },
        {
          type: 'string',
          label: 'Descrição',
          name: 'description',
          ui: {
            component: 'textarea',
          },
        },
        {
          type: 'string',
          label: 'Área do Terreno (m²)',
          name: 'landArea',
        },
        {
          type: 'string',
          label: 'Altura',
          name: 'height',
        },
        {
          type: 'string',
          label: 'Localização',
          name: 'location',
        },
        {
          type: 'string',
          label: 'Pavilhões',
          name: 'pavilions',
        },
        {
          type: 'string',
          label: 'Área Construída (m²)',
          name: 'builtArea',
        },
        {
          type: 'string',
          label: 'Unid. Residenciais',
          name: 'residentialUnits',
        },
        {
          type: 'string',
          label: 'Unid. Comerciais',
          name: 'commercialUnits',
        },
        {
          type: 'string',
          label: 'Vagas de Garagem',
          name: 'parkingSpaces',
        },
        {
          type: 'object',
          list: true,
          label: 'Serviços',
          name: 'services',
          ui: {
            max: 3,
          },
          fields: [
            {
              component: 'select',
              type: 'string',
              label: 'Empresa',
              description: 'Selecione uma empresa para descrever os serviços fornecidos',
              name: 'company',
              options: ['ARKENG', 'ebim', 'ARKANE'],
              required: false,
            },
            {
              type: 'object',
              list: true,
              label: 'Itens de Serviço',
              name: 'serviceItems',
              fields: [
                {
                  type: 'string',
                  label: 'Ícone (emoji ou texto)',
                  name: 'icon',
                },
                {
                  type: 'string',
                  label: 'Texto',
                  name: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
