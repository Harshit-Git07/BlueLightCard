import { spinner } from '@/modules/Spinner/store';
import { useAtom, useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { CompanyAbout, PlatformVariant } from '@bluelightcard/shared-ui';
import { companyDataAtom } from '@/page-components/company/atoms';
import CompanyPageHeader from '@/page-components/company/CompanyPageHeader';
import PillsController from '@/page-components/company/PillsController';
import CompanyOffers from '@/page-components/company/CompanyOffers';
import { MobilePlatformAdapter } from '@/utils/platformAdapter';
import { z } from 'zod';
import { OfferModel } from '@/page-components/company/types';

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

  useEffect(() => {
    const getOffers = async () => {
      if (cid) {
        const platformAdapter = new MobilePlatformAdapter();

        const offersResponse = await platformAdapter.invokeV5Api(
          `/eu/offers/company/${cid}/offers`,
          {
            method: 'GET',
          },
        );
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
      }
    };

    getOffers();
  }, [cid, setSpinner, setCompany]);

  return (
    <div className="px-4">
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
    </div>
  );
};

export default Company;
