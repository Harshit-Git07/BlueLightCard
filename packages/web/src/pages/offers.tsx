import getOffersStaticProps from '@/utils/getProps/getOffersProps';
import Heading from '@/components/Heading/Heading';
import OfferCard from '@/offers/components/OfferCard/OfferCard';
import Image from '@/components/Image/Image';
import SwiperCarousel from '@/components/SwiperCarousel/SwiperCarousel';
import Link from '@/components/Link/Link';
import requireAuth from '@/hoc/requireAuth';
import { NextPage } from 'next';
import Container from '@/components/Container/Container';
import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';

type OffersPageProps = {
  offers: OfferCardProp[];
  featuredOffers?: OfferCardProp[];
  offersHeading: string;
  heroTitle?: string;
  adverts?: { imageUrl: string; imageAlt: string; linkUrl: string }[];
};

type OfferCardProp = {
  offerDescription: string;
  companyName: string;
  imageUrl: string;
  imageAlt: string;
  linkUrl: string;
};

const OffersPage: NextPage<OffersPageProps> = () => {
  const offers: any[] = [];
  const heroTitle = '';
  const offersHeading = '';
  const featuredOffers: any[] = [];
  const adverts: any[] = [];

  return (
    <>
      {heroTitle && (
        <Container
          className="bg-surface-secondary-light dark:bg-surface-secondary-dark py-10 mb-6"
          nestedClassName="w-full flex justify-center"
        >
          <Heading headingLevel="h1">{heroTitle}</Heading>
        </Container>
      )}
      <Container>
        <div className="py-2">
          {/* Featured Offers */}
          {featuredOffers && featuredOffers.length > 0 && (
            <>
              <Heading headingLevel={'h2'}>Featured Offers</Heading>
              <hr className="mb-6" />
              <SwiperCarousel autoPlay loop>
                {featuredOffers.map((offer, index) => (
                  <OfferCard
                    key={index}
                    offerName={offer.offerDescription}
                    companyName={offer.companyName}
                    imageSrc={offer.imageUrl}
                    alt={offer.imageAlt}
                    offerLink={offer.linkUrl}
                    id={'_offer_card_' + index}
                  />
                ))}
              </SwiperCarousel>
            </>
          )}

          {/* Offers */}
          <Heading headingLevel={'h2'}>{offersHeading}</Heading>
          <div className="grid grid-cols-2 tablet:grid-cols-3 gap-1 laptop:gap-4">
            {offers.map((offer, index) => {
              return (
                <OfferCard
                  key={index}
                  offerName={offer.offerDescription}
                  companyName={offer.companyName}
                  imageSrc={offer.imageUrl}
                  alt={offer.imageAlt}
                  offerLink={offer.linkUrl}
                  id={'_offer_card_' + index}
                  addBackground
                />
              );
            })}
          </div>

          {/* Adverts */}
          {adverts && adverts.length > 0 && (
            <>
              <div className="w-full mt-8 mb-8">
                <div className="flex flex-col tablet:flex-row space-x-0 tablet:space-x-4 space-y-4 tablet:space-y-0">
                  {adverts.slice(0, 2).map((advert, index) => {
                    return (
                      <div key={index} className="relative w-full h-[200px]">
                        <Link href={advert.linkUrl}>
                          <Image
                            alt={advert.imageAlt}
                            src={advert.imageUrl}
                            className="object-scale-down w-full"
                          />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export const getStaticProps = getOffersStaticProps;

const layoutProps = {
  seo: {
    title: 'offers.seo.title',
    description: 'offers.seo.description',
    keywords: 'offers.seo.keywords',
  },
};

export default withAuthProviderLayout(requireAuth(OffersPage), layoutProps);
