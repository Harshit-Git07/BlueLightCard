import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import React, { useContext, useEffect } from 'react';

import OfferCard from '@/offers/components/OfferCard/OfferCard';
import { makeQuery } from 'src/graphql/makeQuery';

import { AMPLITUDE_EXPERIMENT_REDEMPTION_VAULT_WEB, BRAND, CDN_URL } from '@/global-vars';
import { advertQuery } from 'src/graphql/advertQuery';

import AuthContext from '@/context/Auth/AuthContext';
import UserContext from '@/context/User/UserContext';
import getCDNUrl from '@/utils/getCDNUrl';
import OfferCardPlaceholder from '@/offers/components/OfferCard/OfferCardPlaceholder';
import { SearchOfferType, makeSearch } from '@/utils/API/makeSearch';
import { logSearchCardClicked, logSearchPage, logSerpSearchStarted } from '@/utils/amplitude';
import { shuffle } from 'lodash';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import BannerCarousel from '@/components/BannerCarousel/BannerCarousel';
import SearchEmptyState from '@/page-components/SearchEmptyState/SearchEmptyState';
import Container from '@/components/Container/Container';
import Heading from '@/components/Heading/Heading';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { PlatformVariant, useOfferDetails } from '@bluelightcard/shared-ui';
import AmplitudeContext from '../common/context/AmplitudeContext';
import { z } from 'zod';
import { TokenisedSearch } from './tokenised-search';

const he = require('he');

type BannerDataType = {
  imageSource: string;
  link: string;
};

const onSearchCardClick = async (
  companyId: number | string,
  comapanyName: string,
  offerId: number | string,
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
  const amplitude = useContext(AmplitudeContext);

  const searchExperiment = useAmplitudeExperiment('category_level_three_search', 'control');
  const { viewOffer } = useOfferDetails();

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

  const searchOfferSheetExperiment = useAmplitudeExperiment(
    z.string().parse(AMPLITUDE_EXPERIMENT_REDEMPTION_VAULT_WEB),
    'control'
  );

  const useTokenisedSearch = useAmplitudeExperiment('tokenised-search', 'off');

  if (useTokenisedSearch.data?.variantName === 'on') return <TokenisedSearch />;

  return (
    <>
      {/* Search Results */}
      <>
        <Container className="py-5" addBottomHorizontalLine={false}>
          <Heading headingLevel="h1">Search results for: {query}</Heading>
          {error && (
            <Heading headingLevel="h2" className="pt-5">
              {error}
            </Heading>
          )}
        </Container>

        <Container className="py-5" addBottomHorizontalLine={false}>
          {!isLoading && (!searchResults || searchResults.length === 0) && <SearchEmptyState />}

          <div className="grid laptop:grid-cols-3 tablet:grid-cols-2 grid-cols-1">
            {isLoading && [...Array(6)].map((_, index) => <OfferCardPlaceholder key={index} />)}

            {!isLoading &&
              searchResults &&
              searchResults.length > 0 &&
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
                    onTrackSearchAnalytics();
                    await viewOffer({
                      offerId: result.ID as unknown as number,
                      companyId: result.CompID as unknown as number,
                      companyName: result.CompanyName,
                      platform: PlatformVariant.Web,
                      amplitudeCtx: amplitude,
                    });
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
                      offerId={result.ID}
                      companyId={result.CompID}
                      id={'_offer_card_' + index}
                      onClick={onOfferCardClick}
                      hasLink={hasLink}
                    />
                  </div>
                );
              })}
          </div>
        </Container>
      </>
      ){/* Adverts */}
      {adverts.length > 0 && (
        <Container className="tablet:py-5 pb-[44px]" addBottomHorizontalLine={false}>
          <BannerCarousel
            banners={adverts.map((advert, index) => ({
              name: `${index} + 'banner'`,
              image: advert.imageSource,
              linkUrl: advert.link,
            }))}
          />
        </Container>
      )}
    </>
  );
};

export const getStaticProps = getI18nStaticProps;

export default withAuthProviderLayout(Search, {
  seo: {
    title: 'offers.search.title',
  },
});
