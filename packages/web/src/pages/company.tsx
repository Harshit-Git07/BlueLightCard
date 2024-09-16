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
import { Container, CompanyAbout, PlatformVariant, CampaignCard } from '@bluelightcard/shared-ui';
import { getCompany, getOffersByCompany } from '../common/utils/company/companyData';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import AmplitudeContext from '@/context/AmplitudeContext';
import amplitudeEvents from '@/utils/amplitude/events';
import { logCompanyView } from '@/utils/amplitude/logCompanyView';
import { usePathname } from 'next/navigation';
import { BRANDS } from '../common/types/brands.enum';
import CompanyPageError from '../page-components/company/CompanyPageError';
import { BannerDataType, CompanyData, OfferData } from '../page-components/company/types';
import CompanyPageWebHeader from '../page-components/company/CompanyPageWebHeader';
import CompanyPageFilters, {
  companyPageFilterAllLabel,
  CompanyPageFilterOptions,
} from '../page-components/company/CompanyPageFilters';
import CompanyPageOffers from '../page-components/company/CompanyPageOffers';

type CompanyPageProps = {};

const CompanyPage: NextPage<CompanyPageProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { cid: companyId } = router.query;

  const isMobile = useMedia('(max-width: 500px)');

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const amplitude = useContext(AmplitudeContext);
  const defaultCompanyPropertyValue = '';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [query] = useState<string>((router.query.q as string) ?? '');
  const [adverts, setAdverts] = useState<BannerDataType[]>([]);
  const [companyData, setCompanyData] = useState<CompanyData>({
    id: defaultCompanyPropertyValue,
    name: defaultCompanyPropertyValue,
    description: defaultCompanyPropertyValue,
  });
  const [offerData, setOfferData] = useState<OfferData[] | null>([]);

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const getBrand = () => {
    switch (BRAND) {
      case BRANDS.BLC_UK:
      case BRANDS.BLC_AU:
        return 'Blue Light Card';
      case BRANDS.DDS_UK:
        return 'Defense Discount Service';
    }
  };

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

    const fetchCompanyData = async () => {
      setIsLoading(true);

      // Company data
      const companyDataResponse = await getCompany(authCtx.authState.idToken, companyId);

      if (companyDataResponse !== null || companyDataResponse) {
        setCompanyData(companyDataResponse);
        handleCompanyView('companyPage', companyDataResponse.id, companyDataResponse.name);
      } else {
        setErrorMessage('Company could not be found.');
      }
    };

    if (authCtx.authState.idToken && companyId) {
      fetchCompanyData();
    }
  }, [amplitude, authCtx.authState.idToken, companyId, pathname, userCtx.user?.uuid]);

  useEffect(() => {
    const fetchOfferData = async () => {
      setIsLoading(true);

      //Offers data
      const offerDataResponse = await getOffersByCompany(authCtx.authState.idToken, companyId);
      if (offerDataResponse || offerDataResponse !== null) {
        setOfferData(offerDataResponse.offers);
      }
    };

    if (authCtx.authState.idToken && companyId) {
      fetchOfferData();
    }
  }, [authCtx.authState.idToken, companyId]);

  useEffect(() => {
    if (adverts.length && companyData && offerData?.length) {
      setIsLoading(false);
    }
  }, [adverts, companyData, offerData]);

  // Pill Filtering
  const [filterType, setFilterType] = useState<CompanyPageFilterOptions>(companyPageFilterAllLabel);

  const filteredOffers =
    offerData && filterType === companyPageFilterAllLabel
      ? offerData
      : offerData?.filter((offer: OfferData) => offer.type === filterType);

  const enabledFilters = offerData
    ? offerData
        .map((offer: OfferData) => offer.type)
        .filter((value: string, index: number, array: string[]) => array.indexOf(value) === index)
    : [];

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

      {errorMessage && <CompanyPageError message={errorMessage} />}

      <Container
        className="desktop:mt-16 mobile:mt-[14px]"
        platform={isMobile ? PlatformVariant.MobileHybrid : PlatformVariant.Web}
      >
        {/* About page (ONLY ON WEB), ShareButton and FavouriteButton */}
        <CompanyPageWebHeader
          isMobile={isMobile}
          companyData={companyData}
          companySharedEvent={async () => {
            if (amplitude) {
              await amplitude.trackEventAsync(amplitudeEvents.COMPANY_SHARED_CLICKED, {
                company_id: companyData.id,
                company_name: companyData.name,
              });
            }
          }}
        />
        {!isMobile && (
          <div className="w-full">
            <CompanyAbout
              CompanyDescription={companyData.description}
              platform={PlatformVariant.Web}
            />
          </div>
        )}

        {/* Filters */}
        <CompanyPageFilters
          enabledFilters={enabledFilters}
          onSelected={async (pillType: CompanyPageFilterOptions) => {
            setFilterType(pillType);
            if (amplitude) {
              await amplitude.trackEventAsync(amplitudeEvents.COMPANY_FILTER_CLICKED, {
                company_id: companyData.id,
                company_name: companyData.name,
                filter_name: pillType,
              });
            }
          }}
        />

        {/* Offer cards */}
        <CompanyPageOffers
          offers={filteredOffers || []}
          companyId={companyData?.id}
          companyName={companyData?.name}
          onOfferClick={async (
            offerId: number,
            offerName: string,
            companyId: number,
            companyName: string,
            index: number
          ) => {
            if (amplitude) {
              await amplitude.trackEventAsync(amplitudeEvents.COMPANY_OFFER_CLICKED, {
                company_id: companyData.id,
                company_name: companyData.name,
                position: index,
                offer_id: offerId,
                offer_name: offerName,
              });
            }
          }}
        />

        {/* Adverts (ONLY ON DESKTOP) */}
        {!isMobile && !isLoading && adverts && adverts.length > 0 && (
          <div className="w-full mb-16 tablet:mt-14">
            <div className="grid grid-cols-2 gap-10">
              {adverts.slice(0, 2).map((advert, index) => {
                return (
                  <CampaignCard
                    key={'card-' + index}
                    name={advert.__typename}
                    image={advert.imageSource}
                    linkUrl={advert.link}
                    className="h-[200px]"
                  />
                );
              })}
            </div>
          </div>
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
          <div className="w-full mb-5 mt-4">
            <div className="grid gap-2">
              {adverts.slice(0, 2).map((advert, index) => {
                return (
                  <CampaignCard
                    key={'mobile-card-' + index}
                    name={advert.__typename}
                    image={advert.imageSource}
                    linkUrl={advert.link}
                    className="min-h-[140px]"
                  />
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export const getStaticProps = getI18nStaticProps;

export default withAuthProviderLayout(CompanyPage, {});
