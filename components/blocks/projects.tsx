"use client"

import { useState } from "react"
import type { Template } from "tinacms"
import type { PageBlocksProjects, PageBlocksProjectsProjects } from "../../tina/__generated__/types"
import { Section } from "../layout/section"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { tinaField } from "tinacms/dist/react"
import { sectionBlockSchemaField } from "../layout/section"
import { MapPin, Ruler, Building, Home, Car, X, ChevronLeft, ChevronRight } from "lucide-react"
import { transform } from "next/dist/build/swc/generated-native"

type ProjectType = "ARKENG" | "ebim" | "ARKANE"

export const Projects = ({ data }: { data: PageBlocksProjects }) => {
  const [ activeTab, setActiveTab ] = useState<ProjectType>("ARKENG")
  const [ selectedProject, setSelectedProject ] = useState<PageBlocksProjectsProjects | null>(null)
  const [ sidebarOpen, setSidebarOpen ] = useState(false)

  const filteredProjects =
    data.projects?.filter((project) => project?.services?.some((service) => service?.company === activeTab)) || []

  const openProjectSidebar = (project: PageBlocksProjectsProjects) => {
    setSelectedProject(project)
    setSidebarOpen(true)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedProject(null)
  }

  return (
    <Section background={data.background!} className="px-[2.75rem]">
      <div className="flex flex-row justify-between">
        <h2 className="text-title text-3xl font-semibold" data-tina-field={tinaField(data, "title")}>
          {data.title}
        </h2>
        <div className="flex justify-center">
          <div className="flex p-1 gap-2">
            {([ "ARKENG", "ebim", "ARKANE" ] as ProjectType[]).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-4xl ${activeTab === tab ? "bg-black" : "bg-gray-200"
                  }`}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12 px-[2.75rem] gap-[0.625rem] sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={index}
            project={project!}
            activeTab={activeTab}
            onProjectClick={() => openProjectSidebar(project!)}
          />
        ))}
      </div>
      {sidebarOpen && selectedProject && (
        <ProjectSidebar project={selectedProject} activeTab={activeTab} onClose={closeSidebar} />
      )}
    </Section>
  )
}

const ProjectCard = ({
  project,
  activeTab,
  onProjectClick,
}: {
  project: PageBlocksProjectsProjects
  activeTab: ProjectType
  onProjectClick: () => void
}) => {
  const images = project.images || []
  const mainImage = images.find((img) => img?.setAsMain) || images[ 0 ]

  return (
    <Card
      className="overflow-hidden grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer min-w-[18.625rem] max-w-[24.5rem] mb-[0.625rem] break-inside-avoid"
      onClick={onProjectClick}
    >
      {images.length > 0 && (
        <div className="relative w-full">
          <img
            src={mainImage?.image || images[ 0 ]?.image || ""}
            alt={project.constructorName || "Projeto"}
            className="object-cover w-full max-h-[26.75rem]"
            data-tina-field={tinaField(project, "images")}
          />
        </div>
      )}
    </Card>
  )
}

const ProjectSidebar = ({
  project,
  activeTab,
  onClose,
}: {
  project: PageBlocksProjectsProjects
  activeTab: ProjectType
  onClose: () => void
}) => {
  const [ currentPage, setCurrentPage ] = useState(0)
  const [ isFullscreen, setIsFullscreen ] = useState(false)
  const [ fullscreenImageIndex, setFullscreenImageIndex ] = useState(0)
  const images = project.images || []
  const activeServices = project.services?.filter((service) => service?.company === activeTab) || []

  const imagesPerPage = 5 // <-1 large + 4 small
  const totalPages = Math.ceil(images.length / imagesPerPage)
  const startIndex = currentPage * imagesPerPage
  const currentPageImages = images.slice(startIndex, startIndex + imagesPerPage)
  const mainImage = currentPageImages[ 0 ]
  const thumbnailImages = currentPageImages.slice(1, 5)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const openFullscreen = (imageIndex: number) => {
    setFullscreenImageIndex(imageIndex)
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  const nextFullscreenImage = () => {
    setFullscreenImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevFullscreenImage = () => {
    setFullscreenImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToFullscreenImage = (index: number) => {
    setFullscreenImageIndex(index)
  }

  return (
    <>
      {/* Overlay clicável transparente */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Bottom Sidebar */}
<div className="shadow-xl fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1920px] min-w-[995px] h-[75vh] bg-white/95 dark:bg-gray-900/95 z-50 overflow-y-auto rounded-t-2xl backdrop-blur-md shadow-lg [box-shadow:0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)]">        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex flex-col align-left">
            <h2 className="text-2xl font-semibold leading-none" data-tina-field={tinaField(project, "constructorName")}>
              {project.constructorName}
            </h2>
            {/* Descrição */}
            {project.description && (
              <p className="text-lg leading-tight" data-tina-field={tinaField(project, "description")}>
                {project.description}
              </p>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {images.length > 0 && (
            <div className="space-y-4">
              {!isFullscreen ? (
                <>
                  {/* Normal Gallery View */}
                  <div className="flex gap-[0.625rem] h-[290px] overflow-hidden">
                    {/* Large main image - sempre 50% */}
                    <div className="w-1/2 relative overflow-hidden rounded-lg group">
                      <img
                        key={`main-${currentPage}`}
                        src={mainImage?.image || ""}
                        alt={project.constructorName || "Projeto"}
                        className="w-full h-full object-cover transition-all duration-500 ease-in-out transform"
                        style={{
                          animation: 'fadeInSlide 0.5s ease-in-out'
                        }}
                        data-tina-field={tinaField(project, "images")}
                      />
                      {/* Zoom icon for main image */}
                      <button
                        onClick={() => openFullscreen(startIndex)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 rounded-full p-1 backdrop-blur-sm"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.5016 19.1218L21 21.6218M20 15.1218C20 12.0843 17.5376 9.62183 14.5 9.62183C11.4624 9.62183 9 12.0843 9 15.1218C9 18.1594 11.4624 20.6218 14.5 20.6218C17.5376 20.6218 20 18.1594 20 15.1218Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14.5 13.1216V17.1216M16.5 15.1216H12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10 3.62183H14M3 10.6218V14.6218M6.5 21.6218C4.567 21.6218 3 20.0548 3 18.1218M17.5 3.62183C19.433 3.62183 21 5.18883 21 7.12183M3 7.12183C3 5.18883 4.567 3.62183 6.5 3.62183" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    {/* 4 small thumbnail images - os outros 50% */}
                    <div className="w-1/2 grid grid-cols-2 gap-[0.625rem] relative max-h-[290px]">
                      {thumbnailImages.map((img, index) => (
                        <div
                          key={`thumb-${currentPage}-${index}`}
                          className="w-full h-[140px] relative overflow-hidden rounded-lg group"
                        >
                          <img
                            src={img?.image || ""}
                            alt={`${project.constructorName} - ${index + 2}`}
                            className="w-full h-full object-cover transition-all duration-500 ease-in-out transform"
                            style={{
                              animation: `fadeInSlide 0.5s ease-in-out ${index * 0.1}s both`
                            }}
                          />
                          {/* Zoom icon for thumbnail images */}
                          <button
                            onClick={() => openFullscreen(startIndex + index + 1)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 rounded-full p-1 backdrop-blur-sm"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.5016 19.1218L21 21.6218M20 15.1218C20 12.0843 17.5376 9.62183 14.5 9.62183C11.4624 9.62183 9 12.0843 9 15.1218C9 18.1594 11.4624 20.6218 14.5 20.6218C17.5376 20.6218 20 18.1594 20 15.1218Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M14.5 13.1216V17.1216M16.5 15.1216H12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M10 3.62183H14M3 10.6218V14.6218M6.5 21.6218C4.567 21.6218 3 20.0548 3 18.1218M17.5 3.62183C19.433 3.62183 21 5.18883 21 7.12183M3 7.12183C3 5.18883 4.567 3.62183 6.5 3.62183" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {/* Navigation arrows on the last thumbnail */}
                      {totalPages > 1 && thumbnailImages.length > 0 && (
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          <button
                            onClick={prevPage}
                            className="transition-all duration-200 hover:scale-110"
                          >
                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <foreignObject x="-8.3" y="-8.3" width="51.6" height="51.6">
                                <div style={{ backdropFilter: 'blur(4.15px)', clipPath: 'url(#bgblur_left_clip_path)', height: '100%', width: '100%' }}></div>
                              </foreignObject>
                              <circle data-figma-bg-blur-radius="8.3" cx="17.5" cy="17.5" r="17.5" fill="white" fillOpacity="0.32" />
                              <path d="M20 11C20 11 14 15.4189 14 17C14 18.5812 20 23 20 23" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <defs>
                                <clipPath id="bgblur_left_clip_path" transform="translate(8.3 8.3)">
                                  <circle cx="17.5" cy="17.5" r="17.5" />
                                </clipPath>
                              </defs>
                            </svg>
                          </button>
                          <button
                            onClick={nextPage}
                            className="transition-all duration-200 hover:scale-110"
                          >
                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
                              <foreignObject x="-8.3" y="-8.3" width="51.6" height="51.6">
                                <div style={{ backdropFilter: 'blur(4.15px)', clipPath: 'url(#bgblur_right_clip_path)', height: '100%', width: '100%' }}></div>
                              </foreignObject>
                              <circle data-figma-bg-blur-radius="8.3" cx="17.5" cy="17.5" r="17.5" fill="white" fillOpacity="0.32" />
                              <path d="M20 11C20 11 14 15.4189 14 17C14 18.5812 20 23 20 23" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <defs>
                                <clipPath id="bgblur_right_clip_path" transform="translate(8.3 8.3)">
                                  <circle cx="17.5" cy="17.5" r="17.5" />
                                </clipPath>
                              </defs>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Carousel dots */}
                  {totalPages > 1 && (
                    <div
                      className="flex justify-center gap-[10px] mx-auto"
                      style={{
                        marginBlock: '1rem',
                        width: '100%'
                      }}
                    >
                      {Array.from({ length: totalPages }, (_, index) => {
                        const isActive = index === currentPage
                        const dotWidth = Math.min(187, Math.max(50, (800 - (totalPages - 1) * 10) / totalPages))

                        return (
                          <svg
                            key={index}
                            width={dotWidth}
                            height="6"
                            viewBox={`0 0 ${dotWidth} 6`}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105"
                            onClick={() => setCurrentPage(index)}
                            style={{
                              flex: '1 1 0',
                              maxWidth: '187px',
                              minWidth: '50px'
                            }}
                          >
                            <path
                              d={`M3 3H${dotWidth - 3}`}
                              stroke={isActive ? "#000" : "rgba(0, 0, 0, 0.10)"}
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray={isActive ? `${dotWidth - 6}` : "none"}
                              strokeDashoffset={isActive ? "0" : "none"}
                              style={{
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                animation: isActive ? 'dotFill 0.6s ease-out' : 'none'
                              }}
                            />
                          </svg>
                        )
                      })}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Fullscreen Image View - agora ocupa todo o espaço do sidebar */}
                  <div className="relative h-[calc(75vh-200px)] flex flex-col">
                    {/* Navigation arrows */}
                    <button
                      onClick={prevFullscreenImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-200 hover:scale-110"
                    >
                      <svg
                        width="35"
                        height="35"
                        viewBox="0 0 35 35"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <foreignObject x="-8.3" y="-8.3" width="51.6" height="51.6">
                          <div
                            style={{
                              backdropFilter: "blur(4.15px)",
                              clipPath: "url(#bgblur_0_162_4937_clip_path)",
                              height: "100%",
                              width: "100%",
                            }}
                          />
                        </foreignObject>
                        <circle
                          cx="17.5"
                          cy="17.5"
                          r="17.5"
                          fill="white"
                          fillOpacity="0.7"
                        />
                        <path
                          d="M20 11C20 11 14 15.4189 14 17C14 18.5812 20 23 20 23"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <defs>
                          <clipPath id="bgblur_0_162_4937_clip_path" transform="translate(8.3 8.3)">
                            <circle cx="17.5" cy="17.5" r="17.5" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>

                    <button
                      onClick={nextFullscreenImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-180 z-10 transition-all duration-200 hover:scale-110"
                    >
                      <svg
                        width="35"
                        height="35"
                        viewBox="0 0 35 35"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <foreignObject x="-8.3" y="-8.3" width="51.6" height="51.6">
                          <div
                            style={{
                              backdropFilter: "blur(4.15px)",
                              clipPath: "url(#bgblur_0_162_4937_clip_path_right)",
                              height: "100%",
                              width: "100%",
                            }}
                          />
                        </foreignObject>
                        <circle
                          cx="17.5"
                          cy="17.5"
                          r="17.5"
                          fill="white"
                          fillOpacity="0.7"
                        />
                        <path
                          d="M20 11C20 11 14 15.4189 14 17C14 18.5812 20 23 20 23"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <defs>
                          <clipPath id="bgblur_0_162_4937_clip_path_right" transform="translate(8.3 8.3)">
                            <circle cx="17.5" cy="17.5" r="17.5" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>

                    {/* Main fullscreen image */}
                    <div className="flex-1 flex items-center justify-center p-4 pb-6">
                      <div className="relative inline-block">
                        <img
                          key={`fullscreen-${fullscreenImageIndex}`}
                          src={images[ fullscreenImageIndex ]?.image || ""}
                          alt={`${project.constructorName} - ${fullscreenImageIndex + 1}`}
                          className="max-w-full max-h-full object-contain transition-all duration-500 ease-in-out rounded-lg"
                          style={{
                            animation: 'fadeInSlide 0.5s ease-in-out'
                          }}
                        />
                        {/* Close fullscreen button */}
                        <button
                          onClick={closeFullscreen}
                          className="absolute top-2 right-2 z-10 transition-all duration-200 hover:scale-110 rounded-full p-1 backdrop-blur-sm"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.5016 18.5L21 21M20 14.5C20 11.4624 17.5376 9 14.5 9C11.4624 9 9 11.4624 9 14.5C9 17.5376 11.4624 20 14.5 20C17.5376 20 20 17.5376 20 14.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16.5 14.5H12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 3H14M3 10V14M6.5 21C4.567 21 3 19.433 3 17.5M17.5 3C19.433 3 21 4.567 21 6.5M3 6.5C3 4.567 4.567 3 6.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Fullscreen dots */}
                    <div
                      className="flex items-center justify-center gap-[10px] mx-auto"
                      style={{
                        width: 'calc(100% - 4rem)',
                        maxWidth: '800px'
                      }}
                    >
                      {images.map((_, index) => {
                        const isActive = index === fullscreenImageIndex
                        const dotWidth = Math.min(187, Math.max(50, (800 - (images.length - 1) * 10) / images.length))

                        return (
                          <svg
                            key={index}
                            width={dotWidth}
                            height="6"
                            viewBox={`0 0 ${dotWidth} 6`}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105"
                            onClick={() => goToFullscreenImage(index)}
                            style={{
                              flex: '1 1 0',
                              maxWidth: '187px',
                              minWidth: '50px'
                            }}
                          >
                            <path
                              d={`M3 3H${dotWidth - 3}`}
                              stroke={isActive ? "#000" : "rgba(0, 0, 0, 0.3)"}
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray={isActive ? `${dotWidth - 6}` : "none"}
                              strokeDashoffset={isActive ? "0" : "none"}
                              style={{
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                animation: isActive ? 'dotFill 0.6s ease-out' : 'none'
                              }}
                            />
                          </svg>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Detalhes do Projeto - só mostra quando não está em fullscreen */}
          {!isFullscreen && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4">Detalhes do Projeto</h3>
                {/* Grid 4 colunas para os detalhes - responsivo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Primeira coluna */}
                  <div className="space-y-4">
                    {project.landArea && (
                      <div className="flex items-center space-x-3">
                        <Ruler className="w-5 h-5 text-gray-500" />
                        <div className="flex flex-col">
                          <span className="text-xs text-black font-normal capitalize">área do terreno:</span>
                          <span className="text-base text-black font-bold capitalize">{project.landArea} M²</span>
                        </div>
                      </div>
                    )}
                    {project.location && (
                      <div className="flex items-center space-x-3" data-tina-field={tinaField(project, "location")}>
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div className="flex flex-col">
                          <span className="text-xs text-black font-normal capitalize">localização:</span>
                          <span className="text-base text-black font-bold capitalize">{project.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Segunda coluna */}
                  <div className="space-y-4">
                    {project.height && (
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-gray-500" />
                        <div className="flex flex-col">
                          <span className="text-xs text-black font-normal capitalize">altura:</span>
                          <span className="text-base text-black font-bold capitalize">{project.height}</span>
                        </div>
                      </div>
                    )}
                    {project.pavilions && (
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-gray-500" />
                        <div className="flex flex-col">
                          <span className="text-xs text-black font-normal capitalize">pavimentos:</span>
                          <span className="text-base text-black font-bold capitalize">{project.pavilions}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Terceira coluna */}
                  <div className="space-y-4">
                    {project.builtArea && (
                      <div className="flex items-center space-x-3">
                        <Ruler className="w-5 h-5 text-gray-500" />
                        <div className="flex flex-col">
                          <span className="text-xs text-black font-normal capitalize">área construída:</span>
                          <span className="text-base text-black font-bold capitalize">{project.builtArea} M²</span>
                        </div>
                      </div>
                    )}
                    {project.residentialUnits && (
                      <div className="flex items-center space-x-3">
                        <Home className="w-5 h-5 text-gray-500" />
                        <div className="flex flex-col">
                          <span className="text-xs text-black font-normal capitalize">unid. residenciais:</span>
                          <span className="text-base text-black font-bold capitalize">{project.residentialUnits}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Quarta coluna */}
                  <div className="space-y-4">
                    {project.commercialUnits && (
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-gray-500" />
                        <div className="flex flex-col">
                          <span className="text-xs text-black font-normal capitalize">unid. comerciais:</span>
                          <span className="text-base text-black font-bold capitalize">{project.commercialUnits}</span>
                        </div>
                      </div>
                    )}
                    {project.parkingSpaces && (
                      <div className="flex items-center space-x-3">
                        <Car className="w-5 h-5 text-gray-500" />
                        <div className="flex flex-col">
                          <span className="text-xs text-black font-normal capitalize">vagas de garagem:</span>
                          <span className="text-base text-black font-bold capitalize">{project.parkingSpaces}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Serviços - 3 colunas */}
              {project.services && project.services.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Serviços</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {["ARKENG", "ebim", "ARKANE"].map((companyName) => {
                      const companyServices = project.services?.filter(service => service?.company === companyName) || []
                      
                      // Só renderiza a coluna se tiver serviços
                      if (companyServices.length === 0) return null
                      
                      return (
                        <div key={companyName} className="space-y-3">
                          <h4 className="font-medium text-base">{companyName}</h4>
                          <div className="space-y-2">
                            {companyServices.map((service, serviceIndex) => (
                              <div key={serviceIndex}>
                                {service?.serviceItems?.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex items-start space-x-2 text-sm">
                                    {item?.icon && <span className="text-base mt-0.5">{item.icon}</span>}
                                    <span className="flex-1" data-tina-field={tinaField(item, "text")}>
                                      {item?.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }).filter(Boolean)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Estilos CSS */}
      <style jsx>{`
        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes dotFill {
          0% {
            stroke-dashoffset: 100%;
          }
          100% {
            stroke-dashoffset: 0%;
          }
        }
      `}</style>
    </>
  )
}

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
                  icon: "",
                  text: "Estrutura de Concreto",
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
      type: "string",
      label: "Título",
      name: "title",
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
      type: "object",
      list: true,
      label: "Projetos",
      name: "projects",
      ui: {
        defaultItem: {
          constructorName: "Nova Construtora",
          services: [],
        },
        itemProps: (item) => {
          return {
            label: item.constructorName || "Projeto sem nome",
          }
        },
      },
      fields: [
        {
          type: "string",
          label: "Nome da Construtora",
          name: "constructorName",
          required: true,
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
              name: "image",
            },
            {
              type: "boolean",
              label: "Imagem Principal",
              name: "setAsMain",
            },
          ],
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
          label: "Área do Terreno (m²)",
          name: "landArea",
        },
        {
          type: "string",
          label: "Altura",
          name: "height",
        },
        {
          type: "string",
          label: "Localização",
          name: "location",
        },
        {
          type: "string",
          label: "Pavilhões",
          name: "pavilions",
        },
        {
          type: "string",
          label: "Área Construída (m²)",
          name: "builtArea",
        },
        {
          type: "string",
          label: "Unid. Residenciais",
          name: "residentialUnits",
        },
        {
          type: "string",
          label: "Unid. Comerciais",
          name: "commercialUnits",
        },
        {
          type: "string",
          label: "Vagas de Garagem",
          name: "parkingSpaces",
        },
        {
          type: "object",
          list: true,
          label: "Serviços",
          name: "services",
          ui: {
            max: 3,
          },
          fields: [
            {
              component: "select",
              type: "string",
              label: "Empresa",
              description: "Selecione uma empresa para descrever os serviços fornecidos",
              name: "company",
              options: [ "ARKENG", "ebim", "ARKANE" ].map((company) => ({ label: company, value: company })),
              required: false,
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
                  name: "icon",
                },
                {
                  type: "string",
                  label: "Texto",
                  name: "text",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}