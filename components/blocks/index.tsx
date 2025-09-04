import { tinaField } from 'tinacms/dist/react';
import { Page, PageBlocks } from '../../tina/__generated__/types';
import { Hero } from './hero';
import { Content } from './content';
import { Features } from './features';
import { Testimonial } from './testimonial';
import { Header } from './header';
import { Video } from './video';
import { Stats } from './stats';
import { CallToAction } from './call-to-action';
import { Monochrome } from './monochrome';
import { Projects } from './projects';
import { TeamSection as Team} from './team';
import { ClientsCarousel } from './clients';
import { SolutionsBlock } from './services';
import { AboutUsBlock } from './about-us';

export const Blocks = (props: Omit<Page, 'id' | '_sys' | '_values'>) => {
  if (!props.blocks) return null;
  return (
    <>
      {props.blocks.map(function (block, i) {
        return (
          <div key={i} data-tina-field={tinaField(block)}>
            <Block {...block} />
          </div>
        );
      })}
    </>
  );
};

const Block = (block: PageBlocks) => {
  switch (block.__typename) {
    case 'PageBlocksVideo':
      return <Video data={block} />;
    case 'PageBlocksHero':
      return <Hero data={block} />;
    case 'PageBlocksHeader':
      return <Header data={block as any} />;
    case 'PageBlocksMonochrome':
      return <Monochrome data={block as any} />;
    case 'PageBlocksStats':
      return <Stats data={block} />;
    case 'PageBlocksContent':
      return <Content data={block} />;
    case 'PageBlocksFeatures':
      return <Features data={block} />;
    case 'PageBlocksTestimonial':
      return <Testimonial data={block} />;
    case 'PageBlocksCta':
      return <CallToAction data={block} />;
    case 'PageBlocksProjects':
      return <Projects data={block} />;
    case 'PageBlocksTeamSection':
       return <Team data={block} />;
    case 'PageBlocksClientsCarousel':
       return <ClientsCarousel data={block} />;
    case 'PageBlocksSolutions':
       return <SolutionsBlock data={block} />;
    case 'PageBlocksAboutUs':
       return <AboutUsBlock data={block} />;
       
    default:
      return null;
  }
};
