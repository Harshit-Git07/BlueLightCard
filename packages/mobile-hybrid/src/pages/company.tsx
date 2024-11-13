import { spinner } from '@/modules/Spinner/store';
import { useAtom, useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, Suspense } from 'react';
import { PortableTextBlock, toPlainText } from '@portabletext/react';
import {
  CMS_SERVICES,
  CompanyAbout,
  PlatformVariant,
  apiDynamicPath,
  useOfferDetails,
} from '@bluelightcard/shared-ui';
import { companyDataAtom } from '@/page-components/company/atoms';
import CompanyPageHeader from '@/page-components/company/components/CompanyPageHeader';
import PillsController from '@/page-components/company/components/PillsController';
import CompanyOffers from '@/page-components/company/components/CompanyOffers';
import { MobilePlatformAdapter } from '@/utils/platformAdapter';
import {
  CMSOfferModel,
  CMSZodOfferResponseModel,
  OfferModel,
  ZodCompanyModel,
  ZodCompanyResponseModel,
  ZodOfferResponseModel,
} from '@/page-components/company/types';
import { amplitudeStore } from '@/components/AmplitudeProvider/AmplitudeProvider';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import CompanyPageError from '@/page-components/company/components/CompanyPageError';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { ToastContainer } from 'react-toastify';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingSpinner from '../../../shared-ui/src/components/LoadingSpinner';

const analytics = new InvokeNativeAnalytics();

const Company: NextPage<any> = () => {
  const router = useRouter();
  const { cid, oid } = router.query;
  const { viewOffer } = useOfferDetails();

  const setSpinner = useSetAtom(spinner);
  const [company, setCompany] = useAtom(companyDataAtom);

  const [retries, setRetries] = useState<number>(0);
  const maxRetries = 150; // maxRetries * 100ms is the timeout for the page load

  const amplitudeExperiments = amplitudeStore.get(experimentsAndFeatureFlags);
  let v5FlagOn = amplitudeExperiments[FeatureFlags.V5_API_INTEGRATION] === 'on';
  let isCmsFlagOn = amplitudeExperiments[FeatureFlags.CMS_OFFERS] === 'on';

  useEffect(() => {
    // if oid=null, null would be a string in the url, so we need to handle that as string
    if (oid && oid !== 'null' && cid && company?.companyName) {
      viewOffer({
        offerId: oid as string,
        companyId: cid as string,
        companyName: company?.companyName || '',
        platform: PlatformVariant.MobileHybrid,
      });
    }
    // viewOffer is a dependency of this useEffect, but we only want to run it once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oid, cid, company?.companyName]);

  useEffect(() => {
    const getOffers = async () => {
      const platformAdapter = new MobilePlatformAdapter();
      const companyRetrieve = platformAdapter.invokeV5Api(
        apiDynamicPath({
          service: CMS_SERVICES.COMPANY_DATA,
          isCmsFlagOn,
          companyId: cid as string,
        }),
        {
          method: 'GET',
        },
      );
      const offersRetrieve = platformAdapter.invokeV5Api(
        apiDynamicPath({
          service: CMS_SERVICES.OFFERS_BY_COMPANY_DATA,
          isCmsFlagOn,
          companyId: cid as string,
        }),
        {
          method: 'GET',
        },
      );

      const [companyResponse, offersResponse] = await Promise.all([
        companyRetrieve,
        offersRetrieve,
      ]);

      // Offer probably doesnt exist or at least somethings gone wrong with the data
      if (!companyResponse.data || !offersResponse.data) {
        setSpinner(false);
        return;
      }

      if (isCmsFlagOn) {
        const company = ZodCompanyModel.parse(JSON.parse(companyResponse.data));
        const offers = CMSZodOfferResponseModel.parse(JSON.parse(offersResponse.data));
        console.log('company', company);
        setCompany({
          companyId: company.id,
          companyName: company.name,
          companyDescription: company.description,
          offers: offers as CMSOfferModel[],
        });

        analytics.logAnalyticsEvent({
          event: AmplitudeEvents.COMPANYPAGE_VIEWED,
          parameters: {
            company_id: cid,
            company_name: company.name,
            origin: 'mobile-hybrid',
          },
        });
      } else {
        const company = ZodCompanyResponseModel.parse(JSON.parse(companyResponse.data));
        const offers = ZodOfferResponseModel.parse(JSON.parse(offersResponse.data));
        setCompany({
          companyId: company.data.id,
          companyName: company.data.name,
          companyDescription: company.data.description,
          offers: offers.data.offers as OfferModel[],
        });

        analytics.logAnalyticsEvent({
          event: AmplitudeEvents.COMPANYPAGE_VIEWED,
          parameters: {
            company_id: cid,
            company_name: company.data.name,
            origin: 'mobile-hybrid',
          },
        });
      }

      setSpinner(false);
    };

    // Give up trying to refetch the data from the hybrid event-bus after maxRetry count
    if (retries > maxRetries) {
      setSpinner(false);
      return;
    }

    if (!cid) {
      return;
    }

    // Waiting for the flag data to be pulled from mobile, it's a dependency of the offer sheet
    if (!v5FlagOn) {
      setTimeout(() => {
        // Update retry after timeout to retrigger the useEffect
        setRetries(retries + 1);
      }, 100);
      return;
    } else {
      getOffers();
    }
  }, [cid, retries, setCompany, setSpinner, v5FlagOn, isCmsFlagOn]);

  return (
    <div className="px-4">
      <ErrorBoundary fallback={<CompanyPageError message="Failed to load company" />}>
        <Suspense
          fallback={
            <LoadingSpinner
              containerClassName="w-full h-[100vh]"
              spinnerClassName="text-[5em] text-palette-primary dark:text-palette-secondary"
            />
          }
        >
          <CompanyPageHeader />
          <PillsController />
          <CompanyOffers />

          <div className="mt-4">
            <CompanyAbout
              CompanyName={`About ${company?.companyName ?? ''}`}
              CompanyDescription={
                isCmsFlagOn && company?.companyDescription
                  ? toPlainText(company.companyDescription as PortableTextBlock)
                  : company?.companyDescription ?? ''
              }
              platform={PlatformVariant.MobileHybrid}
            />
          </div>
          <ToastContainer hideProgressBar />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Company;
