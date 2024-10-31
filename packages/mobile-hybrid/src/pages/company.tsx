import { spinner } from '@/modules/Spinner/store';
import { useAtom, useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toPlainText } from '@portabletext/react';
import {
  CMS_SERVICES,
  CompanyAbout,
  PlatformVariant,
  apiDynamicPath,
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

const analytics = new InvokeNativeAnalytics();

const Company: NextPage<any> = () => {
  const router = useRouter();
  const { cid } = router.query;

  const setSpinner = useSetAtom(spinner);
  const [company, setCompany] = useAtom(companyDataAtom);

  const [retries, setRetries] = useState<number>(0);
  const maxRetries = 150; // maxRetries * 100ms is the timeout for the page load

  const [hasError, setHasError] = useState<boolean>(false);

  const amplitudeExperiments = amplitudeStore.get(experimentsAndFeatureFlags);
  let v5FlagOn = amplitudeExperiments[FeatureFlags.V5_API_INTEGRATION] === 'on';
  let isCmsFlagOn = amplitudeExperiments[FeatureFlags.CMS_OFFERS] === 'on';

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
        setHasError(true);
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
      setHasError(true);
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
      {hasError && <CompanyPageError />}
      {!hasError && (
        <>
          <CompanyPageHeader />
          <PillsController />
          <CompanyOffers />

          <div className="mt-4">
            <CompanyAbout
              CompanyName={`About ${company?.companyName ?? ''}`}
              CompanyDescription={
                isCmsFlagOn && company?.companyDescription
                  ? toPlainText(company.companyDescription)
                  : company?.companyDescription ?? ''
              }
              platform={PlatformVariant.MobileHybrid}
            />
          </div>
          <ToastContainer hideProgressBar />
        </>
      )}
    </div>
  );
};

export default Company;
