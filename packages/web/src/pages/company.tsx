import { useState, useContext, useEffect, Suspense } from 'react';
import Head from 'next/head';
import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';
import { useMedia } from 'react-use';
import type { PortableTextBlock } from '@portabletext/react';
import { advertQuery } from 'src/graphql/advertQuery';
import { makeQuery } from 'src/graphql/makeQuery';
import { shuffle } from 'lodash';
import { BRAND } from '@/global-vars';
import UserContext from '@/context/User/UserContext';
import {
  Container,
  CompanyAbout,
  PlatformVariant,
  CampaignCard,
  useOfferDetails,
  getCompanyQuery,
} from '@bluelightcard/shared-ui';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import AmplitudeContext from '@/context/AmplitudeContext';
import amplitudeEvents from '@/utils/amplitude/events';
import { logCompanyView } from '@/utils/amplitude/logCompanyView';
import { BRANDS } from '../common/types/brands.enum';
import type { BannerDataType } from '../page-components/company/types';
import CompanyPageWebHeader from '../page-components/company/CompanyPageWebHeader';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useCmsEnabled } from '../common/hooks/useCmsEnabled';
import CompanyPageOffers from '../page-components/company/CompanyPageOffers';
import CompanyPageFilters from '../page-components/company/CompanyPageFilters';
import { ErrorBoundary } from 'react-error-boundary';
import CompanyPageError from '../page-components/company/CompanyPageError';
import LoadingSpinner from '@bluelightcard/shared-ui/components/LoadingSpinner';
import { useRouter } from 'next/router';

const getBrand = () => {
  switch (BRAND) {
    case BRANDS.BLC_UK:
    case BRANDS.BLC_AU:
      return 'Blue Light Card';
    case BRANDS.DDS_UK:
      return 'Defense Discount Service';
  }
};

const CompanyPage = () => {
  const router = useRouter();

  const cid = router.query.cid as string | undefined;

  const isMobile = useMedia('(max-width: 500px)');

  const userCtx = useContext(UserContext);
  const amplitude = useContext(AmplitudeContext);

  const adverts = useQuery({
    queryKey: ['companyPageAdverts', userCtx.isAgeGated ?? true],
    queryFn: async () => {
      const bannerData = await makeQuery(advertQuery(BRAND, userCtx.isAgeGated ?? true));
      const banners = shuffle(bannerData.data.banners).slice(0, 2) as BannerDataType[];
      return banners.map((advert, index) => {
        const splitLink = advert.link.split('cid=');
        const cidSplit = splitLink[1].split('&');
        const cid = cidSplit[0];
        const link = 'https://www.bluelightcard.co.uk/company?cid=' + cid;
        return { ...advert, link };
      });
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const [filter, setFilter] = useState<string | null>(null);

  const { viewOffer } = useOfferDetails();

  async function onSelectOffer(offerId: string, companyId: string, companyName: string) {
    await viewOffer({
      offerId: offerId,
      companyId: companyId,
      companyName: companyName,
      platform: PlatformVariant.Web,
      amplitudeCtx: amplitude,
    });
  }

  return (
    <>
      {cid && (
        <ErrorBoundary fallback={<CompanyPageError message="Failed to load company" />}>
          <Suspense
            fallback={
              <LoadingSpinner
                containerClassName="w-full h-[100vh]"
                spinnerClassName="text-[5em] text-palette-primary dark:text-palette-secondary"
              />
            }
          >
            <Container
              className="desktop:mt-16 mobile:mt-[14px]"
              platform={isMobile ? PlatformVariant.MobileHybrid : PlatformVariant.Web}
            >
              <Header companyId={cid} isMobile={isMobile} />
              {/* Filters */}
              <CompanyPageFilters value={filter} companyId={cid} onChange={setFilter} />

              <CompanyPageOffers
                filter={filter}
                isMobile={isMobile}
                companyId={cid}
                onOfferClick={onSelectOffer}
              />

              {/* Offer cards */}

              {/* Adverts (ONLY ON DESKTOP) */}
              {!isMobile && adverts.isSuccess && adverts.data.length > 0 && (
                <div className="w-full mb-16 tablet:mt-14">
                  <div className="grid grid-cols-2 gap-10">
                    {adverts.data.slice(0, 2).map((advert, index) => {
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
              {isMobile && <MobileAbout companyId={cid} />}

              {/* Adverts (ONLY ON MOBILE RESPONSIVE - since it is positioned after the company about section) */}
              {isMobile && adverts.isSuccess && adverts.data?.length > 0 && (
                <div className="w-full mb-5 mt-4">
                  <div className="grid gap-2">
                    {adverts.data?.slice(0, 2).map((advert, index) => {
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
            <SheetHandler companyId={cid} onSelectOffer={onSelectOffer} />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
};

const MobileAbout = ({ companyId }: { companyId: string }) => {
  const cmsEnabled = useCmsEnabled();

  const company = useSuspenseQuery(getCompanyQuery(companyId, cmsEnabled));

  return (
    <div className="my-4">
      <CompanyAbout
        CompanyName={`About ${company.data.name}`}
        CompanyDescription={company.data.description}
        platform={PlatformVariant.MobileHybrid}
      />
    </div>
  );
};

const Header = ({ isMobile, companyId }: { isMobile: boolean; companyId: string }) => {
  const amplitude = useContext(AmplitudeContext);
  const userCtx = useContext(UserContext);
  const cmsEnabled = useCmsEnabled();
  const router = useRouter();

  const company = useSuspenseQuery(getCompanyQuery(companyId, cmsEnabled));

  useEffect(() => {
    const handleCompanyView = (eventSource: string, companyId: string, companyName: string) => {
      logCompanyView({
        amplitude,
        userUuid: userCtx.user?.uuid,
        eventSource,
        origin: router.pathname,
        companyId,
        companyName,
      });
    };

    if (company.data && userCtx.user?.uuid) {
      handleCompanyView('companyPage', company.data.id, company.data.name);
    }
  }, [company.data, userCtx.user?.uuid, amplitude, router.pathname]);

  return (
    <>
      <Head>
        <title>
          {company.data?.name} offers | {getBrand()}
        </title>
        <meta
          name="description"
          content={`Some of the latest discount offers from ${company.data?.name}`}
        />
      </Head>
      {/* About page (ONLY ON WEB), ShareButton and FavouriteButton */}
      <CompanyPageWebHeader
        isMobile={isMobile}
        companyId={company.data.id}
        companyDescription={company.data.description}
        companySharedEvent={() => {
          if (amplitude) {
            amplitude.trackEventAsync(amplitudeEvents.COMPANY_SHARED_CLICKED, {
              company_id: company.data?.id,
              company_name: company.data?.name,
            });
          }
        }}
      />
      {!isMobile && (
        <div className="w-full">
          <CompanyAbout
            CompanyName={company.data.name}
            CompanyDescription={company.data.description as PortableTextBlock}
            platform={PlatformVariant.Web}
          />
        </div>
      )}
    </>
  );
};

type SheetHandlerProps = {
  companyId: string;
  onSelectOffer: (offerId: string, companyId: string, companyName: string) => void;
};

const SheetHandler = ({ companyId, onSelectOffer }: SheetHandlerProps) => {
  const cmsEnabled = useCmsEnabled();

  const router = useRouter();
  const oid = router.query.oid as string | undefined;

  const company = useSuspenseQuery(getCompanyQuery(companyId, cmsEnabled));

  useEffect(() => {
    if (oid && oid !== 'null') {
      onSelectOffer(oid, company.data.id, company.data.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oid, companyId]);

  return null;
};

export const getStaticProps = getI18nStaticProps;

export default withAuthProviderLayout(CompanyPage, {});
