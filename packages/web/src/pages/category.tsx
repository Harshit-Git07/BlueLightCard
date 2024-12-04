import { FC, Suspense, useRef, useState } from 'react';
import { NextPage } from 'next';
import { ErrorBoundary } from 'react-error-boundary';
import {
  AmplitudeEvents,
  ErrorState,
  MenuCarousels,
  Offer,
  OfferCardList,
  OfferEventHandler,
  PaginatedCategoryData,
  PaginationControls,
  Typography,
  useMobileMediaQuery,
  useOfferDetails,
  usePlatformAdapter,
} from '@bluelightcard/shared-ui';
import { AmplitudeExperimentFlags } from '../common/utils/amplitude/AmplitudeExperimentFlags';
import { useRouter } from 'next/router';
import { BRAND } from '@/root/global-vars';
import ContentLoader from 'react-content-loader';
import Container from '@/components/Container/Container';
import TenancyBanner from '../common/components/TenancyBanner';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import useCategoryData from '@/hooks/useCategoryData';
import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';

const CategorySkeleton: FC = () => {
  const isMobile = useMobileMediaQuery();
  const viewBox = '0 0 300 10';

  return (
    <>
      <ContentLoader
        speed={3}
        viewBox={viewBox}
        backgroundColor="#f3f3f3"
        foregroundColor="#d1d1d1"
        style={{ width: '100%' }}
      >
        <rect className="h-6 w-full tablet:w-16 tablet:h-2" />
      </ContentLoader>

      <OfferCardList
        offers={[]}
        columns={isMobile ? 1 : 3}
        variant={isMobile ? 'horizontal' : 'vertical'}
        status="loading"
        onOfferClick={() => {}}
      />
    </>
  );
};

type CategoryContentProps = {
  categoryId: string;
  onCategoryView(category: PaginatedCategoryData): void;
  onOfferClick(category: PaginatedCategoryData): OfferEventHandler;
};

const CategoryContent: FC<CategoryContentProps> = ({
  categoryId,
  onCategoryView,
  onOfferClick,
}) => {
  const categoryViewLogged = useRef<string>('');
  const isMobile = useMobileMediaQuery();

  const [page, setPage] = useState(1);
  const pageSize = isMobile ? 6 : 12;

  const { data, isSuccess } = useCategoryData(categoryId, page, pageSize);

  // only log a page view once when data has loaded
  if (isSuccess && data.id && data.name && categoryViewLogged.current !== categoryId) {
    categoryViewLogged.current = categoryId;
    onCategoryView(data);
  }

  return (
    <>
      <Typography className="mb-3" variant="headline-bold">
        {data.name}
      </Typography>

      <OfferCardList
        offers={data.data}
        columns={isMobile ? 1 : 3}
        variant={isMobile ? 'horizontal' : 'vertical'}
        status="success"
        onOfferClick={onOfferClick(data)}
      />

      <PaginationControls
        currentPage={page}
        totalPages={data.meta.totalPages}
        onPageChange={setPage}
      />
    </>
  );
};

const CategoryPage: NextPage = () => {
  const platformAdapter = usePlatformAdapter();
  const router = useRouter();
  const { viewOffer } = useOfferDetails();

  if (!router.isReady) return;

  const categoryId = String(router.query.id);

  const cmsOffersFlag = platformAdapter.getAmplitudeFeatureFlag(
    AmplitudeExperimentFlags.CMS_OFFERS
  );
  const useLegacyIds = cmsOffersFlag !== 'on';

  const onCategoryView = (category: PaginatedCategoryData) => {
    platformAdapter.logAnalyticsEvent(AmplitudeEvents.CATEGORY.PAGE_VIEWED, {
      category_id: category.id,
      category_title: category.name,
      brand: BRAND,
    });
  };

  const onOfferClick = (offer: Offer) => {
    const offerId = useLegacyIds && offer.legacyOfferID ? offer.legacyOfferID : offer.offerID;
    const companyId =
      useLegacyIds && offer.legacyCompanyID ? offer.legacyCompanyID : offer.companyID;

    viewOffer({
      offerId,
      companyId,
      companyName: offer.companyName,
      platform: platformAdapter.platform,
    });
  };

  const onCategoryOfferClick = (category: PaginatedCategoryData) => (offer: Offer) => {
    const offerId = useLegacyIds && offer.legacyOfferID ? offer.legacyOfferID : offer.offerID;
    const companyId =
      useLegacyIds && offer.legacyCompanyID ? offer.legacyCompanyID : offer.companyID;

    platformAdapter.logAnalyticsEvent(AmplitudeEvents.CATEGORY.CARD_CLICKED, {
      category_id: category.id,
      category_title: category.name,
      brand: BRAND,
      company_name: offer.companyName,
      company_id: companyId,
      offer_name: offer.offerName,
      offer_id: offerId,
    });

    onOfferClick(offer);
  };

  const onFeaturedOfferClick = (offer: Offer) => {
    const offerId = useLegacyIds && offer.legacyOfferID ? offer.legacyOfferID : offer.offerID;
    const companyId =
      useLegacyIds && offer.legacyCompanyID ? offer.legacyCompanyID : offer.companyID;

    platformAdapter.logAnalyticsEvent(AmplitudeEvents.FEATURED_OFFERS.CARD_CLICKED, {
      page: router.asPath,
      brand: BRAND,
      company_name: offer.companyName,
      company_id: companyId,
      offer_name: offer.offerName,
      offer_id: offerId,
    });

    onOfferClick(offer);
  };

  return (
    <Container
      className="py-0 mb-0 laptop:py-6"
      nestedClassName="mx-0 px-0 laptop:mx-auto laptop:px-5 flex flex-col gap-6"
    >
      <ErrorBoundary key={categoryId} fallback={<ErrorState page="flexi_menu" />}>
        <Suspense fallback={<CategorySkeleton />}>
          <CategoryContent
            categoryId={categoryId}
            onCategoryView={onCategoryView}
            onOfferClick={onCategoryOfferClick}
          />
        </Suspense>

        <MenuCarousels menus={['featured']}>
          <MenuCarousels.FeaturedOffers onOfferClick={onFeaturedOfferClick} />
        </MenuCarousels>

        <div>
          <TenancyBanner title="category_bottom_banner" variant="small" />
        </div>
      </ErrorBoundary>
    </Container>
  );
};

export const getStaticProps = getI18nStaticProps;

export default withAuthProviderLayout(CategoryPage, true);
