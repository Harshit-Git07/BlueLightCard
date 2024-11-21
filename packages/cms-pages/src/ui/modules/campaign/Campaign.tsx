import { cn } from '@/lib/utils';
import Img from '@/ui/Img';
import Modules from '@/ui/modules';
import Image from 'next/image';
import { Fragment } from 'react';
import CompanyCard from '../CompanyCard';
import OfferCard from '../OfferCard';

export default function Campaign({ campaign }: { campaign: Sanity.Campaign }) {
  return (
    <article className={cn('section', 'space-y-8')}>
      <div className={cn('relative')}>
        <h2
          className={cn(
            'absolute flex h-full w-full items-center justify-center bg-white/50 text-6xl font-bold',
          )}
        >
          {campaign.name}
        </h2>
        {campaign.image.default != null && (
          <figure className="aspect-video bg-ink/5">
            <Image
              className="aspect-video w-full object-cover transition-[filter] group-hover:brightness-110"
              src={campaign.image.default.url}
              width={campaign.image.default.width}
              height={campaign.image.default.height}
              alt={campaign.name}
            />
          </figure>
        )}
      </div>
      <Modules modules={[campaign.termsAndConditions]} />
      <section className={cn('section', 'items-top mt-10 grid grid-cols-3 gap-10')}>
        {campaign.inclusions &&
          campaign.inclusions.map((inclusion) => {
            switch (inclusion._type) {
              case 'company':
                inclusion = inclusion as Sanity.Company;
                return (
                  <CompanyCard
                    companyId={inclusion._id}
                    companyName={inclusion.brandCompanyDetails[0].displayName ?? ''}
                    image={inclusion.brandCompanyDetails[0].companyLogo.default as Sanity.Image}
                  />
                );
              case 'offer':
                inclusion = inclusion as Sanity.Offer;
                return <OfferCard companyId={inclusion.company._id} offer={inclusion} />;
              default:
                return null;
            }
          })}
      </section>
    </article>
  );
}
