'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyMotion, domAnimation } from 'motion/react';
import * as HugeIcons from '@hugeicons/core-free-icons';
import * as m from 'motion/react-m';

import type { Template } from 'tinacms';
import type { PageBlocksProjects, PageBlocksProjectsProjects } from '../../tina/__generated__/types';
import { Section } from '../layout/section';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { tinaField } from 'tinacms/dist/react';
import { sectionBlockSchemaField } from '../layout/section';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { AllProjects, cardVariants, corporationsLogos, iconMap, ProjectType, scrollContainerVariants } from '../layout/projects';

interface ProjectDetail {
  key: string;
  value: string;
  label: string;
  icon?: string;
}

interface ProjectSidebarProps {
  project: PageBlocksProjectsProjects;
  activeTab: AllProjects;
  onClose: () => void;
}

interface ProjectCardProps {
  project: PageBlocksProjectsProjects;
  activeTab: AllProjects;
  onProjectClick: () => void;
  onImageLoad: () => void;
  isVisible: boolean;
  hasEnteredViewport: boolean;
}

export const Projects = ({ data }: { data: PageBlocksProjects }) => {
  const [activeFilters, setActiveFilters] = useState<Set<ProjectType>>(new Set());
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isHoverDevice, setIsHoverDevice] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const loadedImagesCount = useRef(0)
  const totalImagesCount = useRef(0)
  const [cardsEnteredViewport, setCardsEnteredViewport] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  const activeKey = useMemo(() => {
    const arr = Array.from(activeFilters);
    return arr.length === 0 ? 'ALL' : arr.join(',');
  }, [activeFilters]);

  const dataHash = useMemo(() => {
    return JSON.stringify(data?.projects?.map(p => ({
      name: p?.constructorName,
      images: p?.images?.length,
      services: p?.services?.length
    })))
  }, [data.projects])

  const filteredProjects = useMemo(() => {
    if (!data.projects) return [];
    if (activeFilters.size === 0) {
      return data.projects;
    }

    // Filter projects that have ALL selected companies
    return data.projects.filter((project) => {
      if (!project?.services) return false;

      const projectCompanies = new Set(
        project.services
          .map(service => service?.company)
          .filter(Boolean) as ProjectType[]
      );

      // Check if project has ALL selected companies
      return Array.from(activeFilters).every(company =>
        projectCompanies.has(company)
      );
    });
  }, [data.projects, activeFilters, dataHash])

  useEffect(() => {
    setImagesLoaded(false)
    loadedImagesCount.current = 0
    totalImagesCount.current = filteredProjects.length
    setTimeout(() => {
      const cards = scrollContainerRef.current?.querySelectorAll("[data-card-index]")
      if (cards) {
        const newVisibleCards = new Set<number>()
        cards.forEach((card, index) => {
          const cardRect = card.getBoundingClientRect()
          const isVisible = cardRect.top < window.innerHeight && cardRect.bottom > 0
          if (isVisible) {
            newVisibleCards.add(index)
          }
        })
        setVisibleCards(newVisibleCards)
      }
    }, 100)
  }, [dataHash, activeKey])

  const activeTabForProps: AllProjects = useMemo(() => {
    if (activeFilters.size === 1) {
      return Array.from(activeFilters)[0] as AllProjects;
    }
    return "ALL";
  }, [activeFilters]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsHoverDevice(window.matchMedia('(hover: hover)').matches)
      setIsMobile(window.innerWidth < 768);

      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [])

  useEffect(() => {
    const options = {
      root: null,
      threshold: 0.1,
    };
    const observer = new IntersectionObserver((entries) => {
      setVisibleCards((prev) => {
        const newSet = new Set(prev);
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-card-index') || '0', 10);
          if (entry.isIntersecting) {
            newSet.add(index);
            if (isMobile) {
              setCardsEnteredViewport(prevEntered => {
                const newEntered = new Set(prevEntered);
                newEntered.add(index);
                return newEntered;
              });
            }
          } else {
            newSet.delete(index);
          }
        });
        return newSet;
      });
    }, options);

    const cards = scrollContainerRef.current?.querySelectorAll('[data-card-index]');
    cards?.forEach((card) => observer.observe(card));

    return () => {
      cards?.forEach((card) => observer.unobserve(card));
    };
  }, [filteredProjects, isMobile]);

  useEffect(() => {
    let lastScrollY = 0
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY > lastScrollY ? "down" : "up"
      if (direction !== scrollDirection) {
        setScrollDirection(direction)
      }
      lastScrollY = currentScrollY
    }
    const handleScroll = () => {
      updateScrollDirection()
      setIsScrolling(true)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      const newTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
      setScrollTimeout(newTimeout)
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        const cards = container.querySelectorAll("[data-card-index]")
        const newVisibleCards = new Set<number>()
        cards.forEach((card, index) => {
          const cardRect = card.getBoundingClientRect()
          const isVisible = cardRect.top < window.innerHeight && cardRect.bottom > 0
          if (isVisible) {
            newVisibleCards.add(index)
          }
        })
        setVisibleCards(newVisibleCards)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [scrollDirection])

  const hoverAnimation = useMemo(() => {
    return isHoverDevice ? {
      scale: 1.01,
      y: -4,
      transition: { duration: 0.1 },
    } : {}
  }, [isHoverDevice])

  useEffect(() => {
    setImagesLoaded(false)
    loadedImagesCount.current = 0
    totalImagesCount.current = filteredProjects.length
    setCardsEnteredViewport(new Set());

    setTimeout(() => {
      const cards = scrollContainerRef.current?.querySelectorAll("[data-card-index]")
      if (cards) {
        const newVisibleCards = new Set<number>()
        cards.forEach((card, index) => {
          const cardRect = card.getBoundingClientRect()
          const isVisible = cardRect.top < window.innerHeight && cardRect.bottom > 0
          if (isVisible) {
            newVisibleCards.add(index)
          }
        })
        setVisibleCards(newVisibleCards)
      }
    }, 50)
  }, [data.projects, activeKey, filteredProjects.length])

  const openProjectSidebar = (originalIndex: number) => {
    if (!isScrolling) {
      setSelectedProjectIndex(originalIndex)
      setSidebarOpen(true)
    }
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedProjectIndex(null)
  }

  const updateFirstItemsInColumns = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const items = Array.from(container.querySelectorAll<HTMLElement>('.masonry-item'));
    items.forEach(it => it.classList.remove('first-in-target'));
    if (items.length === 0) return;
    requestAnimationFrame(() => {
      const columnsMap = new Map<number, HTMLElement[]>();
      const TOLERANCE = 12;
      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const left = Math.round(rect.left);
        let foundKey: number | undefined;
        for (const key of columnsMap.keys()) {
          if (Math.abs(key - left) <= TOLERANCE) {
            foundKey = key;
            break;
          }
        }
        const mapKey = foundKey ?? left;
        const arr = columnsMap.get(mapKey) ?? [];
        arr.push(item);
        columnsMap.set(mapKey, arr);
      });
      const columns = Array.from(columnsMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([_, arr]) => arr);
      columns.forEach((colItems, colIndex) => {
        colItems.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
        const first = colItems[0];
        if (first && (colIndex === 0 || colIndex === 2)) {
          first.classList.add('first-in-target');
        }
      });
    });
  }, []);

  const handleImageLoad = useCallback(async () => {
    loadedImagesCount.current += 1;
    if (loadedImagesCount.current >= totalImagesCount.current) {
      setImagesLoaded(true);
      await updateFirstItemsInColumns();
    }
  }, [updateFirstItemsInColumns]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    let debounceTimer: number | null = null;
    const debounce = (fn: () => void, wait = 150) => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(fn, wait);
    }
    const observer = new MutationObserver(() => {
      if (imagesLoaded) {
        debounce(updateFirstItemsInColumns, 200);
      }
    });
    observer.observe(scrollContainerRef.current, {
      childList: true,
      subtree: false
    });
    const handleResize = () => {
      if (imagesLoaded) {
        debounce(updateFirstItemsInColumns, 300);
      }
    };
    window.addEventListener('resize', handleResize);
    if (imagesLoaded) {
      setTimeout(updateFirstItemsInColumns, 100);
    }
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (debounceTimer) window.clearTimeout(debounceTimer);
    }
  }, [activeKey, imagesLoaded, updateFirstItemsInColumns]);

  const toggleFilter = (company: ProjectType) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(company)) {
        next.delete(company);
      } else {
        next.add(company);
      }
      return next;
    });
  };

  useEffect(() => {
    if (selectedProjectIndex !== null) {
      if (!data.projects || !data.projects[selectedProjectIndex]) {
        setSidebarOpen(false)
        setSelectedProjectIndex(null)
      }
    }
  }, [data.projects, selectedProjectIndex])

  return (
    <div ref={containerRef} className="relative select-none">
      <Section
        background={data.background!}
        className="px-[2.75rem] sticky top-0 z-10 bg-white/95 backdrop-blur-sm"
        id="projects-list"
      >
        <LazyMotion features={domAnimation}>
          <m.div
            className="flex flex-row justify-between flex-wrap"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='flex flex-col'>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl text-title font-semibold"
              data-tina-field={tinaField(data, "title")}
            >
              {data.title}
            </h2>
            <span className='opacity-[0.5]' data-tina-field={tinaField(data, "description")}>{data.description}</span>
            </div>
            <div className="flex justify-center">
              <div className="flex p-1 gap-2">
                {(["ARKENG", "eBIM", "ARKANE"] as ProjectType[]).map((tab, index) => (
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <Button
                      variant={activeFilters.has(tab) ? "default" : "ghost"}
                      onClick={() => toggleFilter(tab)}
                      className={`cursor-pointer px-6 py-2 rounded-4xl transition-colors duration-200 ${activeFilters.has(tab) ? "bg-black" : "bg-gray-200"}`}
                    >
                      {tab}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </m.div>
        </LazyMotion>
      </Section>
      <div className="relative bg-white">
        <motion.div
          ref={scrollContainerRef}
          key={activeKey}
          className="masonry-container px-[2.75rem] py-12 gap-[0.625rem] sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-4 min-h-screen"
          variants={scrollContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="sync">
            {filteredProjects.map((project, index) => {
              const originalIndex = data.projects?.findIndex(p => p === project) ?? index;

              return (
                <motion.div
                  key={`${activeKey}-${project?.constructorName ?? index}-${index}`}
                  data-card-index={index}
                  data-original-index={originalIndex}
                  custom={scrollDirection}
                  variants={cardVariants}
                  initial="hidden"
                  animate={visibleCards.has(index) ? "visible" : "hidden"}
                  exit="exit"
                  className="masonry-item break-inside-avoid mb-4"
                  whileHover={hoverAnimation}
                  style={{
                    transformOrigin: scrollDirection === "down" ? "bottom" : "top",
                  }}
                  data-tina-field={tinaField(data, `projects.${originalIndex}` as any)}
                >
                  <ProjectCard
                    key={`${activeKey}-${index}`}
                    project={project!}
                    activeTab={activeTabForProps}
                    onProjectClick={() => openProjectSidebar(originalIndex)}
                    onImageLoad={handleImageLoad}
                    isVisible={visibleCards.has(index)}
                    hasEnteredViewport={cardsEnteredViewport.has(index)}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>
        {sidebarOpen && selectedProjectIndex !== null && data.projects && data.projects[selectedProjectIndex] && (
          <ProjectSidebar project={data.projects[selectedProjectIndex]!} activeTab={activeTabForProps} onClose={closeSidebar} />
        )}
      </AnimatePresence>
    </div>
  )
}

const ProjectCard = ({
  project,
  onProjectClick,
  onImageLoad,
  isVisible = false,
  hasEnteredViewport = false,
}: ProjectCardProps) => {
  const images = project.images || []
  const mainImage = images.find((img) => img?.setAsMain) || images[0]
  const [pressed, setPressed] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const startPosition = useRef<{ x: number; y: number } | null>(null)
  const isDragging = useRef(false)
  const MOVE_THRESHOLD = 10

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleImageLoad = () => {
    if (!imageLoaded) {
      setImageLoaded(true)
      onImageLoad()
    }
  }

  const handlePointerDown: React.PointerEventHandler = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return
    startPosition.current = { x: e.clientX, y: e.clientY }
    isDragging.current = false
    setPressed(true)
  }

  const handlePointerMove: React.PointerEventHandler = (e) => {
    if (!startPosition.current) return
    const deltaX = Math.abs(e.clientX - startPosition.current.x)
    const deltaY = Math.abs(e.clientY - startPosition.current.y)
    if (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD) {
      isDragging.current = true
      setPressed(false)
    }
  }

  const handlePointerUp: React.PointerEventHandler = () => {
    if (!isDragging.current) {
      onProjectClick()
    }
    setPressed(false)
    startPosition.current = null
  }

  const handlePointerLeave: React.PointerEventHandler = () => {
    setPressed(false)
    startPosition.current = null
  }

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onProjectClick()
    }
  }

  const overlayOpacityClass = pressed
    ? "opacity-100"
    : "opacity-0 group-hover:opacity-100"

  return (
    <Card
      tabIndex={0}
      role="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      className={`overflow-hidden shadow-md ${isVisible ? "grayscale-0 sm:grayscale-92" : "grayscale-92 sm:grayscale-92"} hover:grayscale-0 sm:hover:grayscale-0 transition-[filter] duration-500 ease-out cursor-pointer mb-[0.625rem] break-inside-avoid relative group`}
      style={{
        touchAction: "pan-y",
      }}
    >
      <motion.div
        initial={{ filter: isMobile ? 'grayscale(100%)' : 'grayscale(0%)' }}
        animate={{
          filter: isMobile ? (hasEnteredViewport ? 'grayscale(0%)' : 'grayscale(100%)') : 'grayscale(0%)'
        }}
        transition={{
          duration: 0.8,
          delay: hasEnteredViewport ? 0.6 : 0,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {mainImage?.image && (
          <Image
            width={400}
            height={400}
            src={mainImage.image}
            alt={project.constructorName || "Imagem do Projeto"}
            className="object-cover w-full h-auto pointer-events-none select-none"
            loading="eager"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={handleImageLoad}
            onError={handleImageLoad}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        )}
      </motion.div>
      <svg
        className={`absolute right-2 top-2 ${overlayOpacityClass} z-10 w-8 h-8 transition-opacity duration-300`}
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 0C29.4934 0 38 8.50659 38 19C38 29.4934 29.4934 38 19 38C8.50659 38 0 29.4934 0 19C0 8.50659 8.50659 0 19 0ZM17 12C16.4478 12.0001 16.0001 12.4478 16 13C16.0001 13.5519 16.4472 13.9995 16.999 14H23.5859L11.293 26.293C10.9024 26.6835 10.9024 27.3165 11.293 27.707C11.6835 28.0976 12.3165 28.0976 12.707 27.707L25 15.4141V22.001C25.0005 22.5528 25.4481 22.9999 26 23C26.5522 22.9999 26.9999 22.5522 27 22V13C26.9999 12.4478 26.5522 12.0001 26 12H17Z"
          fill="white"
        />
      </svg>
      <div
        className={`absolute bottom-0 left-0 w-full
          bg-gradient-to-t from-black/60 to-transparent
          backdrop-blur-xs
          flex items-end p-3
          transition-opacity duration-300
          ${overlayOpacityClass}`}
      >
        <h3 className="text-white font-normal text-2xl">
          {project.constructorName ?? ""}
        </h3>
      </div>
    </Card>
  )
}

const getIcon = (iconKey?: string) =>
  iconKey && iconMap[iconKey as keyof typeof iconMap]
    ? iconMap[iconKey as keyof typeof iconMap]
    : HugeIcons.RulerFreeIcons;

const renderIcon = (iconObj?: { icon?: string; customImage?: string } | string, size = 18, props: any = {}) => {
  if (!iconObj) return null;

  if (typeof iconObj === 'string') {
    const hugeIcon = getIcon(iconObj);
    return <HugeiconsIcon icon={hugeIcon} size={size} {...props} />;
  }

  if (iconObj.customImage) {
    return (
      <Image
        src={iconObj.customImage}
        width={size}
        height={size}
        alt="icon"
        data-tina-field={tinaField(iconObj as any, 'customImage')}
        className="object-contain select-none"
        {...props}
      />
    );
  }

  const huge = getIcon(iconObj.icon);
  return <HugeiconsIcon icon={huge} size={size} {...props} />;
};

const DotNavigation = React.memo(({ total, activeIndex, onClick, maxWidth = 800 }: {
  total: number;
  activeIndex: number;
  onClick: (index: number) => void;
  maxWidth?: number
}) => {
  const dotWidth = useMemo(
    () => Math.min(187, Math.max(50, (maxWidth - (total - 1) * 10) / total)),
    [maxWidth, total]
  );

  return (
    <div
      className="flex justify-center gap-[10px] mx-auto"
      style={{
        width: `min(calc(100% - 4rem), ${maxWidth}px)`,
        marginBlock: '1rem'
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <svg
          key={index}
          style={{
            width: `${dotWidth}px`,
            height: '6px',
            flex: '0 0 auto'
          }}
          viewBox={`0 0 ${dotWidth} 6`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105"
          onClick={() => onClick(index)}
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
});

const ProjectSidebar = ({ project, activeTab, onClose }: ProjectSidebarProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  const [currentMobileImageIndex, setCurrentMobileImageIndex] = useState(0);
  const images = project.images || [];
  const imagesPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(images.length / imagesPerPage));
  const startIndex = currentPage * imagesPerPage;
  const currentPageImages = useMemo(() => images.slice(startIndex, startIndex + imagesPerPage), [images, startIndex]);
  const hasOnlyOneImage = currentPageImages.length === 1;
  const mainImage = currentPageImages[0];
  const thumbnailImages = useMemo(() => currentPageImages.slice(1, 5), [currentPageImages]);

  const projectDetails = [
    { key: 'landArea', label: 'área do terreno', value: project.landArea?.value, iconObj: project.landArea },
    { key: 'location', label: 'localização', value: project.location?.value, iconObj: project.location },
    { key: 'height', label: 'altura', value: project.height?.value, iconObj: project.height },
    { key: 'pavilions', label: 'pavimentos', value: project.pavilions?.value, iconObj: project.pavilions },
    { key: 'builtArea', label: 'área construída', value: project.builtArea?.value, iconObj: project.builtArea },
    { key: 'residentialUnits', label: 'unid. residenciais', value: project.residentialUnits?.value, iconObj: project.residentialUnits },
    { key: 'commercialUnits', label: 'unid. comerciais', value: project.commercialUnits?.value, iconObj: project.commercialUnits },
    { key: 'parkingSpaces', label: 'vagas de garagem', value: project.parkingSpaces?.value, iconObj: project.parkingSpaces },
  ].filter((detail) => detail.value);

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  const nextMobileImage = () => setCurrentMobileImageIndex((prev) => (prev + 1) % currentPageImages.length);
  const prevMobileImage = () => setCurrentMobileImageIndex((prev) => (prev - 1 + currentPageImages.length) % currentPageImages.length);
  useEffect(() => {
    setCurrentMobileImageIndex(0);
  }, [currentPage]);
  const hasThumbnails = thumbnailImages.length > 0;
  const openFullscreen = (imageIndex: number) => {
    const forgivemefather = document.getElementById("sidebar-content") as HTMLDivElement;
    if (forgivemefather) {
      forgivemefather.style.height = "98dvh";
    }
    setFullscreenImageIndex(imageIndex);
    setIsFullscreen(true);
  };
  const closeFullscreen = () => {
    const forgivemefather = document.getElementById("sidebar-content") as HTMLDivElement;
    if (forgivemefather) {
      forgivemefather.style.height = "75dvh";
    }
    setIsFullscreen(false)
  };
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

  const ProjectDetailItem = ({ detail }: { detail: any }) => (
    <div className="flex items-center space-x-3" data-tina-field={tinaField(project, detail.key as any)}>
      {renderIcon(detail.iconObj, 20, { color: '#6B7280', strokeWidth: 1.5, className: 'text-gray-500' })}
      <div className="flex flex-col">
        <span className="text-xs text-black font-normal text-gray-400">{detail.label}:</span>
        <span className="text-base text-black font-bold">
          {detail.value} {String(detail.key).toLowerCase().includes('area') ? 'M²' : ''}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <div id='sidebar-content' className="shadow-2xl fixed bottom-3 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-[90vw] lg:min-w-[90vw] h-[95vh] bg-white/95 z-50 rounded-2xl backdrop-blur-md z-70 flex flex-col select-none">
        <div className="flex-shrink-0 flex items-center justify-between p-6 pb-4 bg-white/95 backdrop-blur-md rounded-t-2xl">
          <div className="flex flex-col align-left">
            <h2 className="text-2xl font-semibold leading-none" data-tina-field={tinaField(project, 'constructorName')}>
              {project.constructorName}
            </h2>
            <p className="text-lg leading-tight" data-tina-field={tinaField(project, 'description')}>
              {project.description}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className='absolute right-3 top-4 cursor-pointer flex-shrink-0 hover:scale-130 transition-200'>
            <HugeiconsIcon icon={HugeIcons.Cancel01Icon} size={20} color="#6B7280" strokeWidth={1.5} className="text-gray-500" />
          </Button>
        </div>
        <div className={`flex-1 overflow-y-auto project-sidebar-scrollable ${isFullscreen ? 'p-0 overflow-hidden' : ''}`}>
          <div className={`space-y-6 ${isFullscreen ? 'h-full flex flex-col' : 'p-6'}`}>
            {images.length > 0 && (
              <div className="space-y-4 flex-1 flex flex-col">
                {!isFullscreen ? (
                  <>
                    <div className="block md:hidden">
                      <div className="relative h-[290px] overflow-hidden rounded-lg">
                        <div
                          className="relative w-full h-full group"
                        >
                          <img
                            key={`mobile-${currentPage}-${currentMobileImageIndex}`}
                            src={currentPageImages[currentMobileImageIndex]?.image || ''}
                            alt={`${project.constructorName} - ${currentMobileImageIndex + 1}`}
                            className="w-full h-full object-cover select-none transition-all duration-500 ease-in-out transform"
                            style={{ animation: 'fadeInSlide 0.5s ease-in-out' }}
                            data-tina-field={tinaField(project, 'images')}
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                          />
                          <button
                            onClick={() => openFullscreen(startIndex + currentMobileImageIndex)}
                            className="cursor-pointer absolute top-2 right-2 transition-all duration-200 hover:scale-110 rounded-full p-1 backdrop-blur-sm"
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
                          {currentPageImages.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  prevMobileImage();
                                }}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 transition-all duration-200 hover:scale-110 rounded-full p-2 bg-white/30 backdrop-blur-sm"
                              >
                                <HugeiconsIcon icon={HugeIcons.ArrowLeft01Icon} size={20} color="white" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  nextMobileImage();
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-all duration-200 hover:scale-110 rounded-full p-2 bg-white/30 backdrop-blur-sm"
                              >
                                <HugeiconsIcon icon={HugeIcons.ArrowRight01Icon} size={20} color="white" />
                              </button>
                            </>
                          )}
                          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-white text-sm font-medium">
                              {currentMobileImageIndex + 1} / {currentPageImages.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      {currentPageImages.length > 1 && (
                        <DotNavigation
                          total={currentPageImages.length}
                          activeIndex={currentMobileImageIndex}
                          onClick={setCurrentMobileImageIndex}
                          maxWidth={400}
                        />
                      )}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-4">
                          <button
                            onClick={prevPage}
                            className="transition-all duration-200 hover:scale-110 rounded-full p-2 bg-gray-100 hover:bg-gray-200"
                          >
                            <HugeiconsIcon icon={HugeIcons.ArrowLeft01Icon} size={20} color="#374151" />
                          </button>
                          <span className="text-sm text-gray-600">
                            Página {currentPage + 1} de {totalPages}
                          </span>
                          <button
                            onClick={nextPage}
                            className="transition-all duration-200 hover:scale-110 rounded-full p-2 bg-gray-100 hover:bg-gray-200"
                          >
                            <HugeiconsIcon icon={HugeIcons.ArrowRight01Icon} size={20} color="#374151" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="hidden md:block">
                      <div className="flex gap-[0.625rem] h-[290px] overflow-hidden">
                        <div
                          className={`relative overflow-hidden rounded-lg group transition-all duration-300 ${hasOnlyOneImage ? 'w-full' : 'w-1/2'}`}
                        >
                          <img
                            key={`main-${currentPage}`}
                            src={mainImage?.image || ''}
                            alt={project.constructorName || 'Projeto'}
                            className="w-full h-full object-cover select-none transition-all duration-500 ease-in-out transform"
                            style={{ animation: 'fadeInSlide 0.5s ease-in-out' }}
                            data-tina-field={tinaField(project, 'images')}
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                          />
                          <button
                            onClick={() => openFullscreen(startIndex)}
                            className="cursor-pointer absolute top-2 right-2 transition-all duration-200 hover:scale-110 rounded-full p-1 backdrop-blur-sm"
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
                        {hasThumbnails && (
                          <div className="w-1/2 grid grid-cols-2 gap-[0.625rem] relative max-h-[290px]">
                            {thumbnailImages.map((img, index) => (
                              <div
                                key={`thumb-${currentPage}-${index}`}
                                className="w-full h-[140px] relative overflow-hidden rounded-lg group"
                              >
                                <img
                                  src={img?.image || ''}
                                  alt={`${project.constructorName} - ${index + 2}`}
                                  className="w-full h-full object-cover select-none transition-all duration-500 ease-in-out transform"
                                  style={{ animation: `fadeInSlide 0.5s ease-in-out ${index * 0.1}s both` }}
                                  draggable={false}
                                  onContextMenu={(e) => e.preventDefault()}
                                  onDragStart={(e) => e.preventDefault()}
                                />
                                <button
                                  onClick={() => openFullscreen(startIndex + index + 1)}
                                  className="absolute top-2 right-2 cursor-pointer transition-all duration-200 hover:scale-110 rounded-full p-1 backdrop-blur-sm"
                                >
                                  <HugeiconsIcon icon={HugeIcons.ZoomInAreaIcon} color="white" />
                                </button>
                              </div>
                            ))}
                            {totalPages > 1 && thumbnailImages.length > 0 && (
                              <div className="absolute bottom-2 right-2 flex gap-1">
                                <button
                                  onClick={prevPage}
                                  className="transition-all duration-100 hover:scale-105 rounded-full p-1 bg-white/30 backdrop-blur-sm w-[35px] h-[35px] flex-shrink-0 flex items-center justify-center"
                                >
                                  <HugeiconsIcon icon={HugeIcons.ArrowLeft01Icon} color="white" />
                                </button>
                                <button
                                  onClick={nextPage}
                                  className="transition-all duration-100 hover:scale-105 rounded-full p-1 bg-white/30 backdrop-blur-sm w-[35px] h-[35px] flex-shrink-0 flex items-center justify-center"
                                >
                                  <HugeiconsIcon icon={HugeIcons.ArrowRight01Icon} color="white" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {totalPages > 1 && <DotNavigation total={totalPages} activeIndex={currentPage} onClick={setCurrentPage} />}
                    </div>
                  </>
                ) : (
                  <div className="relative flex-1 flex flex-col">
                    <button
                      onClick={prevFullscreenImage}
                      className="absolute top-1/2 left-2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/30 backdrop-blur-sm transition-all duration-100 hover:scale-105"
                      style={{ transform: 'translateY(-50%)' }}
                    >
                      <HugeiconsIcon icon={HugeIcons.ArrowLeft01Icon} size={34} />
                    </button>
                    <button
                      onClick={nextFullscreenImage}
                      className="absolute top-1/2 right-2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/30 backdrop-blur-sm transition-all duration-100 hover:scale-105"
                      style={{ transform: 'translateY(-50%)' }}
                    >
                      <HugeiconsIcon icon={HugeIcons.ArrowRight01Icon} size={34} />
                    </button>
                    <div
                      onClick={closeFullscreen}
                      className="flex-1 flex items-center justify-center p-4 pb-6"
                    >
                      <div className="relative inline-block">
                        <img
                          key={`fullscreen-${fullscreenImageIndex}`}
                          src={images[fullscreenImageIndex]?.image || ""}
                          alt={`${project.constructorName} - ${fullscreenImageIndex + 1}`}
                          className="max-w-full max-h-full select-none object-contain transition-all duration-500 ease-in-out rounded-lg"
                          style={{ animation: "fadeInSlide 0.5s ease-in-out" }}
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                        />
                        <button
                          onClick={closeFullscreen}
                          className="cursor-pointer absolute top-2 right-2 z-10 transition-all duration-200 hover:scale-110 rounded-full p-1 backdrop-blur-sm"
                        >
                        </button>
                      </div>
                    </div>
                    <DotNavigation
                      total={images.length}
                      activeIndex={fullscreenImageIndex}
                      onClick={goToFullscreenImage}
                    />
                  </div>
                )}
              </div>
            )}
            {!isFullscreen && (
              <>
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {projectDetails.map((detail: any) => (
                      <div key={detail.key} className="space-y-4">
                        <ProjectDetailItem detail={detail} />
                      </div>
                    ))}
                  </div>
                </div>
                {project.services && project.services.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 border-t-2 border-gray-200 py-[0.75rem]"
                      data-tina-field={tinaField(project, 'servicesTitle' as any)}
                    >{project.servicesTitle || "Serviços desenvolvidos"}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {uniqueCompanies.map((company) => {
                        const companyServices = project.services?.filter((service) => service?.company === company) || [];
                        if (!company) return null;
                        const logoSrc = corporationsLogos[company] ?? '/uploads/project-logos/AE.svg';
                        return (
                          <div key={company} className="space-y-3">
                            <h4 className="font-medium text-base flex items-center gap-3 mb-4">
                              <Image
                                src={logoSrc}
                                width={38}
                                height={38}
                                alt={`${company} logo`}
                                className="bg-[black] rounded-full object-contain select-none pointer-events-none"
                                draggable={false}
                                onContextMenu={(e) => e.preventDefault()}
                                onDragStart={(e) => e.preventDefault()}
                              />
                              <span>{company}</span>
                            </h4>
                            <div className="space-y-2 ml-2">
                              {companyServices.map((service, serviceIndex) => (
                                <div key={serviceIndex}>
                                  {service?.serviceItems?.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-start space-x-2 text-sm text-gray-400">
                                      {renderIcon(item as any, 18, { color: '#374151' })}                                      <span className="flex-1" data-tina-field={tinaField(item, 'text')}>
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
      project: [
        {
          constructorName: 'Projeto',
          description: 'Projeto moderno',
          servicesTitle: "Serviços desenvolvidos",
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
          constructorName: 'Novo Projeto',
          services: [],
        },
        itemProps: (item) => ({
          label: item.constructorName || 'Projeto sem nome',
        }),
      },
      fields: [
        {
          type: 'string',
          label: 'Nome do Projeto',
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

        // Área do Terreno
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
                  { value: 'custom', label: 'Customizado' },
                ],
              },
            },
            {
              type: 'image',
              label: 'Ícone Customizado (SVG/PNG, 24x24 recomendado)',
              name: 'customImage',
              description: 'Faça upload de um ícone customizado (aparecerá no frontend se presente).',
            },
          ],
        },

        // Altura
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
                  { value: 'custom', label: 'Customizado' },
                ],
              },
            },
            {
              type: 'image',
              label: 'Ícone Customizado (SVG/PNG)',
              name: 'customImage',
              description: 'Faça upload de um ícone customizado (aparecerá no frontend se presente).',
            },
          ],
        },

        // Localização
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
                  { value: 'custom', label: 'Customizado' },
                ],
              },
            },
            {
              type: 'image',
              label: 'Ícone Customizado (SVG/PNG)',
              name: 'customImage',
              description: 'Faça upload de um ícone customizado (aparecerá no frontend se presente).',
            },
          ],
        },

        // Pavilhões
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
                  { value: 'custom', label: 'Customizado' },
                ],
              },
            },
            {
              type: 'image',
              label: 'Ícone Customizado (SVG/PNG)',
              name: 'customImage',
              description: 'Faça upload de um ícone customizado (aparecerá no frontend se presente).',
            },
          ],
        },

        // Área Construída
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
                  { value: 'custom', label: 'Customizado' },
                ],
              },
            },
            {
              type: 'image',
              label: 'Ícone Customizado (SVG/PNG)',
              name: 'customImage',
              description: 'Faça upload de um ícone customizado (aparecerá no frontend se presente).',
            },
          ],
        },

        // Unid. Residenciais
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
                  { value: 'custom', label: 'Customizado' },
                ],
              },
            },
            {
              type: 'image',
              label: 'Ícone Customizado (SVG/PNG)',
              name: 'customImage',
              description: 'Faça upload de um ícone customizado (aparecerá no frontend se presente).',
            },
          ],
        },

        // Unid. Comerciais
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
                  { value: 'custom', label: 'Customizado' },
                ],
              },
            },
            {
              type: 'image',
              label: 'Ícone Customizado (SVG/PNG)',
              name: 'customImage',
              description: 'Faça upload de um ícone customizado (aparecerá no frontend se presente).',
            },
          ],
        },

        // Vagas de Garagem
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
                  { value: 'custom', label: 'Customizado' },
                ],
              },
            },
            {
              type: 'image',
              label: 'Ícone Customizado (SVG/PNG)',
              name: 'customImage',
              description: 'Faça upload de um ícone customizado (aparecerá no frontend se presente).',
            },
          ],
        },

        {
          type: 'string',
          label: 'Serviços desenvolvidos',
          name: 'servicesTitle',
        },
        {
          type: 'object',
          list: true,
          label: 'Serviços',
          name: 'services',
          ui: {
            max: 3,
            itemProps: (item: any) => ({
              label: item?.company ? `${item.company}` : 'Serviço (sem empresa)',
            }),
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
              ui: {
                itemProps: (item: any) => ({
                  label: item?.text ? item.text : 'Item de serviço',
                }),
              },
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
                      { value: 'custom', label: 'Customizado' },
                    ],
                  },
                },
                {
                  type: 'image',
                  label: 'Ícone Customizado (SVG/PNG)',
                  name: 'customImage',
                  description: 'Upload para ícone customizado do item de serviço. Recomendado: https://hugeicons.com/icons?style=Stroke&type=Rounded',
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
