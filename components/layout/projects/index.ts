import * as HugeIcons from '@hugeicons/core-free-icons';
import { Variants } from 'framer-motion';

export const scrollContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
    exit: {
        y: 100,
        opacity: 0,
        scale: 0.4,
        transition: { duration: 0.2 },
    },
}

export const cardVariants: Variants = {
    hidden: (scrollDirection: "up" | "down") => ({
        y: scrollDirection === "down" ? 20 : -20,
        opacity: 0,
        scale: 0.8,
    }),
    visible: (scrollDirection: "up" | "down") => ({
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            bounce: 0.3,
            duration: 0.6,
            delay: 0.1,
        },
    }),
    exit: (scrollDirection: "up" | "down") => ({
        y: scrollDirection === "down" ? 20 : -20,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.1 },
    }),
};

export type ProjectType = 'ARKENG' | 'eBIM' | 'ARKANE';
export type AllProjects = ProjectType | 'ALL';

export const corporationsLogos: Record<ProjectType, string> = {
    ARKENG: '/uploads/project-logos/ARKENG.png',
    eBIM: '/uploads/project-logos/eBIM.png',
    ARKANE: '/uploads/project-logos/ARKANE.png',
};


export const iconMap = {
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

