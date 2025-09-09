'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyMotion, domAnimation } from 'motion/react';
import * as m from 'motion/react-m';

import type { Template } from 'tinacms';
import type { PageBlocksProjects, PageBlocksProjectsProjects } from '../../tina/__generated__/types';
import { Section } from '../layout/section';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { tinaField } from 'tinacms/dist/react';
import { sectionBlockSchemaField } from '../layout/section';
import { HugeiconsIcon } from '@hugeicons/react';
import * as HugeIcons from '@hugeicons/core-free-icons';
import Image from 'next/image';

type ProjectType = 'ARKENG' | 'eBIM' | 'ARKANE';

const corporationsLogos: Record<ProjectType, string> = {
  ARKENG: '/uploads/project-logos/ARKENG.png',
  eBIM: '/uploads/project-logos/eBIM.png',
  ARKANE: '/uploads/project-logos/ARKANE.png',
};

interface ProjectDetail {
  key: string;
  value: string;
  label: string;
  icon?: string;
}

interface ProjectSidebarProps {
  project: PageBlocksProjectsProjects;
  activeTab: ProjectType;
  onClose: () => void;
}
const iconMap = {
  'arrow-expand-02': HugeIcons.ArrowExpand02Icon,
  'maps-square-02': HugeIcons.MapsSquare02Icon,
  'right-angle': HugeIcons.RightAngleIcon,
  'road-02': HugeIcons.Road02Icon,
  'maximize-screen': HugeIcons.MaximizeScreenIcon,
  'home-12': HugeIcons.Home12Icon,
  'store-01': HugeIcons.Store01Icon,
  'parking-area-square': HugeIcons.ParkingAreaSquareIcon,
  'group-layers': HugeIcons.GroupLayersIcon,
  'fire': HugeIcons.FireIcon,
  'snow': HugeIcons.SnowIcon,
  'brush': HugeIcons.BrushIcon,
  'certificate-01': HugeIcons.Certificate01Icon,
  'bathtub-01': HugeIcons.Bathtub01Icon,
  'door-01': HugeIcons.Door01Icon,
  'geometric-shapes-02': HugeIcons.GeometricShapes02Icon,
  'legal-document-01': HugeIcons.LegalDocument01Icon,
  'electric-home-01': HugeIcons.ElectricHome01Icon,
  'beach-02': HugeIcons.Beach02Icon,
  'discount-tag-02': HugeIcons.DiscountTag02Icon,
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

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
    <Section background={data.background!} className='px-[2.75rem]'>
      <LazyMotion features={domAnimation}>
        <m.div
          className='flex flex-row justify-between flex-wrap'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='prose prose-xl text-title font-semibold' data-tina-field={tinaField(data, 'title')}>
            {data.title}
          </h2>
          <div className='flex justify-center'>
            <div className='flex p-1 gap-2'>
              {(['ARKENG', 'eBIM', 'ARKANE'] as ProjectType[]).map((tab, index) => (
                <motion.div key={tab} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 + 0.3 }}>
                  <Button
                    variant={activeTab === tab ? 'default' : 'ghost'}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-4xl transition-colors duration-200 ${activeTab === tab ? 'bg-black' : 'bg-gray-200'}`}
                  >
                    {tab}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </m.div>
      </LazyMotion>

      <AnimatePresence mode='wait'>
        <LazyMotion features={domAnimation}>
          <m.div
            key={activeTab}
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='mt-12 px-[2.75rem] gap-[0.625rem] sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5'
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={`${activeTab}-${index}`} project={project!} activeTab={activeTab} onProjectClick={() => openProjectSidebar(project!)} />
            ))}
          </m.div>
        </LazyMotion>
      </AnimatePresence>

      <AnimatePresence>
        {sidebarOpen && selectedProject && <ProjectSidebar project={selectedProject} activeTab={activeTab} onClose={closeSidebar} />}
      </AnimatePresence>
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
  const mainImage = images.find((img) => img?.setAsMain) || images[0];
  return (
    <Card
      className='overflow-hidden grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer max-w-[24.5rem] mb-[0.625rem] break-inside-avoid relative group'
      onClick={onProjectClick}
    >
      {mainImage?.image && (
        <Image
          width={38}
          height={38}
          src={mainImage.image}
          blurDataURL={mainImage.image}
          alt={project.constructorName || 'Imagem do Projeto'}
          className='object-cover w-full h-full'
          loading='lazy'
          placeholder='blur'
          sizes='(max-width: 768px) 100vw, 38px'
        />
      )}
      <svg
        className='absolute right-2 top-2 opacity-0 group-hover:opacity-100 z-5 w-8 xs:W-6'
        viewBox='0 0 38 38'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M19 0C29.4934 0 38 8.50659 38 19C38 29.4934 29.4934 38 19 38C8.50659 38 0 29.4934 0 19C0 8.50659 8.50659 0 19 0ZM17 12C16.4478 12.0001 16.0001 12.4478 16 13C16.0001 13.5519 16.4472 13.9995 16.999 14H23.5859L11.293 26.293C10.9024 26.6835 10.9024 27.3165 11.293 27.707C11.6835 28.0976 12.3165 28.0976 12.707 27.707L25 15.4141V22.001C25.0005 22.5528 25.4481 22.9999 26 23C26.5522 22.9999 26.9999 22.5522 27 22V13C26.9999 12.4478 26.5522 12.0001 26 12H17Z'
          fill='white'
        />
      </svg>
      <div
        className='
        absolute bottom-0 left-0 w-full
        bg-gradient-to-t from-black/70 to-transparent
        backdrop-blur-sm
        flex items-end p-4
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
      '
      >
        <h3 className='text-white font-normal text-2xl'>{project.constructorName ?? ''}</h3>
      </div>
    </Card>
  );
};

const getIcon = (iconKey?: string) =>
  iconKey && iconMap[iconKey as keyof typeof iconMap]
    ? iconMap[iconKey as keyof typeof iconMap]
    : HugeIcons.RulerFreeIcons;

const ProjectSidebar = ({ project, activeTab, onClose }: ProjectSidebarProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  const images = project.images || [];
  const imagesPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(images.length / imagesPerPage));
  const startIndex = currentPage * imagesPerPage;
  const currentPageImages = useMemo(() => images.slice(startIndex, startIndex + imagesPerPage), [images, startIndex]);
  // Lógica para determinar o layout baseado no número de imagens
  const hasOnlyOneImage = currentPageImages.length === 1;
  const mainImage = currentPageImages[0];
  const thumbnailImages = useMemo(() => currentPageImages.slice(1, 5), [currentPageImages]);

  const projectDetails: ProjectDetail[] = [
    { key: 'landArea', label: 'área do terreno', value: project.landArea?.value, icon: project.landArea?.icon },
    { key: 'location', label: 'localização', value: project.location?.value, icon: project.location?.icon },
    { key: 'height', label: 'altura', value: project.height?.value, icon: project.height?.icon },
    { key: 'pavilions', label: 'pavimentos', value: project.pavilions?.value, icon: project.pavilions?.icon },
    { key: 'builtArea', label: 'área construída', value: project.builtArea?.value, icon: project.builtArea?.icon },
    { key: 'residentialUnits', label: 'unid. residenciais', value: project.residentialUnits?.value, icon: project.residentialUnits?.icon },
    { key: 'commercialUnits', label: 'unid. comerciais', value: project.commercialUnits?.value, icon: project.commercialUnits?.icon },
    { key: 'parkingSpaces', label: 'vagas de garagem', value: project.parkingSpaces?.value, icon: project.parkingSpaces?.icon },
  ].filter((detail) => detail.value);

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  const hasThumbnails = thumbnailImages.length > 0;
  const openFullscreen = (imageIndex: number) => {
    setFullscreenImageIndex(imageIndex);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => setIsFullscreen(false);
  const nextFullscreenImage = () => setFullscreenImageIndex((prev) => (prev + 1) % images.length);
  const prevFullscreenImage = () => setFullscreenImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const goToFullscreenImage = (index: number) => setFullscreenImageIndex(index);

  const uniqueCompanies = useMemo(
    () =>
      Array.from(
        new Set(
          (project.services || [])
            .map((s) => s?.company)
            .filter(Boolean) as ProjectType[]
        )
      ),
    [project.services]
  );

  const DotNavigation = ({ total, activeIndex, onClick, maxWidth = 800 }: {
    total: number;
    activeIndex: number;
    onClick: (index: number) => void;
    maxWidth?: number
  }) => {
    const dotWidth = Math.min(187, Math.max(50, (maxWidth - (total - 1) * 10) / total));
    return (
      <div className="flex justify-center gap-[10px] mx-auto" style={{ width: `calc(100% - 4rem)`, maxWidth: `${maxWidth}px`, marginBlock: '1rem' }}>
        {Array.from({ length: total }).map((_, index) => (
          <svg
            key={index}
            width={dotWidth}
            height="6"
            viewBox={`0 0 ${dotWidth} 6`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105"
            onClick={() => onClick(index)}
            style={{ flex: '1 1 0', maxWidth: '187px', minWidth: '50px' }}
          >
            <path
              d={`M3 3H${dotWidth - 3}`}
              stroke={index === activeIndex ? '#000' : 'rgba(0, 0, 0, 0.3)'}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={index === activeIndex ? `${dotWidth - 6}` : 'none'}
              strokeDashoffset={index === activeIndex ? '0' : 'none'}
              style={{
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: index === activeIndex ? 'dotFill 0.6s ease-out' : 'none'
              }}
            />
          </svg>
        ))}
      </div>
    );
  };

  const ProjectDetailItem = ({ detail }: { detail: ProjectDetail }) => (
    <div className="flex items-center space-x-3" data-tina-field={tinaField(project, detail.key as any)}>
      <HugeiconsIcon icon={getIcon(detail.icon)} size={20} color="#6B7280" strokeWidth={1.5} className="text-gray-500" />
      <div className="flex flex-col">
        <span className="text-xs text-black font-normal capitalize text-gray-400">{detail.label}:</span>
        <span className="text-base text-black font-bold capitalize">
          {detail.value} {detail.key.includes('Area') ? 'M²' : ''}
        </span>
      </div>
    </div>
  );
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="shadow-xl fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1920px] lg:min-w-[995px] h-[75vh] bg-white/95 dark:bg-gray-900/95 z-50 overflow-y-auto rounded-t-2xl backdrop-blur-md shadow-lg [box-shadow:0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex flex-col align-left">
            <h2 className="text-2xl font-semibold leading-none" data-tina-field={tinaField(project, 'constructorName')}>
              {project.constructorName}
            </h2>
            {project.description && (
              <p className="text-lg leading-tight" data-tina-field={tinaField(project, 'description')}>
                {project.description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <HugeiconsIcon icon={HugeIcons.Cancel01Icon} size={20} color="#6B7280" strokeWidth={1.5} className="text-gray-500" />
          </Button>
        </div>
        {/* Content */}
        <div className="p-6 space-y-6">
          {images.length > 0 && (
            <div className="space-y-4">
              {!isFullscreen ? (
                <>
                  {/* Gallery View com Layout Responsivo */}
                  <div className="flex gap-[0.625rem] h-[290px] overflow-hidden">
                    {/* Imagem Principal - 100% se for única, 75% se houver outras */}
                    <div
                      onClick={() => openFullscreen(startIndex)}
                      className={`cursor-pointer relative overflow-hidden rounded-lg group transition-all duration-300 ${hasOnlyOneImage ? 'w-full' : 'w-3/4'
                        }`}
                    >
                      <img
                        key={`main-${currentPage}`}
                        src={mainImage?.image || ''}
                        alt={project.constructorName || 'Projeto'}
                        className="w-full h-full object-cover transition-all duration-500 ease-in-out transform"
                        style={{ animation: 'fadeInSlide 0.5s ease-in-out' }}
                        data-tina-field={tinaField(project, 'images')}
                      />
                      <button
                        onClick={() => openFullscreen(startIndex)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 rounded-full p-1 backdrop-blur-sm"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M18.5016 19.1218L21 21.6218M20 15.1218C20 12.0843 17.5376 9.62183 14.5 9.62183C11.4624 9.62183 9 12.0843 9 15.1218C9 18.1594 11.4624 20.6218 14.5 20.6218C17.5376 20.6218 20 18.1594 20 15.1218Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path d="M14.5 13.1216V17.1216M16.5 15.1216H12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path
                            d="M10 3.62183H14M3 10.6218V14.6218M6.5 21.6218C4.567 21.6218 3 20.0548 3 18.1218M17.5 3.62183C19.433 3.62183 21 5.18883 21 7.12183M3 7.12183C3 5.18883 4.567 3.62183 6.5 3.62183"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    {/* Grid de Thumbnails - só aparece se houver thumbnails */}
                    {hasThumbnails && (
                      <div className="w-1/4 grid grid-cols-2 gap-[0.625rem] relative max-h-[290px]">
                        {thumbnailImages.map((img, index) => (
                          <div
                            onClick={() => openFullscreen(startIndex + index + 1)}
                            key={`thumb-${currentPage}-${index}`}
                            className="cursor-pointer w-full h-[140px] relative overflow-hidden rounded-lg group"
                          >
                            <img
                              src={img?.image || ''}
                              alt={`${project.constructorName} - ${index + 2}`}
                              className="w-full h-full object-cover transition-all duration-500 ease-in-out transform"
                              style={{ animation: `fadeInSlide 0.5s ease-in-out ${index * 0.1}s both` }}
                            />
                            <button
                              onClick={() => openFullscreen(startIndex + index + 1)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 rounded-full p-1 backdrop-blur-sm"
                            >
                              <HugeiconsIcon icon={HugeIcons.ZoomInAreaIcon} color="white" />
                            </button>
                          </div>
                        ))}
                        {/* Controles de navegação de página */}
                        {totalPages > 1 && thumbnailImages.length > 0 && (
                          <div className="absolute bottom-2 right-2 flex gap-1">
                            <button
                              onClick={prevPage}
                              className="transition-all duration-200 hover:scale-110 rounded-full p-1 bg-white/30 backdrop-blur-sm w-[35px] h-[35px] flex-shrink-0 flex items-center justify-center"
                            >
                              <HugeiconsIcon icon={HugeIcons.ArrowLeft01Icon} color="white" />
                            </button>
                            <button
                              onClick={nextPage}
                              className="transition-all duration-200 hover:scale-110 rounded-full p-1 bg-white/30 backdrop-blur-sm w-[35px] h-[35px] flex-shrink-0 flex items-center justify-center"
                            >
                              <HugeiconsIcon icon={HugeIcons.ArrowRight01Icon} color="white" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Dot Navigation para páginas */}
                  {totalPages > 1 && <DotNavigation total={totalPages} activeIndex={currentPage} onClick={setCurrentPage} />}
                </>
              ) : (
                // Fullscreen View
                <div className="relative h-[calc(75vh-200px)] flex flex-col">
                  <button
                    onClick={prevFullscreenImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-200 hover:scale-110 rounded-full bg-white/30 backdrop-blur-sm"
                  >
                    <HugeiconsIcon icon={HugeIcons.ArrowLeft01Icon} size={34} />
                  </button>
                  <button
                    onClick={nextFullscreenImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-180 z-10 transition-all duration-200 hover:scale-110 rounded-full bg-white/30 backdrop-blur-sm"
                  >
                    <HugeiconsIcon icon={HugeIcons.ArrowLeft01Icon} size={34} />
                  </button>
                  <div onClick={closeFullscreen} className="cursor-pointer flex-1 flex items-center justify-center p-4 pb-6">
                    <div className="relative inline-block">
                      <img
                        key={`fullscreen-${fullscreenImageIndex}`}
                        src={images[fullscreenImageIndex]?.image || ''}
                        alt={`${project.constructorName} - ${fullscreenImageIndex + 1}`}
                        className="max-w-full max-h-full object-contain transition-all duration-500 ease-in-out rounded-lg"
                        style={{ animation: 'fadeInSlide 0.5s ease-in-out' }}
                      />
                      <button
                        onClick={closeFullscreen}
                        className="absolute top-2 right-2 z-10 transition-all duration-200 hover:scale-110 rounded-full p-1 backdrop-blur-sm"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M18.5016 18.5L21 21M20 14.5C20 11.4624 17.5376 9 14.5 9C11.4624 9 9 11.4624 9 14.5C9 17.5376 11.4624 20 14.5 20C17.5376 20 20 17.5376 20 14.5Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path d="M16.5 14.5H12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path
                            d="M10 3H14M3 10V14M6.5 21C4.567 21 3 19.433 3 17.5M17.5 3C19.433 3 21 4.567 21 6.5M3 6.5C3 4.567 4.567 3 6.5 3"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <DotNavigation total={images.length} activeIndex={fullscreenImageIndex} onClick={goToFullscreenImage} />
                </div>
              )}
            </div>
          )}
          {!isFullscreen && (
            <>
              {/* Project Details */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {projectDetails.map((detail) => (
                    <div key={detail.key} className="space-y-4">
                      <ProjectDetailItem detail={detail} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Services */}
              {project.services && project.services.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-t-2 border-gray-200 py-[0.75rem]">Serviços</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uniqueCompanies.map((company) => {
                      const companyServices = project.services?.filter((service) => service?.company === company) || [];
                      if (!company) return null;

                      const logoSrc = corporationsLogos[company] ?? '/uploads/project-logos/default.png';

                      return (
                        <div key={company} className="space-y-3">
                          <h4 className="font-medium text-base flex items-center gap-3 mb-4">
                            <Image
                              src={logoSrc}
                              width={38}
                              height={38}
                              alt={`${company} logo`}
                              className="bg-[black] rounded-full object-contain "
                            />
                            <span>{company}</span>
                          </h4>
                          <div className="space-y-2 ml-2">
                            {companyServices.map((service, serviceIndex) => (
                              <div key={serviceIndex}>
                                {service?.serviceItems?.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex items-start space-x-2 text-sm text-gray-400">
                                    {item?.icon && <HugeiconsIcon icon={getIcon(item.icon)} size={18} color="#374151" />}
                                    <span className="flex-1" data-tina-field={tinaField(item, 'text')}>
                                      {item?.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
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
                  icon: '',
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
        itemProps: (item) => ({
          label: item.constructorName || 'Projeto sem nome',
        }),
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
              name: 'setAsMain',
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
          type: 'object',
          label: 'Área do Terreno',
          name: 'landArea',
          fields: [
            {
              type: 'string',
              label: 'Valor (m²)',
              name: 'value',
            },
            {
              type: 'string',
              label: 'Ícone',
              name: 'icon',
              ui: {
                component: 'select',
                options: [
                  { value: '', label: 'Nenhum ícone' },
                  { value: 'arrow-expand-02', label: 'Seta de Expansão' },
                  { value: 'maps-square-02', label: 'Mapa em Grade' },
                  { value: 'right-angle', label: 'Ângulo Reto' },
                  { value: 'road-02', label: 'Estrada' },
                  { value: 'maximize-screen', label: 'Maximizar Tela' },
                  { value: 'home-12', label: 'Casa' },
                  { value: 'store-01', label: 'Loja' },
                  { value: 'parking-area-square', label: 'Área de Estacionamento' },
                ],
              },
            },
          ],
        },
        {
          type: 'object',
          label: 'Altura',
          name: 'height',
          fields: [
            {
              type: 'string',
              label: 'Valor',
              name: 'value',
            },
            {
              type: 'string',
              label: 'Ícone',
              name: 'icon',
              ui: {
                component: 'select',
                options: [
                  { value: '', label: 'Nenhum ícone' },
                  { value: 'arrow-expand-02', label: 'Seta de Expansão' },
                  { value: 'maps-square-02', label: 'Mapa em Grade' },
                  { value: 'right-angle', label: 'Ângulo Reto' },
                  { value: 'road-02', label: 'Estrada' },
                  { value: 'maximize-screen', label: 'Maximizar Tela' },
                  { value: 'home-12', label: 'Casa' },
                  { value: 'store-01', label: 'Loja' },
                  { value: 'parking-area-square', label: 'Área de Estacionamento' },
                ],
              },
            },
          ],
        },
        {
          type: 'object',
          label: 'Localização',
          name: 'location',
          fields: [
            {
              type: 'string',
              label: 'Valor',
              name: 'value',
            },
            {
              type: 'string',
              label: 'Ícone',
              name: 'icon',
              ui: {
                component: 'select',
                options: [
                  { value: '', label: 'Nenhum ícone' },
                  { value: 'arrow-expand-02', label: 'Seta de Expansão' },
                  { value: 'maps-square-02', label: 'Mapa em Grade' },
                  { value: 'right-angle', label: 'Ângulo Reto' },
                  { value: 'road-02', label: 'Estrada' },
                  { value: 'maximize-screen', label: 'Maximizar Tela' },
                  { value: 'home-12', label: 'Casa' },
                  { value: 'store-01', label: 'Loja' },
                  { value: 'parking-area-square', label: 'Área de Estacionamento' },
                ],
              },
            },
          ],
        },
        {
          type: 'object',
          label: 'Pavilhões',
          name: 'pavilions',
          fields: [
            {
              type: 'string',
              label: 'Valor',
              name: 'value',
            },
            {
              type: 'string',
              label: 'Ícone',
              name: 'icon',
              ui: {
                component: 'select',
                options: [
                  { value: '', label: 'Nenhum ícone' },
                  { value: 'arrow-expand-02', label: 'Seta de Expansão' },
                  { value: 'maps-square-02', label: 'Mapa em Grade' },
                  { value: 'right-angle', label: 'Ângulo Reto' },
                  { value: 'road-02', label: 'Estrada' },
                  { value: 'maximize-screen', label: 'Maximizar Tela' },
                  { value: 'home-12', label: 'Casa' },
                  { value: 'store-01', label: 'Loja' },
                  { value: 'parking-area-square', label: 'Área de Estacionamento' },
                ],
              },
            },
          ],
        },
        {
          type: 'object',
          label: 'Área Construída',
          name: 'builtArea',
          fields: [
            {
              type: 'string',
              label: 'Valor (m²)',
              name: 'value',
            },
            {
              type: 'string',
              label: 'Ícone',
              name: 'icon',
              ui: {
                component: 'select',
                options: [
                  { value: '', label: 'Nenhum ícone' },
                  { value: 'arrow-expand-02', label: 'Seta de Expansão' },
                  { value: 'maps-square-02', label: 'Mapa em Grade' },
                  { value: 'right-angle', label: 'Ângulo Reto' },
                  { value: 'road-02', label: 'Estrada' },
                  { value: 'maximize-screen', label: 'Maximizar Tela' },
                  { value: 'home-12', label: 'Casa' },
                  { value: 'store-01', label: 'Loja' },
                  { value: 'parking-area-square', label: 'Área de Estacionamento' },
                ],
              },
            },
          ],
        },
        {
          type: 'object',
          label: 'Unid. Residenciais',
          name: 'residentialUnits',
          fields: [
            {
              type: 'string',
              label: 'Valor',
              name: 'value',
            },
            {
              type: 'string',
              label: 'Ícone',
              name: 'icon',
              ui: {
                component: 'select',
                options: [
                  { value: '', label: 'Nenhum ícone' },
                  { value: 'arrow-expand-02', label: 'Seta de Expansão' },
                  { value: 'maps-square-02', label: 'Mapa em Grade' },
                  { value: 'right-angle', label: 'Ângulo Reto' },
                  { value: 'road-02', label: 'Estrada' },
                  { value: 'maximize-screen', label: 'Maximizar Tela' },
                  { value: 'home-12', label: 'Casa' },
                  { value: 'store-01', label: 'Loja' },
                  { value: 'parking-area-square', label: 'Área de Estacionamento' },
                ],
              },
            },
          ],
        },
        {
          type: 'object',
          label: 'Unid. Comerciais',
          name: 'commercialUnits',
          fields: [
            {
              type: 'string',
              label: 'Valor',
              name: 'value',
            },
            {
              type: 'string',
              label: 'Ícone',
              name: 'icon',
              ui: {
                component: 'select',
                options: [
                  { value: '', label: 'Nenhum ícone' },
                  { value: 'arrow-expand-02', label: 'Seta de Expansão' },
                  { value: 'maps-square-02', label: 'Mapa em Grade' },
                  { value: 'right-angle', label: 'Ângulo Reto' },
                  { value: 'road-02', label: 'Estrada' },
                  { value: 'maximize-screen', label: 'Maximizar Tela' },
                  { value: 'home-12', label: 'Casa' },
                  { value: 'store-01', label: 'Loja' },
                  { value: 'parking-area-square', label: 'Área de Estacionamento' },
                ],
              },
            },
          ],
        },
        {
          type: 'object',
          label: 'Vagas de Garagem',
          name: 'parkingSpaces',
          fields: [
            {
              type: 'string',
              label: 'Valor',
              name: 'value',
            },
            {
              type: 'string',
              label: 'Ícone',
              name: 'icon',
              ui: {
                component: 'select',
                options: [
                  { value: '', label: 'Nenhum ícone' },
                  { value: 'arrow-expand-02', label: 'Seta de Expansão' },
                  { value: 'maps-square-02', label: 'Mapa em Grade' },
                  { value: 'right-angle', label: 'Ângulo Reto' },
                  { value: 'road-02', label: 'Estrada' },
                  { value: 'maximize-screen', label: 'Maximizar Tela' },
                  { value: 'home-12', label: 'Casa' },
                  { value: 'store-01', label: 'Loja' },
                  { value: 'parking-area-square', label: 'Área de Estacionamento' },
                ],
              },
            },
          ],
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
              options: ['ARKENG', 'eBIM', 'ARKANE'].map((company) => ({
                label: company,
                value: company,
              })),
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
                  label: 'Ícone',
                  name: 'icon',
                  ui: {
                    component: 'select',
                    options: [
                      { value: '', label: 'Nenhum ícone' },
                      { value: 'group-layers', label: 'Camadas Agrupadas' },
                      { value: 'fire', label: 'Fogo' },
                      { value: 'snow', label: 'Neve' },
                      { value: 'brush', label: 'Pincel' },
                      { value: 'certificate-01', label: 'Certificado' },
                      { value: 'bathtub-01', label: 'Banheira' },
                      { value: 'door-01', label: 'Porta' },
                      { value: 'geometric-shapes-02', label: 'Formas Geométricas' },
                      { value: 'legal-document-01', label: 'Documento Legal' },
                      { value: 'electric-home-01', label: 'Casa Inteligente' },
                      { value: 'beach-02', label: 'Praia' },
                      { value: 'discount-tag-02', label: 'Etiqueta de Desconto' },
                    ],
                  },
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