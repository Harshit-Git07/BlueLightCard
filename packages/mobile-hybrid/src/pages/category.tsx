import { ErrorBoundary } from 'react-error-boundary';
import {
  OfferCardList,
  useOfferDetails,
  usePlatformAdapter,
  ErrorState,
  Offer,
  Button,
  Container,
  AmplitudeEvents,
  ThemeVariant,
  Heading,
} from '@bluelightcard/shared-ui';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FC, Suspense, useRef, useState } from 'react';
import ContentLoader from 'react-content-loader';

import { BRAND, CATEGORY_PAGE_SIZE } from '@/globals';
import useCategoryData from '@/hooks/useCategoryData';
import { useSetAtom } from 'jotai';
import { spinner } from '@/modules/Spinner/store';

const Skeleton: FC = () => {
  return (
    <div className="w-full max-w-screen-lg mx-auto px-5">
      <ContentLoader
        speed={2}
        viewBox="0 0 300 60"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        className="w-full"
      >
        {/* Description Lines */}
        <rect x="30%" y="20" rx="3" ry="3" width="40%" height="20" />
      </ContentLoader>

      <OfferCardList
        offers={[]}
        columns={1}
        variant="horizontal"
        status="loading"
        onOfferClick={() => {}}
      />
    </div>
  );
};

const PaginatedContent: FC = () => {
  const router = useRouter();
  const platformAdapter = usePlatformAdapter();
  const { viewOffer } = useOfferDetails();

  const categoryViewLogged = useRef<string>('');
  const [page, setPage] = useState(1);
  const [previousOffers, setPreviousOffers] = useState<Offer[]>([]);

  const categoryId = String(router.query.id);

  const { data: categoryData, isSuccess } = useCategoryData(categoryId, page, CATEGORY_PAGE_SIZE);

  // only log a page view once when data has loaded
  if (
    isSuccess &&
    categoryData.id &&
    categoryData.name &&
    categoryViewLogged.current !== categoryId
  ) {
    categoryViewLogged.current = categoryId;
    platformAdapter.logAnalyticsEvent(AmplitudeEvents.CATEGORY.PAGE_VIEWED, {
      category_id: categoryData.id,
      category_title: categoryData.name,
      brand: BRAND,
    });
  }

  const onLoadButtonClick = () => {
    setPreviousOffers((existingOffers) => existingOffers.concat(categoryData.data));
    setPage(page + 1);
  };

  const onOfferClick = (offer: Offer) => {
    platformAdapter.logAnalyticsEvent(AmplitudeEvents.CATEGORY.CARD_CLICKED, {
      brand: BRAND,
      category_id: categoryData.id,
      category_title: categoryData.name,
      company_name: offer.companyName,
      company_id: offer.companyID,
      offer_name: offer.offerName,
      offer_id: offer.offerID,
    });

    viewOffer({
      offerId: offer.offerID,
      companyId: offer.companyID,
      companyName: offer.companyName,
      platform: platformAdapter.platform,
    });
  };

  return (
    <Container className="py-6 mb-0" nestedClassName="mx-0 px-0 flex flex-col gap-4">
      <div className="py-1 flex flex-row justify-between items-center">
        <Heading
          headingLevel={'h2'}
          className="!text-colour-onSurface dark:!text-colour-onSurface-dark !font-typography-title-medium-semibold !font-typography-title-medium-semibold-weight !text-typography-title-medium-semibold !tracking-typography-title-medium-semibold w-full !leading-typography-title-medium-semibold text-center w-full text-center !mb-0"
        >
          {categoryData.name}
        </Heading>
      </div>
      <OfferCardList
        status="success"
        onOfferClick={onOfferClick}
        variant="horizontal"
        offers={[...previousOffers, ...categoryData.data]}
      />
      {page < categoryData.meta?.totalPages && (
        <div className="text-center">
          <Button variant={ThemeVariant.Secondary} onClick={onLoadButtonClick}>
            Load more
          </Button>
        </div>
      )}
    </Container>
  );
};

const CategoryOffersPage: NextPage = () => {
  const router = useRouter();
  const setSpinner = useSetAtom(spinner);

  setSpinner(false);

  if (!router.isReady) return <Skeleton />;

  return (
    <ErrorBoundary fallback={<ErrorState page="category" />}>
      <Suspense fallback={<Skeleton />}>
        <PaginatedContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CategoryOffersPage;
