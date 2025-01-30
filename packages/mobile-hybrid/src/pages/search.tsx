import BrowseCategories from '@/components/BrowseCategories/BrowseCategories';
import InvokeNativeNavigation from '@/invoke/navigation';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { faLocationDot, faTag } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import SearchModule from '@/modules/search';
import { spinner } from '@/modules/Spinner/store';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import useDeeplinkRedirect from '@/hooks/useDeeplinkRedirect';
import Amplitude from '@/components/Amplitude/Amplitude';
import { FeatureFlags, Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import TrendingSearches from '@/components/TrendingSearches/TrendingSearches';
import TrendingSearchesData from '@/data/TrendingSearches';
import { useAmplitude } from '@/hooks/useAmplitude';
import { SimpleCategoryData, usePlatformAdapter } from '@bluelightcard/shared-ui';

const navigation = new InvokeNativeNavigation();

const SearchPage: NextPage = () => {
  const router = useRouter();
  const platformAdapter = usePlatformAdapter();
  const setSpinner = useSetAtom(spinner);

  useDeeplinkRedirect();

  useEffect(() => {
    if (router.isReady && !router.query?.deeplink) {
      setSpinner(false);
    }
  }, [router.isReady, router.query?.deeplink, setSpinner]);

  const onCategoryClick = (category: SimpleCategoryData) => {
    platformAdapter.navigate(`/category?id=${category.id}`);
  };

  const onSearchTermClick = (term: string) => {
    router.push(`/searchresults?search=${term}`);
  };

  const { is } = useAmplitude();

  return (
    <div>
      <SearchModule placeholder="Search for an offer" />
      <div
        className={
          is(Experiments.TRENDING_SEARCHES, 'treatment') ? 'mt-4 mb-4 ml-2' : 'mt-4 mb-5 ml-2'
        }
      >
        <Amplitude keyName={FeatureFlags.SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK} value="on">
          <button
            className="pl-3 py-2 block text-colour-primary-light dark:text-colour-primary-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body w-full h-full text-left"
            onClick={() => navigation.navigate('/mapsearch.php')}
          >
            <FontAwesomeIcon
              icon={faLocationDot}
              size="xl"
              className="pr-3 cursor-pointer text-colour-primary-light dark:text-colour-primary-dark"
              aria-hidden="true"
            />
            Offers near you
          </button>
        </Amplitude>
        <Amplitude keyName={FeatureFlags.SEARCH_START_PAGE_BRANDS_LINK} value="on">
          <Link
            href={'/'}
            className="pl-3 py-2 text-colour-primary-light dark:text-colour-primary-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body w-full inline-block text-left"
          >
            <FontAwesomeIcon
              icon={faTag}
              size="xl"
              className="pr-2.5 cursor-pointer text-colour-primary-light dark:text-colour-primary-dark"
              aria-hidden="true"
            />
            Search for brands
          </Link>
        </Amplitude>
      </div>
      <Amplitude keyName={Experiments.TRENDING_SEARCHES} value="treatment">
        <div className="flex pb-4 mx-5">
          <hr className="w-full" />
        </div>
        <TrendingSearches trendingSearches={TrendingSearchesData} onTermClick={onSearchTermClick} />
      </Amplitude>

      <Amplitude keyName={FeatureFlags.MODERN_CATEGORIES_HYBRID} value="on">
        {is(Experiments.TRENDING_SEARCHES, 'treatment') && (
          <div className="flex py-4 mx-5">
            <hr className="w-full" />
          </div>
        )}

        <BrowseCategories onCategoryClick={onCategoryClick} />
      </Amplitude>
    </div>
  );
};

export default SearchPage;
