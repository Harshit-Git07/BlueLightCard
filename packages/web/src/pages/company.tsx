import { useState, useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';
import { useMedia } from 'react-use';
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
import Link from '@/components/Link/Link';
import CampaignCard from '@/components/CampaignCard/CampaignCard';
import { getCompany, getOffersByCompany } from '../common/utils/company/companyData';
import { ENVIRONMENT } from '@/global-vars';
import { OfferTypeStrLiterals, offerTypeParser } from '../common/utils/offers/offerTypeParser';
import getI18nStaticProps from '@/utils/i18nStaticProps';

type CompanyPageProps = {};

export type OfferCardProp = {
  id: string;
  type: OfferTypeStrLiterals;
  name: string;
  image: string;
  companyId: string;
  companyName: string;
};

type BannerDataType = {
  imageSource: string;
  link: string;
  __typename: string;
};

export type ResponseError = {
  message: string;
};

const offerTypesArray = Object.keys(offerTypeParser) as Array<keyof typeof offerTypeParser>;
const filterArray = ['All', ...offerTypesArray];

const CompanyPage: NextPage<CompanyPageProps> = () => {
  const router = useRouter();
  const { cid: companyId } = router.query;

  const isMobile = useMedia('(max-width: 500px)');
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  const [selectedType, setSelectedType] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>((router.query.q as string) ?? '');
  const [adverts, setAdverts] = useState<BannerDataType[]>([]);
  const [companyData, setCompanyData] = useState<any | null>(null);
  const [offerData, setOfferData] = useState<any | null>([]);

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
    };

    if (authCtx.authState.idToken && Boolean(userCtx.user) && router.isReady) {
      fetchBannerData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCtx.authState.idToken, userCtx.isAgeGated, userCtx.user, router.isReady, query]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);

      // Company data
      const companyDataResponse = await getCompany(authCtx.authState.idToken, companyId);
      if (!companyDataResponse || typeof companyDataResponse === null) {
        setCompanyData(null);
        router.push('/404');
      } else {
        setCompanyData(companyDataResponse);
      }
    };
    if (authCtx.authState.idToken && companyId) {
      fetchCompanyData();
    }
  }, [authCtx.authState.idToken, companyId]);

  useEffect(() => {
    const fetchOfferData = async () => {
      setIsLoading(true);

      //Offers data
      const offerDataResponse = await getOffersByCompany(authCtx.authState.idToken, companyId);
      if (!offerDataResponse || typeof offerDataResponse === null) {
        setCompanyData(null);
      } else {
        setOfferData(offerDataResponse.offers);
      }
    };
    if (authCtx.authState.idToken && companyId) {
      fetchOfferData();
    }
  }, [authCtx.authState.idToken, companyId]);

  useEffect(() => {
    if (adverts.length && companyData && offerData.length) {
      setIsLoading(false);
    }
  }, [adverts, companyData, offerData]);

  const [firstItem, ...rest] = offerData;

  const filteredOffers =
    rest && selectedType === 'All'
      ? rest
      : rest.filter((offer: OfferCardProp) => offer.type === selectedType);

  const isFirstItemMatching =
    firstItem && (selectedType === 'All' || firstItem.type === selectedType);

  return (
    <>
      <Head>
        <title>{companyData?.name} offers | Blue Light Card</title>
      </Head>
      <Container className="desktop:mt-16 mobile:mt-[14px]">
        {/* About page (ONLY ON WEB), ShareButton and FavouriteButton */}
        <div className="flex justify-between desktop:items-start mobile:items-center">
          {isMobile && <Link onClickLink={() => void 0}>Back</Link>}
          <Heading
            headingLevel={'h1'}
            className="!text-black tablet:!text-5xl mobile:!text-xl tablet:!leading-[56px] mobile:!leading-5 tablet:font-bold mobile:font-semibold"
          >
            {companyData?.name}
          </Heading>
          <div className="flex desktop:justify-end desktop:items-start mobile:gap-2">
            <ShareButton
              showShareLabel={isMobile ? false : true}
              shareDetails={{
                name: companyData?.name,
                description: companyData?.description,
                // adds check on ENVIRONMENT so we can pass the port on localhost:3000 for the share URL. Otherwise it will not show port in the url
                url: `${window.location.protocol}/${window.location.hostname}${
                  ENVIRONMENT === 'local' && window.location.port ? `:${window.location.port}` : ''
                }/company/${companyId}`,
              }}
              shareLabel="Share Company"
            />
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
            <CompanyAbout CompanyDescription={companyData?.description} />
          </div>
        )}

        {/* Filters */}
        <div className="py-6 flex gap-3">
          {filterArray.map((pillType, index) => {
            return (
              <div key={index}>
                <PillButtons
                  text={
                    pillType === offerTypeParser.Giftcards.type
                      ? offerTypeParser.Giftcards.label
                      : filterArray[index]
                  }
                  onSelected={() => toggleFilter(pillType)}
                  isSelected={selectedType === pillType}
                />
              </div>
            );
          })}
        </div>

        {/* Offer cards */}
        {!!offerData.length && companyData && (
          <div className="desktop:mb-[71px] mobile:mb-0">
            <div className="flex flex-col desktop:mb-10 mobile:mb-2">
              {/* Render the first item separately */}
              {isFirstItemMatching && (
                <ResponsiveOfferCard
                  id={firstItem.id}
                  type={firstItem.type}
                  name={firstItem.name}
                  image={firstItem.image}
                  companyId={companyId as string}
                  companyName={companyData?.name}
                />
              )}
            </div>

            <div className="desktop:grid desktop:grid-cols-2 desktop:gap-10 mobile:flex mobile:flex-col mobile:gap-2">
              {filteredOffers &&
                filteredOffers.map((offer: OfferCardProp, index: string) => (
                  <div key={index}>
                    <ResponsiveOfferCard
                      id={offer.id}
                      type={offer.type}
                      name={offer.name}
                      image={offer.image}
                      companyId={companyId as string}
                      companyName={companyData.name}
                      variant={isMobile ? 'horizontal' : 'vertical'}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

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
            <CompanyAbout
              CompanyName={`About ${companyData?.name}`}
              CompanyDescription={companyData?.description}
            />
          </div>
        )}
      </Container>
    </>
  );
};

export const getStaticProps = getI18nStaticProps;

const layoutProps = {
  seo: {
    title: 'company.seo.title',
    description: 'company.seo.description',
  },
};

export default withAuthProviderLayout(CompanyPage, layoutProps);
