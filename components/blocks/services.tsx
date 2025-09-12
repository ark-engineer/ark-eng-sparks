'use client';

import { useState, useEffect, useRef, useCallback, SetStateAction, Dispatch } from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { sectionBlockSchemaField } from '../layout/section';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpRight01Icon, CheckmarkCircle02Icon, PlayCircleIcon } from '@hugeicons/core-free-icons';

type ProjectType = 'arkeng' | 'ebim' | 'arkane';

type ServiceModalContent = {
  detailedDescription?: string;
  features?: string[];
  howItWorksUrl?: string;
  howItWorksButtonText?: string;
};

type Service = {
  serviceName: string;
  modalContent?: ServiceModalContent;
};

type SolutionsBlockCompany = {
  id: ProjectType;
  logo: string;
  servicesTitle?: string;
  services?: Service[];
};

type ModalState = {
  isOpen: boolean;
  service: Service | null;
  company: SolutionsBlockCompany | null;
};

const COMPANY_LABELS: Record<ProjectType, string> = {
  arkeng: 'Arkeng',
  ebim: 'Ebim',
  arkane: 'Arkane'
};

const useAutoRotation = (
  totalItems: number,
  delay: number,
  enabled: boolean,
  activeIndex: number,
  onRotate: Dispatch<SetStateAction<number>>
) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const startRotation = useCallback(() => {
    if (!enabled || totalItems <= 1) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current as ReturnType<typeof setInterval>);
    }

    intervalRef.current = setInterval(() => {
      onRotate((prev) => (prev + 1) % totalItems);
    }, delay);
  }, [enabled, totalItems, delay, onRotate]);

  const stopRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as ReturnType<typeof setInterval>);
      intervalRef.current = null;
    }
  }, []);

  const pauseRotation = useCallback(() => {
    setIsPaused(true);
    stopRotation();
  }, [stopRotation]);

  const resumeRotation = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (enabled && totalItems > 1 && !isPaused) {
      startRotation();
    } else {
      stopRotation();
    }
    return () => stopRotation();
  }, [enabled, totalItems, isPaused, startRotation, stopRotation]);

  return { pauseRotation, resumeRotation, isPaused };
};

const ServiceModal = ({ modalState, onClose }: { modalState: ModalState; onClose: () => void }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (modalState.isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [modalState.isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleHowItWorksClick = useCallback(() => {
    const url = modalState.service?.modalContent?.howItWorksUrl;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }, [modalState.service?.modalContent?.howItWorksUrl]);

  if (!shouldRender || !modalState.service?.modalContent) return null;
  const { service, company } = modalState;
  const companyName = company?.id ? COMPANY_LABELS[company.id] : 'Empresa';

  return (
    <div
      id='custom-services'
      className={`fixed inset-0 flex items-center justify-center z-70 p-4 transition-all duration-300 ease-out ${isAnimating ? 'bg-black bg-opacity-50' : 'bg-opacity-0'
        }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white shadow-lg rounded-3xl max-w-md w-full mx-4 relative transition-all duration-300 ease-out ${isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light transition-colors duration-200 z-10'>
          ×
        </button>

        <div className='p-8 text-center'>
          <div className='mb-6'>
            <img
              src={company?.logo || '/api/placeholder/120/60'}
              alt={`Logo da ${companyName}`}
              className='h-16 mx-auto object-contain bg-black rounded-full'
            />
          </div>

          <h2 className='text-2xl font-semibold text-gray-900 mb-4'>{service?.serviceName}</h2>

          <p className='text-gray-600 mb-8 leading-relaxed'>{service?.modalContent?.detailedDescription || 'Descrição detalhada do serviço não disponível.'}</p>

          {service?.modalContent?.features && service.modalContent.features.length > 0 && (
            <div className='text-left mb-8'>
              <h3 className='font-semibold text-gray-900 mb-4'>Principais Características:</h3>
              <div className='space-y-3'>
                {service.modalContent.features.map((feature, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} />
                    <span className='text-gray-700'>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service?.modalContent?.howItWorksUrl && (
            <button
              onClick={handleHowItWorksClick}
              className='cursor-pointer w-full bg-white border-2 border-gray-900 text-gray-900 py-3 px-6 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2'
            >
              <HugeiconsIcon icon={PlayCircleIcon} />
              {service?.modalContent?.howItWorksButtonText ?? 'Saiba Mais'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AnimatedServiceButton = ({
  service,
  index,
  onServiceClick,
  isVisible,
  delay,
}: {
  service: Service;
  index: number;
  onServiceClick: (service: Service) => void;
  isVisible: boolean;
  delay: number;
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShouldAnimate(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
    }
  }, [isVisible, delay]);

  return (
    <button
      onClick={() => onServiceClick(service)}
      className='cursor-pointer relative bg-white rounded-full px-6 py-3 text-left 
                 w-full sm:w-auto min-w-0
                 hover:bg-gray-50 group transition-colors duration-200
                 overflow-hidden'
      style={{
        clipPath: shouldAnimate && isVisible ? 'inset(0 0 0 0 round 50px)' : 'inset(0 0 0 100% round 50px)',
        transition: `clip-path 600ms cubic-bezier(0.25, 0.1, 0.25, 1.0) ${isVisible ? delay : 0}ms, background-color 200ms ease`,
      }}
      data-tina-field={tinaField(service, 'serviceName')}
    >
      <span className='block text-gray-900 font-medium break-words pr-8'>
        {service.serviceName}<sup>0{index + 1}</sup>
      </span>
      <HugeiconsIcon icon={ArrowUpRight01Icon} className='absolute top-4 right-4 w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors' />
    </button>
  );
};

const CompanySelector = ({
  companies,
  activeIndex,
  onCompanySelect,
}: {
  companies: SolutionsBlockCompany[];
  activeIndex: number;
  onCompanySelect: (index: number) => void;
}) => {
  return (
    <div className='flex flex-row gap-4'>
      {companies.map((company, index) => {
        const companyName = COMPANY_LABELS[company.id];
        return (
          <button
            key={company.id || index}
            onClick={() => onCompanySelect(index)}
            className='cursor-pointer p-4 rounded-lg transition-all duration-300'
            data-tina-field={tinaField(company, 'logo')}
            aria-label={`Selecionar ${companyName}`}
          >
            <img
              src={company.logo || '/api/placeholder/120/60'}
              alt={companyName}
              className={`w-full h-28 object-contain transition-all duration-300 ${activeIndex === index ? 'grayscale-0 opacity-100' : 'grayscale opacity-50'}`}
            />
          </button>
        );
      })}
    </div>
  );
};

const ServicesSection = ({
  company,
  servicesVisible,
  onServiceClick,
}: {
  company: SolutionsBlockCompany;
  servicesVisible: boolean;
  onServiceClick: (service: Service) => void;
}) => {
  if (!company) return null;
  return (
    <div className='flex-1 space-y-4 text-right'>
      {company.servicesTitle && (
        <h4 className='text-white text-lg font-medium' data-tina-field={tinaField(company, 'servicesTitle')}>
          {company.servicesTitle}
        </h4>
      )}
      <div className='flex flex-col items-end space-y-3'>
        {company.services
          ?.slice()
          .reverse()
          .map((service, index) => {
            const delay = index * 100;
            return (
              <AnimatedServiceButton
                key={`${company.id}-${service.serviceName}-${index}`}
                service={service}
                index={index}
                onServiceClick={onServiceClick}
                isVisible={servicesVisible}
                delay={delay}
              />
            );
          })}
      </div>
    </div>
  );
};

export const SolutionsBlock = ({ data }: { data: any }) => {
  const [activeCompany, setActiveCompany] = useState(0);
  const [servicesVisible, setServicesVisible] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    service: null,
    company: null,
  });

  const companies = data.companies || [];
  const currentCompany: SolutionsBlockCompany | undefined = companies[activeCompany];
  const autoRotateDelay = data.autoRotateDelay ?? 4000;
  const enableAutoRotate = data.enableAutoRotate !== false;

  const { pauseRotation, resumeRotation } = useAutoRotation(
    companies.length,
    autoRotateDelay,
    enableAutoRotate,
    activeCompany,
    setActiveCompany
  );

  useEffect(() => {
    setServicesVisible(false);
    const timer = setTimeout(() => setServicesVisible(true), 100);
    return () => clearTimeout(timer);
  }, [activeCompany]);

  const handleServiceClick = useCallback(
    (service: Service) => {
      setModalState({
        isOpen: true,
        service,
        company: currentCompany || null,
      });
    },
    [currentCompany]
  );

  const handleModalClose = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleCompanySelect = useCallback(
    (index: number) => {
      if (index !== activeCompany) {
        setServicesVisible(false);
        setTimeout(() => {
          setActiveCompany(index);
        }, 200);
      }
    },
    [activeCompany]
  );

  const handleMouseEnter = useCallback(() => {
    if (modalState.isOpen) {
      pauseRotation();
    }
  }, [pauseRotation, modalState.isOpen]);

  const handleMouseLeave = useCallback(() => {
    if (!modalState.isOpen) {
      resumeRotation();
    }
  }, [resumeRotation, modalState.isOpen]);

  useEffect(() => {
    if (!modalState.isOpen) {
      resumeRotation();
    } else {
      pauseRotation();
    }
  }, [modalState.isOpen, resumeRotation, pauseRotation]);

  return (
    <>
      <div
        className='mx-auto'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          borderRadius: '1.25rem',
          background: '#000',
          display: 'flex',
          width: '100%',
          maxWidth: '78.125rem',
          padding: '2.5rem 2.8125rem',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem',
        }}
      >
        <div className='flex flex-col items-center gap-6 w-full'>
          <div className='text-center space-y-4'>
            <h2 className='text-white text-3xl font-bold' data-tina-field={tinaField(data, 'mainTitle')}>
              {data.mainTitle}
            </h2>
            <p className='text-white text-lg opacity-80' data-tina-field={tinaField(data, 'description')}>
              {data.description}
            </p>
          </div>
          <div className='w-full'>
            <div className='hidden md:flex gap-0'>
              {(data.images as { image?: string; alt?: string }[])?.slice(0, 3).map((img, index) => (
                <div key={index} style={{ width: '24.125rem', height: '19.1875rem' }} className='overflow-hidden' data-tina-field={tinaField(data, 'images')}>
                  <img
                    src={img.image || '/api/placeholder/386/307'}
                    alt={img.alt || `Imagem ${index + 1}`}
                    className='w-full h-full object-cover'
                    style={{
                      borderRadius: index === 0 ? '8px 0 0 8px' : index === 2 ? '0 8px 8px 0' : '0',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className='md:hidden w-full overflow-x-auto'>
              <div className='flex gap-4 pb-4 snap-x snap-mandatory snap-center scroll-smooth' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {(data.images as { image?: string; alt?: string }[])?.map((img, index) => (
                  <div key={index} className='flex-none w-80 h-64 overflow-hidden rounded-lg snap-center' data-tina-field={tinaField(data, 'images')}>
                    <img src={img.image || '/api/placeholder/320/256'} alt={img.alt || `Imagem ${index + 1}`} className='w-full h-full object-cover' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full gap-12 flex-wrap'>
          <div className='prose lg:prose-xl flex-1 space-y-6 max-w-[30rem]'>
            <h3 className='text-white font-medium leading-normal uppercase font-inter' data-tina-field={tinaField(data, 'companiesTitle')}>
              {data.companiesTitle}
            </h3>
            <CompanySelector companies={companies} activeIndex={activeCompany} onCompanySelect={handleCompanySelect} />
          </div>
          {currentCompany && <ServicesSection company={currentCompany} servicesVisible={servicesVisible} onServiceClick={handleServiceClick} />}
        </div>
      </div>
      <ServiceModal modalState={modalState} onClose={handleModalClose} />
    </>
  );
};

export const solutionsBlockSchema: Template = {
  name: 'solutions',
  label: 'Soluções Personalizadas',
  ui: {
    previewSrc: '/blocks/solutions.png',
    defaultItem: {
      mainTitle: 'Soluções Inovadoras',
      description: 'Oferecemos soluções completas e personalizadas para o mercado imobiliário',
      companiesTitle: 'Soluções personalizadas para suas necessidades imobiliárias',
      enableAutoRotate: true,
      autoRotateDelay: 4000,
      companies: [
        { id: 'arkeng', logo: '', servicesTitle: 'Nossos Serviços', services: [] },
        { id: 'ebim', logo: '', servicesTitle: 'Nossos Serviços', services: [] },
        { id: 'arkane', logo: '', servicesTitle: 'Nossos Serviços', services: [] },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    { type: 'string', name: 'mainTitle', label: 'Título Principal' },
    { type: 'string', name: 'description', label: 'Descrição' },
    { type: 'string', name: 'companiesTitle', label: 'Título das Empresas' },
    { type: 'boolean', name: 'enableAutoRotate', label: 'Ativar Rotação Automática', ui: { component: 'toggle' } },
    { type: 'number', name: 'autoRotateDelay', label: 'Tempo de Rotação (ms)' },
    {
      type: 'object',
      name: 'companies',
      label: 'Empresas',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.id ? COMPANY_LABELS[item.id as ProjectType] || item.id : 'Empresa'
        })
      },
      fields: [
        {
          type: 'string',
          name: 'id',
          label: 'Empresa',
          options: [
            { value: 'arkeng', label: 'Arkeng' },
            { value: 'ebim', label: 'Ebim' },
            { value: 'arkane', label: 'Arkane' },
          ],
        },
        { type: 'image', name: 'logo', label: 'Logo' },
        { type: 'string', name: 'servicesTitle', label: 'Título dos Serviços' },
        {
          type: 'object',
          name: 'services',
          label: 'Serviços',
          list: true,
          fields: [
            { type: 'string', name: 'serviceName', label: 'Nome do Serviço' },
            {
              type: 'object',
              name: 'modalContent',
              label: 'Conteúdo do Modal',
              fields: [
                { type: 'string', name: 'detailedDescription', label: 'Descrição Detalhada' },
                { type: 'string', name: 'howItWorksUrl', label: 'URL Como Funciona' },
                { type: 'string', name: 'howItWorksButtonText', label: 'Texto do Botão "Como Funciona"' },
                { type: 'string', list: true, name: 'features', label: 'Características' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'object',
      name: 'images',
      label: 'Imagens',
      list: true,
      fields: [
        { type: 'image', name: 'image', label: 'Imagem' },
        { type: 'string', name: 'alt', label: 'Texto Alternativo' },
      ],
    },
  ],
};