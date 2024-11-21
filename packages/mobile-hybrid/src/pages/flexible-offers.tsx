import useFlexibleOffersData from '@/hooks/useFlexibleOffersData';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Container,
  OfferCardList,
  Typography,
  useOfferDetails,
  usePlatformAdapter,
  ErrorState,
  Offer,
  AmplitudeEvents,
} from '@bluelightcard/shared-ui';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, Suspense, useEffect } from 'react';
import ContentLoader from 'react-content-loader';

import { BRAND } from '@/globals';

const FlexibleOffersSkeleton: FC = () => {
  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <ContentLoader
        speed={2}
        viewBox="0 0 400 400"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        className="w-full"
      >
        {/* Banner Image */}
        <rect x="0" y="0" rx="3" ry="3" width="100%" height="167" />

        {/* Title */}
        <rect x="10" y="190" rx="3" ry="3" width="70%" height="23" />

        {/* Description Lines */}
        <rect x="10" y="230" rx="3" ry="3" width="100%" height="9" />
        <rect x="10" y="250" rx="3" ry="3" width="80%" height="9" />
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

const FlexibleOffersContent: FC = () => {
  const router = useRouter();
  const platformAdapter = usePlatformAdapter();
  const { viewOffer } = useOfferDetails();
  const flexibleMenuId = String(router.query.id);
  const { data: flexibleOfferData } = useFlexibleOffersData(flexibleMenuId);

  const offers = flexibleOfferData.offers;

  useEffect(() => {
    platformAdapter.logAnalyticsEvent(AmplitudeEvents.FLEXIBLE_OFFERS.PAGE_VIEWED, {
      flexi_menu_id: flexibleOfferData.id,
      flexi_menu_title: flexibleOfferData.title,
      brand: BRAND,
    });
  }, [flexibleOfferData, platformAdapter]);

  const onOfferClick = (offer: Offer) => {
    platformAdapter.logAnalyticsEvent(AmplitudeEvents.FLEXIBLE_OFFERS.CARD_CLICKED, {
      flexi_menu_id: flexibleOfferData.id,
      flexi_menu_title: flexibleOfferData.title,
      brand: BRAND,
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
    <>
      <div className="min-w-full">
        <Image
          src={flexibleOfferData.imageURL}
          className="h-auto w-full mb-3"
          width={0}
          height={0}
          alt={`Banner image for ${flexibleOfferData.title}`}
          sizes="full"
        />
      </div>
      <Container
        className="py-0 mb-0 laptop:py-6"
        nestedClassName="mx-0 px-0 laptop:mx-auto laptop:px-5 flex flex-col gap-6"
      >
        <div>
          <Typography variant={'headline-small-bold'} className="my-3">
            {flexibleOfferData.title}
          </Typography>
          <Typography variant={'body'} className="mb-3">
            {flexibleOfferData.description}
          </Typography>
        </div>
        <OfferCardList
          status="success"
          onOfferClick={onOfferClick}
          variant="horizontal"
          offers={[...offers, ...offers, ...offers]}
        />
      </Container>
    </>
  );
};

const FlexibleOffersPage: NextPage = () => {
  return (
    <ErrorBoundary fallback={<ErrorState page="flexi_menu" />}>
      <Suspense fallback={<FlexibleOffersSkeleton />}>
        <FlexibleOffersContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default FlexibleOffersPage;
