import { spinner } from '@/modules/Spinner/store';
import { useAtom, useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CompanyAbout, Heading, PlatformVariant } from '@bluelightcard/shared-ui';
import { companyDataAtom } from '@/page-components/company/atoms';
import CompanyPageHeader from '@/page-components/company/CompanyPageHeader';
import PillsController from '@/page-components/company/PillsController';
import CompanyOffers from '@/page-components/company/CompanyOffers';
import { MobilePlatformAdapter } from '@/utils/platformAdapter';
import { z } from 'zod';
import { OfferModel } from '@/page-components/company/types';
import AmplitudeProvider, {
  amplitudeStore,
} from '@/components/AmplitudeProvider/AmplitudeProvider';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import Head from 'next/head';

const companyModel = z.object({
  description: z.string(),
  name: z.string(),
  id: z.number(),
});

const offerModel = z.object({
  id: z.number(),
  description: z.string(),
  name: z.string(),
  type: z.string(),
  expiry: z.string(),
  terms: z.string(),
  image: z.string(),
});

const offerResponseModel = z.object({
  message: z.string(),
  data: z.object({
    offers: z.array(offerModel),
  }),
});

const companyResponseModel = z.object({
  message: z.string(),
  data: companyModel,
});

const Company: NextPage<any> = () => {
  const router = useRouter();
  const { cid } = router.query;

  const setSpinner = useSetAtom(spinner);
  const [company, setCompany] = useAtom(companyDataAtom);

  const [retries, setRetries] = useState<number>(0);
  const maxRetries = 50;

  const [hasError, setHasError] = useState<boolean>(false);

  const rand = Math.random().toString(36).substring(2, 15);
  console.log('dbg: rand', rand);

  useEffect(() => {
    const getOffers = async () => {
      const platformAdapter = new MobilePlatformAdapter();
      const offersResponse = await platformAdapter.invokeV5Api(`/eu/offers/company/${cid}/offers`, {
        method: 'GET',
      });
      const companyResponse = await platformAdapter.invokeV5Api(`/eu/offers/company/${cid}`, {
        method: 'GET',
      });

      const company = companyResponseModel.parse(JSON.parse(companyResponse.data));
      const offers = offerResponseModel.parse(JSON.parse(offersResponse.data));

      setCompany({
        companyId: company.data.id,
        companyName: company.data.name,
        companyDescription: company.data.description,
        offers: offers.data.offers as OfferModel[],
      });

      setSpinner(false);
    };

    const amplitudeExperiments = amplitudeStore.get(experimentsAndFeatureFlags);
    let v5FlagOn = amplitudeExperiments[FeatureFlags.V5_API_INTEGRATION] === 'on';

    if (retries > maxRetries) {
      setHasError(true);
      setSpinner(false);
      return;
    }

    if (!cid) {
      return;
    }

    if (!v5FlagOn) {
      setTimeout(() => {
        setRetries(retries + 1);
      }, 100);
      return;
    } else {
      getOffers();
    }
  }, [cid, retries, setCompany, setSpinner]);

  return (
    <div className="px-4">
      {hasError && (
        <Heading headingLevel={'h1'} className="text-red-500 pt-8">
          Something went wrong. Please try again later
        </Heading>
      )}
      {!hasError && (
        <>
          <CompanyPageHeader />
          <PillsController />
          <CompanyOffers />

          <div className="mt-4">
            <CompanyAbout
              CompanyName={`About ${company?.companyName ?? ''}`}
              CompanyDescription={company?.companyDescription ?? ''}
              platform={PlatformVariant.MobileHybrid}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Company;
