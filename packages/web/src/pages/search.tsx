import Container from '@/components/Container/Container';
import Heading from '@/components/Heading/Heading';
import requireAuth from '@/hoc/requireAuth';
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

const he = require('he');

type BannerDataType = {
  imageSource: string;
  link: string;
};

const Search: NextPage = () => {
  const router = useRouter();
  const queryRaw = router.query.q ?? '';

  const [searchResults, setSearchResults] = React.useState<SearchOfferType[]>([]);

  const [adverts, setAdverts] = React.useState<any[]>([]);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | undefined>();

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Search Query
      const searchResults = await makeSearch(
        queryRaw as string,
        authCtx.authState.idToken ?? '',
        userCtx.isAgeGated ?? true
      );

      if (searchResults.results) {
        setSearchResults(searchResults.results);
      } else {
        setError('An unknown error occurred. Please try again later.');
      }

      // Banner Data
      try {
        let bannerData = await makeQuery(advertQuery(BRAND, userCtx.isAgeGated ?? true));
        setAdverts(bannerData.data.banners as BannerDataType[]);
      } catch (error) {
        setAdverts([]);
      }

      setIsLoading(false);
    };

    if (authCtx.authState.idToken && router.isReady) {
      fetchData();
    }
  }, [queryRaw, authCtx.authState.idToken, userCtx.isAgeGated, router.isReady]);

  return (
    <>
      <Container className="py-5" addBottomHorizontalLine={false}>
        <Heading headingLevel="h1">Search results for: {queryRaw}</Heading>
        {error && (
          <Heading headingLevel="h2" className="pt-5">
            {error}
          </Heading>
        )}
      </Container>

      <Container className="py-5" addBottomHorizontalLine={false}>
        <div className="grid laptop:grid-cols-3 tablet:grid-cols-2 grid-cols-1 space-x-2">
          {isLoading && [...Array(6)].map((_, index) => <OfferCardPlaceholder key={index} />)}
          {!isLoading &&
            searchResults.map((result, index) => {
              const imageSrc = result.offerimg.replaceAll('\\/', '/');
              return (
                <div className="p-2" key={index}>
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
                  />
                </div>
              );
            })}
        </div>
      </Container>

      {adverts.length > 0 && (
        <Container className="py-5" addBottomHorizontalLine={false}>
          <div className="flex flex-col tablet:flex-row justify-center tablet:space-x-6 tablet:space-y-0 space-x-0 space-y-6 relative">
            {adverts.slice(0, 2).map((advert, index) => {
              return (
                <div key={index}>
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

export default withAuthProviderLayout(requireAuth(Search), {});
