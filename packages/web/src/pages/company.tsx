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
import {
  Container,
  CompanyAbout,
  Heading,
  PillButtons,
  PlatformVariant,
  ResponsiveOfferCard,
  CampaignCard,
  Link,
  ShareButton,
} from '@bluelightcard/shared-ui';
import { getCompany, getOffersByCompany } from '../common/utils/company/companyData';
import { ENVIRONMENT } from '@/global-vars';
import { OfferTypeStrLiterals, offerTypeParser } from '../common/utils/offers/offerTypeParser';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import AmplitudeContext from '@/context/AmplitudeContext';
import amplitudeEvents from '@/utils/amplitude/events';
import { logCompanyView } from '@/utils/amplitude/logCompanyView';
import { usePathname } from 'next/navigation';
import { useOfferDetails } from '@bluelightcard/shared-ui';
import { BRANDS } from '../common/types/brands.enum';

type CompanyPageProps = {};

export type OfferData = {
  id: number;
  type: OfferTypeStrLiterals;
  name: string;
  image: string;
  companyId: string;
  companyName: string;
};

type CompanyData = {
  id: string;
  name: string;
  description: string;
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
  const pathname = usePathname();
  const router = useRouter();
  const { cid: companyId } = router.query;

  const isMobile = useMedia('(max-width: 500px)');

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const amplitude = useContext(AmplitudeContext);
  const defaultCompanyPropertyValue = '';

  const [selectedType, setSelectedType] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>((router.query.q as string) ?? '');
  const [adverts, setAdverts] = useState<BannerDataType[]>([]);
  const [companyData, setCompanyData] = useState<CompanyData>({
    id: defaultCompanyPropertyValue,
    name: defaultCompanyPropertyValue,
    description: defaultCompanyPropertyValue,
  });
  const [offerData, setOfferData] = useState<OfferData[] | null>([]);

  const { viewOffer } = useOfferDetails();

  const getBrand = () => {
    switch (BRAND) {
      case BRANDS.BLC_UK:
      case BRANDS.BLC_AU:
        return 'Blue Light Card';
      case BRANDS.DDS_UK:
        return 'Defense Discount Service';
    }
  };

  const handleCompanyView = (eventSource: string, companyId: string, companyName: string) => {
    logCompanyView({
      amplitude,
      userUuid: userCtx.user?.uuid,
      eventSource,
      origin: pathname,
      companyId,
      companyName,
    });
  };

  const toggleFilter = (pillType: string) => {
    if (selectedType === pillType) {
      setSelectedType('All');
    } else {
      setSelectedType(pillType);
    }
  };

  async function onSelectOffer(offerId: number, companyId: number, companyName: string) {
    await viewOffer({
      offerId: offerId,
      companyId: companyId,
      companyName: companyName,
      platform: PlatformVariant.Web,
      amplitudeCtx: amplitude,
    });
  }

  useEffect(() => {
    const fetchBannerData = async () => {
      setIsLoading(true);

      // Banner Data
      try {
        let bannerData = await makeQuery(advertQuery(BRAND, userCtx.isAgeGated ?? true));
        const banners = shuffle(bannerData.data.banners).slice(0, 2) as BannerDataType[];
        const modifyLinksArray: BannerDataType[] = [];
        banners.map((advert: BannerDataType, index: number) => {
          const splitLink = advert.link.split('cid=');
          const cidSplit = splitLink[1].split('&');
          const cid = cidSplit[0];
          const link = 'https://www.bluelightcard.co.uk/company?cid=' + cid;
          modifyLinksArray[index] = { ...advert, link };
        });
        setAdverts(modifyLinksArray);
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

      if (companyDataResponse || typeof companyDataResponse !== null) {
        setCompanyData(companyDataResponse);
        handleCompanyView('companyPage', companyDataResponse.id, companyDataResponse.name);
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
      if (offerDataResponse || typeof offerDataResponse !== null) {
        setOfferData(offerDataResponse.offers);
      }
    };

    if (authCtx.authState.idToken && companyId) {
      fetchOfferData();
    }
  }, [authCtx.authState.idToken, companyId]);

  useEffect(() => {
    if (adverts.length && companyData && offerData && offerData.length) {
      setIsLoading(false);
    }
  }, [adverts, companyData, offerData]);

  const filteredOffers =
    offerData && selectedType === 'All'
      ? offerData
      : offerData && offerData.filter((offer: OfferData) => offer.type === selectedType);

  return (
    <>
      <Head>
        <title>
          {companyData.name} offers | {getBrand()}
        </title>
        <meta
          name="description"
          content={`Some of the latest discount offers from ${companyData.name}`}
        />
      </Head>
      <Container
        className="desktop:mt-16 mobile:mt-[14px]"
        platform={isMobile ? PlatformVariant.MobileHybrid : PlatformVariant.Web}
      >
        {/* About page (ONLY ON WEB), ShareButton and FavouriteButton */}
        <div className="flex justify-between desktop:items-start mobile:items-center">
          {isMobile && <Link href="/members-home">Back</Link>}
          <Heading
            headingLevel={'h1'}
            className="!text-black tablet:!text-5xl mobile:!text-xl tablet:!leading-[56px] mobile:!leading-5 tablet:font-bold mobile:font-semibold"
          >
            {companyData.name}
          </Heading>
          <div
            className="flex desktop:justify-end desktop:items-start mobile:gap-2"
            onClick={async () => {
              if (amplitude) {
                await amplitude.trackEventAsync(amplitudeEvents.COMPANY_SHARED_CLICKED, {
                  company_id: companyData.id,
                  company_name: companyData.name,
                });
              }
            }}
          >
            <ShareButton
              showShareLabel={isMobile ? false : true}
              shareDetails={{
                name: companyData.name,
                description: companyData.description,
                // adds check on ENVIRONMENT so we can pass the port on localhost:3000 for the share URL. Otherwise it will not show port in the url
                url: `${window.location.protocol}//${window.location.hostname}${
                  ENVIRONMENT === 'local' && window.location.port ? `:${window.location.port}` : ''
                }/company?cid=${companyId}`,
              }}
            />
          </div>
        </div>
        {!isMobile && (
          <div className="w-full">
            <CompanyAbout
              CompanyDescription={companyData.description}
              CompanyName={''}
              platform={PlatformVariant.Web}
            />
          </div>
        )}

        {/* Filters */}
        <div className="py-6 flex gap-3 overflow-x-auto">
          {filterArray.map((pillType, index) => {
            return (
              <div key={index}>
                <PillButtons
                  text={
                    pillType === offerTypeParser.Giftcards.type
                      ? offerTypeParser.Giftcards.label
                      : filterArray[index]
                  }
                  onSelected={async () => {
                    toggleFilter(pillType);
                    if (amplitude) {
                      await amplitude.trackEventAsync(amplitudeEvents.COMPANY_FILTER_CLICKED, {
                        company_id: companyData.id,
                        company_name: companyData.name,
                        filter_name: pillType,
                      });
                    }
                  }}
                  isSelected={selectedType === pillType}
                  platform={isMobile ? PlatformVariant.MobileHybrid : PlatformVariant.Web}
                  disabled={
                    pillType !== 'All' &&
                    !offerData?.find((offer: OfferData) => offer.type === pillType)
                  }
                />
              </div>
            );
          })}
        </div>

        {/* Offer cards */}
        {offerData && offerData.length > 0 && companyData && (
          <div className="mb-0 desktop:mb-[71px]">
            <div
              className={`flex flex-col ${
                isMobile ? 'gap-2' : 'gap-10'
              } tablet:gap-10 desktop:grid desktop:grid-cols-2`}
            >
              {filteredOffers &&
                filteredOffers.map((offer: OfferData, index: number) => (
                  <div
                    key={offer.id}
                    onClick={async () => {
                      await onSelectOffer(offer.id, Number(companyData?.id), companyData?.name);
                      if (amplitude) {
                        await amplitude.trackEventAsync(amplitudeEvents.COMPANY_OFFER_CLICKED, {
                          company_id: companyData.id,
                          company_name: companyData.name,
                          position: index + 1,
                          offer_id: offer?.id,
                          offer_name: offer?.name,
                        });
                      }
                    }}
                  >
                    <ResponsiveOfferCard
                      id={offer.id}
                      type={offer.type}
                      name={offer.name}
                      image={offer.image}
                      companyId={Number(companyId)}
                      companyName={companyData.name}
                      variant={isMobile ? 'horizontal' : 'vertical'}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Adverts (ONLY ON DESKTOP) */}
        {!isMobile && !isLoading && adverts && adverts.length > 0 && (
          <>
            <div className="w-full mb-16 tablet:mt-14">
              <div className="grid grid-cols-2 gap-10">
                {adverts.slice(0, 2).map((advert, index) => {
                  return (
                    <CampaignCard
                      key={index}
                      name={advert.__typename}
                      image={advert.imageSource}
                      linkUrl={advert.link}
                      className="h-[200px]"
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* About page (MOBILE) */}
        {isMobile && companyData.name && (
          <div className="my-4">
            <CompanyAbout
              CompanyName={`About ${companyData.name}`}
              CompanyDescription={companyData.description}
              platform={PlatformVariant.MobileHybrid}
            />
          </div>
        )}

        {/* Adverts (ONLY ON MOBILE RESPONSIVE - since it is positioned after the company about section) */}
        {isMobile && !isLoading && adverts && adverts.length > 0 && (
          <>
            <div className="w-full mb-5 mt-4">
              <div className="grid gap-2">
                {adverts.slice(0, 2).map((advert, index) => {
                  return (
                    <CampaignCard
                      key={index}
                      name={advert.__typename}
                      image={advert.imageSource}
                      linkUrl={advert.link}
                      className="min-h-[140px]"
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export const getStaticProps = getI18nStaticProps;

export default withAuthProviderLayout(CompanyPage, {});
