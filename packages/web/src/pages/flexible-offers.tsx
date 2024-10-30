import { FC, Suspense } from 'react';
import { NextPage } from 'next';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Image,
  OfferCardList,
  Typography,
  useMobileMediaQuery,
  useOfferDetails,
  usePlatformAdapter,
} from '@bluelightcard/shared-ui';
import { useRouter } from 'next/router';
import ContentLoader from 'react-content-loader';
import Container from '@/components/Container/Container';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import useFlexibleOffersData from '@/hooks/useFlexibleOffersData';
import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';

const FlexibleOffersSkeleton: FC = () => {
  const isMobile = useMobileMediaQuery();

  const viewBox = isMobile ? '0 0 300 300' : '0 0 300 180';

  return (
    <>
      <ContentLoader
        speed={3}
        viewBox={viewBox}
        backgroundColor="#f3f3f3"
        foregroundColor="#d1d1d1"
        style={{ width: '100%' }}
      >
        <rect className="w-full h-36" />
        <rect className="translate-y-[170px] h-6 w-full tablet:w-16 tablet:h-2 tablet:translate-y-[158px]" />
        <rect className="translate-y-[210px] h-24 w-full tablet:w-48 tablet:h-1 tablet:translate-y-[168px] " />
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

const FlexibleOffersContent: FC = () => {
  const router = useRouter();
  const isMobile = useMobileMediaQuery();
  const platformAdapter = usePlatformAdapter();
  const { viewOffer } = useOfferDetails();

  // Throw a promise NOT an error for Suspense
  if (!router.isReady) throw new Promise(() => {});

  const flexiMenuId = String(router.query.id);
  const { data } = useFlexibleOffersData(flexiMenuId);

  return (
    <>
      <Image
        className="h-auto w-full"
        src={data.imageURL}
        alt={`Banner image for ${data.title}`}
        fill={false}
        width="0"
        height="0"
        sizes="100vw"
      />

      <div>
        <Typography className="mb-3" variant="headline-bold">
          {data.title}
        </Typography>

        <Typography variant="body">{data.description}</Typography>
      </div>

      <OfferCardList
        offers={data.offers}
        columns={isMobile ? 1 : 3}
        variant={isMobile ? 'horizontal' : 'vertical'}
        status="success"
        onOfferClick={(offer) =>
          viewOffer({
            offerId: offer.offerID,
            companyId: offer.companyID,
            companyName: offer.companyName,
            platform: platformAdapter.platform,
          })
        }
      />
    </>
  );
};

const FlexibleOffersPage: NextPage = () => {
  return (
    <Container
      className="py-0 mb-0 laptop:py-6"
      nestedClassName="mx-0 px-0 laptop:mx-auto laptop:px-5 flex flex-col gap-6"
    >
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <Suspense fallback={<FlexibleOffersSkeleton />}>
          <FlexibleOffersContent />
        </Suspense>
      </ErrorBoundary>
    </Container>
  );
};

export const getStaticProps = getI18nStaticProps;

export default withAuthProviderLayout(FlexibleOffersPage, true);
