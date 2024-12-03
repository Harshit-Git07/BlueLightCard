import { PortableTextBlock, toPlainText } from '@portabletext/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';

import {
  CompanyAbout,
  PlatformVariant,
  useOfferDetails,
  getCompanyQuery,
} from '@bluelightcard/shared-ui';

import { FeatureFlags, AmplitudeFeatureFlagState } from '@/components/AmplitudeProvider';
import { useAmplitude } from '@/hooks/useAmplitude';
import { useCmsEnabled } from '@/hooks/useCmsEnabled';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { spinner } from '@/modules/Spinner/store';
import CompanyPageHeader from '@/page-components/company/components/CompanyPageHeader';
import PillsController from '@/page-components/company/components/PillsController';
import CompanyOffers from '@/page-components/company/components/CompanyOffers';
import CompanyPageError from '@/page-components/company/components/CompanyPageError';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';

const analytics = new InvokeNativeAnalytics();

const Company: NextPage = () => {
  const router = useRouter();
  const cid = Array.isArray(router.query.cid) ? router.query.cid[0] : router.query.cid;

  return (
    <div className="px-4">
      {cid && (
        <ErrorBoundary fallback={<CompanyPageError message="Failed to load company" />}>
          <Suspense>
            <CompanyPageHeader companyId={cid} />
            <PillsController companyId={cid} />
            <CompanyOffers companyId={cid} />
            <CompanyAboutWrapper companyId={cid} />

            <ToastContainer hideProgressBar />
            <SheetHandler companyId={cid} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
};

function CompanyAboutWrapper({ companyId }: Readonly<{ companyId: string }>) {
  const cmsEnabled = useCmsEnabled();
  const { name, description } = useSuspenseQuery(getCompanyQuery(companyId, cmsEnabled)).data;

  return (
    <div className="mt-4">
      <CompanyAbout
        CompanyName={`About ${name}`}
        CompanyDescription={
          cmsEnabled && description
            ? toPlainText(description as PortableTextBlock)
            : description ?? ''
        }
        platform={PlatformVariant.MobileHybrid}
      />
    </div>
  );
}

const SheetHandler = ({ companyId }: { companyId: string }) => {
  const setSpinner = useSetAtom(spinner);
  const { is } = useAmplitude();
  const cmsEnabled = is(FeatureFlags.CMS_OFFERS, AmplitudeFeatureFlagState.On);

  const { viewOffer } = useOfferDetails();
  const router = useRouter();
  const offerId = router.query.oid as string | undefined;

  const companyName = useSuspenseQuery(getCompanyQuery(companyId, cmsEnabled)).data.name;

  useEffect(() => {
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.COMPANYPAGE_VIEWED,
      parameters: {
        company_id: companyId,
        company_name: companyName,
        origin: 'mobile-hybrid',
      },
    });

    if (companyName) {
      setSpinner(false);
    }
  }, [companyId, companyName, setSpinner]);

  useEffect(() => {
    if (offerId && offerId !== 'null') {
      viewOffer({
        offerId,
        companyId,
        companyName,
        platform: PlatformVariant.MobileHybrid,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerId, companyId]);

  return null;
};

export default Company;
