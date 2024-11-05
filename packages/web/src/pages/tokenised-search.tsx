import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import React, { useContext, useEffect } from 'react';

import { makeQuery } from 'src/graphql/makeQuery';

import { AMPLITUDE_EXPERIMENT_REDEMPTION_VAULT_WEB, BRAND } from '@/global-vars';
import { advertQuery } from 'src/graphql/advertQuery';

import AuthContext from '@/context/Auth/AuthContext';
import UserContext from '@/context/User/UserContext';
import getCDNUrl from '@/utils/getCDNUrl';
import OfferCardPlaceholder from '@/offers/components/OfferCard/OfferCardPlaceholder';
import { makeSearch, SearchOfferType } from '@/utils/API/makeSearch';
import {
  logSearchCardClicked,
  logSearchCategoryEvent,
  logSearchPage,
  logSerpSearchStarted,
} from '@/utils/amplitude';
import { shuffle } from 'lodash';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import BannerCarousel from '@/components/BannerCarousel/BannerCarousel';
import SearchEmptyState from '@/page-components/SearchEmptyState/SearchEmptyState';
import Container from '@/components/Container/Container';
import { getOffersByCategoryUrl } from '@/utils/externalPageUrls';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import {
  Heading,
  PillGroup,
  PlatformVariant,
  ResponsiveOfferCard,
  useOfferDetails,
  usePlatformAdapter,
} from '@bluelightcard/shared-ui';
import AmplitudeContext from '../common/context/AmplitudeContext';
import { z } from 'zod';
import useFetchCompaniesOrCategories from '../common/hooks/useFetchCompaniesOrCategories';
import { isCategorySelected } from '@/page-components/SearchDropDown/isCategorySelected';
import { experimentMakeSearch } from '@/utils/API/experimentMakeSearch';
import { darkRead } from '@bluelightcard/shared-ui/utils/darkRead/darkRead';

const he = require('he');

type BannerDataType = {
  imageSource: string;
  link: string;
};

const onSearchCategoryChange = async (categoryId: string, categoryName: string) => {
  await logSearchCategoryEvent(categoryId, categoryName);
  window.location.href = getOffersByCategoryUrl(categoryId);
};

const onSearchCardClick = async (
  companyId: number | string,
  companyName: string,
  offerId: number | string,
  offerName: string,
  searchTerm: string,
  numberOfResults: number,
  searchResultNumber: number
) => {
  await logSearchCardClicked(
    companyId,
    companyName,
    offerId,
    offerName,
    searchTerm,
    numberOfResults,
    searchResultNumber
  );
};

export const TokenisedSearch: NextPage = () => {
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

  const categoryLevelThreeSearchExperiment = useAmplitudeExperiment(
    'category_level_three_search',
    'control'
  );
  const searchV5Experiment = useAmplitudeExperiment('search_v5', 'control');
  const offersCmsExperiment = useAmplitudeExperiment('cms-offers', 'off');
  const { viewOffer } = useOfferDetails();
  const { categories } = useFetchCompaniesOrCategories(userCtx);
  const platformAdapter = usePlatformAdapter();

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      if (
        !authCtx.authState.idToken ||
        !userCtx.user ||
        !router.isReady ||
        usedQuery === query ||
        cancelled
      ) {
        return;
      }

      setIsLoading(true);

      const currentMakeSearchFunction = async () =>
        makeSearch(
          query,
          authCtx.authState.idToken ?? '',
          // isAgeGated flipped to turn off allowAgeGated, fallback to false if ageGated is not set
          userCtx.isAgeGated !== undefined ? !userCtx.isAgeGated : false,
          userCtx.user?.profile.organisation ?? '',
          categoryLevelThreeSearchExperiment.data?.variantName === 'treatment'
        );

      const experimentMakeSearchFunction = async () =>
        experimentMakeSearch(
          query,
          userCtx.user?.profile.dob ?? '',
          userCtx.user?.profile.organisation ?? '',
          platformAdapter,
          offersCmsExperiment.data?.variantName !== 'on'
        );

      const searchResults = await darkRead(
        {
          darkReadEnabled: searchV5Experiment.data?.variantName === 'dark-read',
          experimentEnabled: searchV5Experiment.data?.variantName === 'treatment',
        },
        currentMakeSearchFunction,
        experimentMakeSearchFunction
      );

      // Abort if this useEffect call has already been cancelled before the query resolved
      if (cancelled) return;

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

      logSearchPage(query, searchResults.results ? searchResults.results.length : 0);
      if (router.query.issuer === 'serp') {
        logSerpSearchStarted(query, searchResults.results ? searchResults.results.length : 0);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [
    authCtx,
    userCtx,
    router.isReady,
    router.query.issuer,
    query,
    categoryLevelThreeSearchExperiment,
    usedQuery,
    searchV5Experiment,
    offersCmsExperiment,
    platformAdapter,
  ]);

  useEffect(() => {
    setQuery((router.query.q as string) ?? '');
  }, [router.query.q]);

  const searchOfferSheetExperiment = useAmplitudeExperiment(
    z.string().parse(AMPLITUDE_EXPERIMENT_REDEMPTION_VAULT_WEB),
    'control'
  );

  const changeCategoryHandler = (category: { id: number; label: string }) => {
    if (!category) return;
    onSearchCategoryChange(category.id.toString(), category.label);
  };

  const getOfferTypeFromIndex = (tagIndex: number) => {
    switch (tagIndex) {
      case 0:
        return 'Online';
      case 2:
        return 'Giftcards';
      case 5:
      case 6:
        return 'In-store';
      default:
        return 'Online';
    }
  };

  return (
    <>
      {/* Search Results */}
      <>
        <Container className="py-[20px]" addBottomHorizontalLine={false}>
          <Heading headingLevel="h1">Search results for: {query}</Heading>
          {error && (
            <Heading headingLevel="h2" className="pt-5">
              {error}
            </Heading>
          )}
        </Container>

        <Container className="py-[20px]" addBottomHorizontalLine={false}>
          {!isLoading && (!searchResults || searchResults.length === 0) && <SearchEmptyState />}

          <div className="grid tablet:grid-cols-2 grid-cols-1 gap-[24px]">
            {isLoading &&
              [...Array(6)].map((_, index) => (
                <OfferCardPlaceholder key={`offer-card-placeholder-${index}`} />
              ))}

            {!isLoading &&
              searchResults &&
              searchResults.length > 0 &&
              searchResults.map((result, index) => {
                const imageSrc = result.offerimg.replaceAll('\\/', '/');
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
                    router.push(`/offerdetails.php?cid=${result.CompID}&oid=${result.ID}`);
                  };
                }

                return (
                  <div key={result.ID}>
                    <ResponsiveOfferCard
                      id={result.ID}
                      type={getOfferTypeFromIndex(result.OfferType)}
                      name={he.decode(result.OfferName)}
                      image={
                        imageSrc !== ''
                          ? imageSrc
                          : getCDNUrl(`/companyimages/complarge/retina/${result.CompID}.jpg`)
                      }
                      companyId={result.CompID}
                      companyName={result.CompanyName}
                      onClick={onOfferCardClick}
                    />
                  </div>
                );
              })}
          </div>
        </Container>

        <Container className="tablet:pt-10" addBottomHorizontalLine={false}>
          <PillGroup
            title={'Browse Categories'}
            pillGroup={categories.map((cat) => ({
              id: Number(cat.id),
              label: cat.name,
              selected: isCategorySelected(cat.id, window.location.pathname),
            }))}
            onSelectedPill={changeCategoryHandler}
          />
        </Container>
      </>

      {/* Adverts */}
      {adverts.length > 0 && (
        <Container addBottomHorizontalLine={false}>
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

export default withAuthProviderLayout(TokenisedSearch, {
  seo: {
    title: 'offers.search.title',
  },
});
