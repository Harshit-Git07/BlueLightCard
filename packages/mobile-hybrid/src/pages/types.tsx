import List from '@/modules/List/List';
import { ListVariant } from '@/modules/List/types';
import { NextPage } from 'next';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { spinner } from '@/modules/Spinner/store';
import { useSetAtom } from 'jotai';
import BrowseTypesData from '@/data/BrowseTypes';

const TypesPage: NextPage = () => {
  const router = useRouter();
  const typesQueryParam = router.query.type ? Number(router.query.type) : undefined;
  const setSpinner = useSetAtom(spinner);

  const onBack = useCallback(() => {
    router.push(`/search`);
  }, [router]);

  const isValidTypeId = useMemo(() => {
    return BrowseTypesData.find((item) => item.id === typesQueryParam);
  }, [typesQueryParam]);

  useEffect(() => {
    if (typesQueryParam && isValidTypeId) {
      setSpinner(true);
    }
  }, [typesQueryParam, setSpinner, isValidTypeId]);

  useEffect(() => {
    if (typesQueryParam && !isValidTypeId) {
      router.push('/search');
    }
  }, [typesQueryParam, isValidTypeId, router]);

  return (
    <div className="px-4 py-6">
      <button aria-label="Back button" className="mb-10" type="button" onClick={onBack}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="xl"
          className="text-primary-dukeblue-600 dark:text-neutral-white"
          aria-hidden="true"
        />
      </button>
      {typesQueryParam && isValidTypeId && (
        <List listVariant={ListVariant.Types} entityId={typesQueryParam} />
      )}
    </div>
  );
};

export default TypesPage;
