import BrowseCategories from '@/components/BrowseCategories/BrowseCategories';
import InvokeNativeNavigation from '@/invoke/navigation';
import BrowseCategoriesData from '@/data/BrowseCategories';
import { NextPage } from 'next';
import { useEffect, useMemo } from 'react';
import { faLocationDot, faTag } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import SearchModule from '@/modules/search';
import { spinner } from '@/modules/Spinner/store';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import useDeeplinkRedirect from '@/hooks/useDeeplinkRedirect';
import Amplitude from '@/components/Amplitude/Amplitude';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';

const navigation = new InvokeNativeNavigation();

const SearchPage: NextPage = () => {
  const router = useRouter();
  const setSpinner = useSetAtom(spinner);

  useDeeplinkRedirect();

  useEffect(() => {
    if (router.isReady && !router.query?.deeplink) {
      setSpinner(false);
    }
  }, [router.isReady, router.query?.deeplink, setSpinner]);

  const browseCategories = useMemo(() => {
    return BrowseCategoriesData.map((category) => ({
      id: category.id,
      text: category.text,
    }));
  }, []);

  const onCategoryClick = (categoryId: number) => {
    router.push(`/categories?category=${categoryId}`);
  };

  return (
    <div>
      <SearchModule placeholder="Search for an offer" />
      <div className="mt-4 mb-5 ml-2">
        <Amplitude keyName={FeatureFlags.SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK} value="on">
          <button
            className="font-museo pl-3 py-2 block text-primary-dukeblue-700 dark:text-primary-vividskyblue-700 text-md w-full h-full text-left"
            onClick={() => navigation.navigate('/mapsearch.php')}
          >
            <FontAwesomeIcon
              icon={faLocationDot}
              size="xl"
              className="pr-3 cursor-pointer text-primary-dukeblue-700 dark:text-primary-vividskyblue-700"
              aria-hidden="true"
            />
            Offers near you
          </button>
        </Amplitude>
        <Amplitude keyName={FeatureFlags.SEARCH_START_PAGE_BRANDS_LINK} value="on">
          <Link
            href={'/'}
            className="font-museo pl-3 py-2 text-primary-dukeblue-700 dark:text-primary-vividskyblue-700 text-md w-full inline-block text-left"
          >
            <FontAwesomeIcon
              icon={faTag}
              size="xl"
              className="pr-2.5 cursor-pointer text-primary-dukeblue-700 dark:text-primary-vividskyblue-700"
              aria-hidden="true"
            />
            Search for brands
          </Link>
        </Amplitude>
      </div>
      <Amplitude keyName={FeatureFlags.SEARCH_START_PAGE_CATEGORIES_LINKS} value="on">
        <BrowseCategories categories={browseCategories} onCategoryClick={onCategoryClick} />
      </Amplitude>
    </div>
  );
};

export default SearchPage;
