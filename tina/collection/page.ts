import type { Collection } from 'tinacms';
import { heroBlockSchema } from '@/components/blocks/hero';
import { headerBlockSchema } from '@/components/blocks/header';
import { contentBlockSchema } from '@/components/blocks/content';
import { testimonialBlockSchema } from '@/components/blocks/testimonial';
import { featureBlockSchema } from '@/components/blocks/features';
import { videoBlockSchema } from '@/components/blocks/video';
import { calloutBlockSchema } from '@/components/blocks/callout';
import { statsBlockSchema } from '@/components/blocks/stats';
import { ctaBlockSchema } from '@/components/blocks/call-to-action';
import { monochromeBlockSchema } from '@/components/blocks/monochrome';
import { projectsBlockSchema } from '@/components/blocks/projects';
import { teamSectionSchema } from '@/components/blocks/team';
import { clientsCarouselSchema } from '@/components/blocks/clients';
import { solutionsBlockSchema } from '@/components/blocks/services';
import { aboutUsBlockSchema } from '@/components/blocks/about-us';
import { contactBlockSchema } from '@/components/blocks/contact';

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const filepath = document._sys.breadcrumbs.join('/');
      if (filepath === 'home') {
        return '/';
      }
      return `/${filepath}`;
    },
  },
  fields: [
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Sections',
      ui: {
        visualSelector: true,
      },
      templates: [
        heroBlockSchema,
        headerBlockSchema,
        calloutBlockSchema,
        featureBlockSchema,
        statsBlockSchema,
        monochromeBlockSchema,
        ctaBlockSchema,
        contentBlockSchema,
        testimonialBlockSchema,
        videoBlockSchema,
        projectsBlockSchema,
        teamSectionSchema,
        clientsCarouselSchema,
        solutionsBlockSchema,
        aboutUsBlockSchema,
        contactBlockSchema
      ],
    },
  ],
};

export default Page;
