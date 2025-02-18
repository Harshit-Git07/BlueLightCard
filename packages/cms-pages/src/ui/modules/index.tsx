import AccordionList from './AccordionList';
import BlogRollup from './blog/Rollup';
import CreativeModule from './CreativeModule';
import CustomHTML from './CustomHTML';
import FlagList from './FlagList';
import Hero from './Hero';
import HeroSplit from './HeroSplit';
import HeroSaaS from './HeroSaaS';
import RichtextModule from './RichtextModule';
import StatList from './StatList';
import StepList from './StepList';
import TestimonialList from './TestimonialList';
import MenuThemedOffer from './MenuThemedOffer';
import MenuCampaign from './MenuCampaign';
import MenuCompany from './MenuCompany';
import MenuOffer from './MenuOffer';
import Content from './RichtextModule/Content';
import LogoList from '@/ui/modules/LogoList';

export default function Modules({ modules, title }: { modules?: Sanity.Module[]; title?: string }) {
  return (
    <>
      {modules?.map((module) => {
        switch (module._type) {
          case 'accordion-list':
            return <AccordionList {...module} key={module._key} />;
          case 'blog-rollup':
            return <BlogRollup {...module} key={module._key} />;
          case 'creative-module':
            return <CreativeModule {...module} key={module._key} />;
          case 'custom-html':
            return <CustomHTML {...module} key={module._key} />;
          case 'flag-list':
            return <FlagList {...module} key={module._key} />;
          case 'hero':
            return <Hero {...module} key={module._key} />;
          case 'hero.split':
            return <HeroSplit {...module} key={module._key} />;
          case 'hero.saas':
            return <HeroSaaS {...module} key={module._key} />;
          case 'logo-list':
            return <LogoList {...module} key={module._key} />;
          case 'richtext-module':
            return <RichtextModule {...module} key={module._key} />;
          case 'stat-list':
            return <StatList {...module} key={module._key} />;
          case 'step-list':
            return <StepList {...module} key={module._key} />;
          case 'testimonial-list':
            return <TestimonialList {...module} key={module._key} />;
          case 'menu.offer.type':
            return <MenuOffer {...module} key={module._key} />;
          case 'menu.company.type':
            return <MenuCompany {...module} key={module._key} />;
          case 'menu.campaign.type':
            return <MenuCampaign {...module} key={module._key} />;
          case 'menu.themed.offer.type':
            return <MenuThemedOffer {...module} key={module._key} />;
          case 'block':
            return <Content value={module} key={module._key} />;
          default:
            console.error('Unknown module type:', module._type);
            return <div data-type={module._type} key={module._key} />;
        }
      })}
    </>
  );
}
