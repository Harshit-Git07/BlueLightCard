import Heading from '@/components/Heading/Heading';
import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import React, { useContext, useEffect } from 'react';

import OfferCard from '@/offers/components/OfferCard/OfferCard';
import { makeQuery } from 'src/graphql/makeQuery';

import { BRAND } from '@/global-vars';
import { advertQuery } from 'src/graphql/advertQuery';

import Image from '@/components/Image/Image';
import Link from '@/components/Link/Link';
import AuthContext from '@/context/Auth/AuthContext';
import UserContext from '@/context/User/UserContext';
import getCDNUrl from '@/utils/getCDNUrl';
import OfferCardPlaceholder from '@/offers/components/OfferCard/OfferCardPlaceholder';
import { SearchOfferType, makeSearch } from '@/utils/API/makeSearch';
import {
  logSearchCategoryEvent,
  logSearchCardClicked,
  logSearchCompanyEvent,
  logSearchPage,
  logSearchTermEvent,
  logSerpSearchStarted,
} from '@/utils/amplitude';
import { shuffle } from 'lodash';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import { default as HeaderV2 } from '@/components/HeaderV2/Header';
import Header from '@/components/Header/Header';
import {
  getCompanyOfferDetailsUrl,
  getOffersByCategoryUrl,
  getOffersBySearchTermUrl,
} from '@/utils/externalPageUrls';
import {
  useAmplitudeExperiment,
  useAmplitudeExperimentComponent,
} from '@/context/AmplitudeExperiment';
import { useOfferSheetControls } from '@/context/OfferSheet/hooks';
import Container from '@/components/Container/Container';
import { getRedemptionDetails } from '../common/utils/API/getRedemptionDetails';

const he = require('he');

type BannerDataType = {
  imageSource: string;
  link: string;
};

// Header
const onSearchCompanyChange = async (companyId: string, company: string) => {
  await logSearchCompanyEvent(companyId, company);
  window.location.href = getCompanyOfferDetailsUrl(companyId);
};

const onSearchCategoryChange = async (categoryId: string, categoryName: string) => {
  await logSearchCategoryEvent(categoryId, categoryName);
  window.location.href = getOffersByCategoryUrl(categoryId);
};

const onSearchTerm = async (searchTerm: string) => {
  await logSearchTermEvent(searchTerm);
  window.location.href = getOffersBySearchTermUrl(searchTerm);
};

const onSearchCardClick = async (
  companyId: number,
  comapanyName: string,
  offerId: number,
  offerName: string,
  searchTerm: string,
  numberOfResults: number,
  searchResultNumber: number
) => {
  await logSearchCardClicked(
    companyId,
    comapanyName,
    offerId,
    offerName,
    searchTerm,
    numberOfResults,
    searchResultNumber
  );
};

const Search: NextPage = () => {
  const router = useRouter();

  const [query, setQuery] = React.useState<string>((router.query.q as string) ?? '');
  const [usedQuery, setUsedQuery] = React.useState<string>('');
  const [searchResults, setSearchResults] = React.useState<SearchOfferType[]>([]);

  const [adverts, setAdverts] = React.useState<any[]>([]);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | undefined>();

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  const searchExperiment = useAmplitudeExperiment('category_level_three_search', 'control');
  const offerSheetControls = useOfferSheetControls();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Search Query
      const searchResults = await makeSearch(
        query,
        authCtx.authState.idToken ?? '',
        // isAgeGated flipped to turn off allowAgeGated, fallback to false if ageGated is not set
        userCtx.isAgeGated !== undefined ? !userCtx.isAgeGated : false,
        userCtx.user?.profile.organisation ?? '',
        searchExperiment.data?.variantName === 'treatment'
      );

      if (searchResults.results) {
        setSearchResults(searchResults.results);
        setUsedQuery(query);
      } else {
        setError('An unknown error occurred. Please try again later.');
      }

      // Banner Data
      try {
        let bannerData = await makeQuery(advertQuery(BRAND, userCtx.isAgeGated ?? true));
        setAdverts(shuffle(bannerData.data.banners).slice(0, 2) as BannerDataType[]);
      } catch (error) {
        setAdverts([]);
      }

      setIsLoading(false);

      logSearchPage(query as string, searchResults.results ? searchResults.results.length : 0);
      if (router.query.issuer === 'serp') {
        logSerpSearchStarted(
          query as string,
          searchResults.results ? searchResults.results.length : 0
        );
      }
    };

    if (authCtx.authState.idToken && Boolean(userCtx.user) && router.isReady) {
      if (usedQuery !== query) {
        fetchData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCtx.authState.idToken, userCtx.isAgeGated, userCtx.user, router.isReady, query]);

  useEffect(() => {
    setQuery((router.query.q as string) ?? '');
  }, [router.query.q]);

  // Serp Experiment
  const control = () => (
    <Header
      loggedIn={authCtx.isUserAuthenticated()}
      onSearchCompanyChange={onSearchCompanyChange}
      onSearchCategoryChange={onSearchCategoryChange}
      onSearchTerm={onSearchTerm}
    />
  );
  const treatment = () => <HeaderV2 loggedIn />;

  const serpExperiment = useAmplitudeExperimentComponent(
    'serp-search-bar',
    { control, treatment },
    'control'
  );

  // Offer Sheet Experiment
  const searchOfferSheetExperiment = useAmplitudeExperiment(
    'offer-sheet-redeem-vault-search-and-homepage',
    'control'
  );

  return (
    <>
      {/* Header */}
      {serpExperiment.data?.component ?? control()}

      {/* Search Results */}
      <Container className="py-5" addBottomHorizontalLine={false}>
        <Heading headingLevel="h1">Search results for: {query}</Heading>
        {error && (
          <Heading headingLevel="h2" className="pt-5">
            {error}
          </Heading>
        )}
      </Container>

      <Container className="py-5" addBottomHorizontalLine={false}>
        <div className="grid laptop:grid-cols-3 tablet:grid-cols-2 grid-cols-1">
          {isLoading && [...Array(6)].map((_, index) => <OfferCardPlaceholder key={index} />)}
          {!isLoading &&
            searchResults.map((result, index) => {
              const imageSrc = result.offerimg.replaceAll('\\/', '/');
              let hasLink = true;
              let onOfferCardClick = undefined;
              const onTrackSearchAnalytics = () => {
                onSearchCardClick(
                  result.CompID,
                  result.CompanyName,
                  result.ID,
                  result.OfferName,
                  query,
                  searchResults.length,
                  index + 1
                );
              };
              if (searchOfferSheetExperiment.data?.variantName === 'treatment') {
                hasLink = false;
                onOfferCardClick = async () => {
                  const getRedemptionType = await getRedemptionDetails(
                    Number(result.ID),
                    authCtx.authState.idToken
                  );
                  onTrackSearchAnalytics();
                  if (getRedemptionType === 'vault') {
                    offerSheetControls.open({
                      offerId: result.ID as unknown as string,
                      companyId: result.CompID as unknown as string,
                      companyName: result.CompanyName,
                    });
                  } else {
                    router.push(`/offerdetails.php?cid=${result.CompID}&oid=${result.ID}`);
                  }
                };
              } else {
                onOfferCardClick = () => {
                  onTrackSearchAnalytics();
                };
              }
              return (
                <div className="p-2 m-2" key={index}>
                  <OfferCard
                    companyName={result.CompanyName}
                    offerName={he.decode(result.OfferName)}
                    imageSrc={
                      imageSrc !== ''
                        ? imageSrc
                        : getCDNUrl(`/companyimages/complarge/retina/${result.CompID}.jpg`)
                    }
                    alt={''}
                    offerLink={`/offerdetails.php?cid=${result.CompID}&oid=${result.ID}`}
                    offerTag={result.OfferType}
                    withBorder
                    offerId={result.ID.toString()}
                    companyId={result.CompID.toString()}
                    id={'_offer_card_' + index}
                    onClick={onOfferCardClick}
                    hasLink={hasLink}
                  />
                </div>
              );
            })}
        </div>
      </Container>

      {/* Adverts */}
      {adverts.length > 0 && (
        <Container className="py-5" addBottomHorizontalLine={false}>
          <div className="grid grid-cols-1 tablet:grid-cols-2 relative">
            {adverts.map((advert, index) => {
              return (
                <div key={index} className="m-2">
                  <Link href={advert.link}>
                    <Image
                      key={index}
                      src={advert.imageSource}
                      alt="advert"
                      responsive
                      className="object-contain !relative"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </Container>
      )}
    </>
  );
};

export const getStaticProps = getI18nStaticProps;

export default withAuthProviderLayout(Search, {
  headerOverride: <></>,
  seo: {
    title: 'offers.search.title',
  },
});
