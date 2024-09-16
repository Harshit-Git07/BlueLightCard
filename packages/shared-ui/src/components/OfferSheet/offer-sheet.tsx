import { Suspense, useRef } from 'react';
import { DrawerFooter, type DrawerProps } from '../Drawer';
import VaultCodeJourney from './journeys/vault';
import { offerDetailsQuery } from './queries/offer-details-query';
import { redemptionTypeQuery } from './queries/redemption-details-query';
import { usePlatformAdapter, type Amplitude } from '../../adapters';
import events from '../../utils/amplitude/events';
import { useEffectOnce } from 'react-use';
import PreAppliedRedemptionJourney from './journeys/pre-applied';
import GenericRedemptionJourney from './journeys/generic';
import VaultQRRedemptionJourney from './journeys/vault-qr';
import { mergeClassnames } from '../../utils/cssUtils';
import { useSuspenseQuery } from '@tanstack/react-query';
import ShowCard from './journeys/show-card';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './journeys/error';
import { PlatformVariant } from '../../types';
import { RedemptionType } from '../../utils/redemptionTypes';
import { AmplitudeVariant } from '../../utils/amplitude/variants';

type OfferSheetProps = DrawerProps<{
  companyId: number;
  offerId: number;
  companyName: string;
  amplitude?: Amplitude | null;
}>;

function OfferSheetController(props: OfferSheetProps) {
  const initialized = useRef(false);
  const adapter = usePlatformAdapter();
  const type = useSuspenseQuery(redemptionTypeQuery(props.offerId));
  const offer = useSuspenseQuery(offerDetailsQuery(props.offerId));

  const nonVaultExperiment = adapter.getAmplitudeFeatureFlag(
    adapter.platform === PlatformVariant.Web
      ? 'offer-sheet-redeem-non-vault-web'
      : 'offer-sheet-redeem-non-vault-app',
  );
  const vaultExperiment = adapter.getAmplitudeFeatureFlag(
    adapter.platform === PlatformVariant.Web
      ? 'offer-sheet-redeem-vault-search-and-homepage-web-2'
      : 'offer-sheet-redeem-vault-app',
  );
  const companyPageUrl = `/offerdetails.php?cid=${props.companyId}`;

  useEffectOnce(() => {
    if (!initialized.current) {
      initialized.current = true;

      adapter.logAnalyticsEvent(
        events.OFFER_VIEWED,
        {
          company_id: String(offer.data.companyId),
          company_name: props.companyName,
          offer_id: String(offer.data.id),
          offer_name: offer.data.name,
          source: 'sheet',
          origin: adapter.platform,
          redemption_type: type.data,
        },
        props.amplitude,
      );
    }
  });

  // Vault code journey
  if (type.data === RedemptionType.VAULT) {
    if (vaultExperiment === AmplitudeVariant.CONTROL) {
      adapter.navigate(companyPageUrl);
      return <LoadingSkeleton />;
    }
    return (
      <VaultCodeJourney
        offerId={props.offerId}
        companyName={props.companyName}
        amplitude={props.amplitude}
      />
    );
  }

  // All non-vault journies
  if (nonVaultExperiment === AmplitudeVariant.CONTROL) {
    adapter.navigate(companyPageUrl);
    return <LoadingSkeleton />;
  }

  if (type.data === RedemptionType.PRE_APPLIED) {
    return (
      <PreAppliedRedemptionJourney
        offerId={props.offerId}
        companyName={props.companyName}
        amplitude={props.amplitude}
      />
    );
  }

  if (type.data === RedemptionType.GENERIC) {
    return (
      <GenericRedemptionJourney
        offerId={props.offerId}
        companyName={props.companyName}
        amplitude={props.amplitude}
      />
    );
  }

  if (type.data === RedemptionType.VAULT_QR) {
    return (
      <VaultQRRedemptionJourney
        offerId={props.offerId}
        companyName={props.companyName}
        amplitude={props.amplitude}
      />
    );
  }

  if (type.data === RedemptionType.SHOW_CARD) {
    return (
      <ShowCard
        offerId={props.offerId}
        companyName={props.companyName}
        amplitude={props.amplitude}
        onClose={props.drawer.close}
      />
    );
  }

  adapter.navigate(companyPageUrl);
  return <LoadingSkeleton />;
}

function Skeleton({ className, ...props }: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={mergeClassnames('animate-pulse rounded-md bg-gray-100', className)}
      {...props}
    />
  );
}

export function LoadingSkeleton() {
  return (
    <>
      <div className="pt-6" data-testid="_loading_skeleton">
        <div className="flex flex-col text-center text-wrap space-y-2 p-[24px_24px_14px_24px] pt-0 font-museo">
          <div>
            <div className="flex justify-center">
              <Skeleton className="w-[100px] h-[64px] rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <Skeleton className="w-[60%] mx-auto h-[24px] rounded mt-5 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="mx-auto w-[85%] h-[14px] mt-4 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="mx-auto w-[90%] h-[14px] mt-1.5 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="mx-auto w-[80%] h-[14px] mt-1.5 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="mx-auto w-[70%] h-[14px] mt-1.5 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
      <DrawerFooter>
        <div className="w-full flex mb-2 justify-center ">
          <Skeleton className="bg-gray-200 dark:bg-gray-700 rounded-full h-[26px] w-[60px] m-1" />
          <Skeleton className="bg-gray-200 dark:bg-gray-700 rounded-full h-[26px] w-[120px] m-1" />
        </div>
        <Skeleton className="bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden p-1 w-full h-[3.75rem]" />
      </DrawerFooter>
    </>
  );
}

export default function OfferSheet(props: OfferSheetProps) {
  return (
    <ErrorBoundary fallback={<ErrorPage {...props} />}>
      <Suspense fallback={<LoadingSkeleton />}>
        <OfferSheetController {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
