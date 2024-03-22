import { useState, useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import requireAuth from '@/hoc/requireAuth';
import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';
import { advertQuery } from 'src/graphql/advertQuery';
import { makeQuery } from 'src/graphql/makeQuery';
import { shuffle } from 'lodash';
import { BRAND } from '@/global-vars';
import AuthContext from '@/context/Auth/AuthContext';
import UserContext from '@/context/User/UserContext';
import Heading from '@/components/Heading/Heading';
import Container from '@/components/Container/Container';
import CompanyAbout from '@/components/CompanyAbout/CompanyAbout';
import ShareButton from '@/components/ShareButton/ShareButton';
import FavouriteButton from '@/components/FavouriteButton/FavouriteButton';
import PillButtons from '@/components/PillButtons/PillButtons';
import ResponsiveOfferCard from '@/components/ResponsiveOfferCard/ResponsiveOfferCard';
import getOffersStaticProps from '@/utils/getProps/getOffersProps';
import Link from '@/components/Link/Link';
import CampaignCard from '@/components/CampaignCard/CampaignCard';
import { useMedia } from 'react-use';

type CompanyPageProps = {};

type OfferCardProp = {
  id: string;
  type: 'Online' | 'In-store' | 'Gift card';
  name: string;
  image: string;
  companyId: string;
  companyName: string;
};

type BannerDataType = {
  imageSource: string;
  link: string;
};

const filterArray = ['All', 'Online', 'In-store', 'Gift card'];

const mockOfferCardResponse: OfferCardProp[] = [
  {
    id: '1',
    type: 'Online',
    name: 'Get up to 10% off all Galaxy devices',
    image: '/assets/forest.jpeg',
    companyId: '4016',
    companyName: 'Samsung',
  },
  {
    id: '2',
    type: 'Online',
    name: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
    image: '/assets/forest.jpeg',
    companyId: '4016',
    companyName: 'Samsung',
  },
  {
    id: '3',
    type: 'Online',
    name: 'Pre-order the Galaxy S24 now to get 5% off* and we will double your storage to 256GB',
    image: '/assets/forest.jpeg',
    companyId: '4016',
    companyName: 'Samsung',
  },
  {
    id: '4',
    type: 'In-store',
    name: 'Save up to 20% on Samsung TVs*',
    image: '/assets/forest.jpeg',
    companyId: '4016',
    companyName: 'Samsung',
  },
  {
    id: '5',
    type: 'Gift card',
    name: 'Save up to 15% extra on Winter Savings across Laundry! While stocks last.',
    image: '/assets/forest.jpeg',
    companyId: '4016',
    companyName: 'Samsung',
  },
  {
    id: '6',
    type: 'Online',
    name: 'Pre-order the Galaxy S24 Ultra now to get 5% off ',
    image: '/assets/forest.jpeg',
    companyId: '4016',
    companyName: 'Samsung',
  },
];

const CompanyPage: NextPage<CompanyPageProps> = () => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const isMobile = useMedia('(max-width: 500px)');
  const companyName = 'Samsung';
  const companyNameMobile = `About ${companyName}`;
  const companyDescription = `Samsung is an internationally recognized industry leader in technology and a Top 10 global brand. From the latest Samsung Galaxy smartphones to Samsung QLED TVs and Galaxy Buds, we've got you covered with the best deals.`;
  const [firstItem, ...restItems] = mockOfferCardResponse;
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>((router.query.q as string) ?? '');
  const [adverts, setAdverts] = useState<any[]>([]);

  const filteredOffers =
    selectedType === 'All'
      ? mockOfferCardResponse
      : mockOfferCardResponse.filter((offer) => offer.type === selectedType);

  const isFirstItemMatching = selectedType === 'All' || firstItem.type === selectedType;

  const toggleFilter = (pillType: string) => {
    if (selectedType === pillType) {
      setSelectedType('All');
    } else {
      setSelectedType(pillType);
    }
  };

  useEffect(() => {
    const fetchBannerData = async () => {
      setIsLoading(true);

      // Banner Data
      try {
        let bannerData = await makeQuery(advertQuery(BRAND, userCtx.isAgeGated ?? true));
        setAdverts(shuffle(bannerData.data.banners).slice(0, 2) as BannerDataType[]);
      } catch (error) {
        setAdverts([]);
      }

      setIsLoading(false);
    };

    if (authCtx.authState.idToken && Boolean(userCtx.user) && router.isReady) {
      fetchBannerData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCtx.authState.idToken, userCtx.isAgeGated, userCtx.user, router.isReady, query]);

  return (
    <>
      <Container className="desktop:mt-16 mobile:mt-[14px]">
        {/* About page (ONLY ON WEB), ShareButton and FavouriteButton */}
        <div className="flex justify-between desktop:items-start mobile:items-center">
          {isMobile && <Link onClickLink={() => void 0}>Back</Link>}
          <Heading
            headingLevel={'h1'}
            className="!text-black tablet:!text-5xl mobile:!text-xl tablet:!leading-[56px] mobile:!leading-5 tablet:font-bold mobile:font-semibold"
          >
            {companyName}
          </Heading>
          <div className="flex desktop:justify-end desktop:items-start mobile:gap-2">
            <ShareButton onShareClick={() => void 0} hasText={isMobile ? false : true} />
            <FavouriteButton
              offerData={{
                id: 42,
              }}
              offerMeta={{
                companyId: '42',
                companyName: 'Samsung',
                offerId: '42',
              }}
              hasText={isMobile ? false : true}
            />
          </div>
        </div>
        {!isMobile && (
          <div className="w-full">
            <CompanyAbout CompanyDescription={companyDescription} />
          </div>
        )}

        {/* Pills */}
        <div className="py-6 flex gap-3">
          {filterArray.map((pillType, index) => {
            return (
              <div key={index}>
                <PillButtons
                  text={filterArray[index]}
                  onSelected={() => toggleFilter(pillType)}
                  isSelected={selectedType === pillType}
                />
              </div>
            );
          })}
        </div>

        {/* Offer cards */}
        <div className="desktop:mb-[71px] mobile:mb-0">
          <div key={firstItem.id} className="flex flex-col desktop:mb-10 mobile:mb-2">
            {/* Render the first item separately */}
            {isFirstItemMatching && (
              <ResponsiveOfferCard
                id={firstItem.id}
                type={firstItem.type}
                name={firstItem.name}
                image={firstItem.image}
                companyId={firstItem.companyId}
                companyName={firstItem.companyName}
              />
            )}
          </div>

          <div className="desktop:grid desktop:grid-cols-2 desktop:gap-10 mobile:flex mobile:flex-col mobile:gap-2">
            {filteredOffers.map((offerCard, index) => (
              <div key={index}>
                <ResponsiveOfferCard
                  id={offerCard.id}
                  type={offerCard.type}
                  name={offerCard.name}
                  image={offerCard.image}
                  companyId={offerCard.companyId}
                  companyName={offerCard.companyName}
                  variant={isMobile ? 'horizontal' : 'vertical'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Adverts (ONLY ON WEB) */}
        {!isMobile && !isLoading && adverts && adverts.length > 0 && (
          <>
            <div className="w-full mb-16">
              <div className="grid grid-cols-2 gap-10">
                {adverts.slice(0, 2).map((advert, index) => {
                  return (
                    <CampaignCard
                      key={index}
                      name={advert.__typename}
                      image={advert.imageSource}
                      linkUrl={advert.link}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* About page (MOBILE) */}
        {isMobile && (
          <div className="my-4">
            <CompanyAbout CompanyName={companyNameMobile} CompanyDescription={companyDescription} />
          </div>
        )}
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

export async function getStaticPaths() {
  // Fetch the list of company IDs from your data source
  // Example: const companyIds = await fetchCompanyIds();
  const companyIds = ['123'];

  // Map the company IDs to the paths object required by Next.js
  const paths = companyIds.map((id) => ({
    params: { id },
  }));

  return {
    paths,
    fallback: false, // or true if you want to use fallback rendering
  };
}

export default withAuthProviderLayout(requireAuth(CompanyPage), layoutProps);
