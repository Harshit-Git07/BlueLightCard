import List from '@/modules/List/List';
import { ListVariant } from '@/modules/List/types';
import { NextPage } from 'next';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { spinner } from '@/modules/Spinner/store';
import { useSetAtom } from 'jotai';

const TypesPage: NextPage = () => {
  const onBackButtonClick = () => {
    window.history.back();
  };

  const router = useRouter();
  const typesQueryParam = router.query.type ? Number(router.query.type) : undefined;
  const setSpinner = useSetAtom(spinner);

  useEffect(() => {
    if (typesQueryParam) {
      setSpinner(true);
      return;
    }
  }, [typesQueryParam, setSpinner]);
  return (
    <div className="px-4 py-6">
      <button aria-label="Back button" className="mb-10" type="button" onClick={onBackButtonClick}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="xl"
          className="text-primary-dukeblue-600 dark:text-neutral-white"
          aria-hidden="true"
        />
      </button>
      {typesQueryParam && <List listVariant={ListVariant.Types} entityId={typesQueryParam} />}
    </div>
  );
};

export default TypesPage;
