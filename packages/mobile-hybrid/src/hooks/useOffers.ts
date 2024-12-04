import {
  OfferDataModel,
  OfferFlexibleItemModel,
  OfferFlexibleModel,
  OfferPromosModel,
  OfferSharedModel,
} from '@/models/offer';
import { APIUrl, V5_API_URL } from '@/globals';
import { useAtom, useAtomValue } from 'jotai';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { darkRead, IPlatformAdapter } from '@bluelightcard/shared-ui';
import { atom, useSetAtom } from 'jotai/index';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { spinner } from '@/modules/Spinner/store';
import { useCallback } from 'react';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { userProfile } from '@/components/UserProfileProvider/store';
import { AmplitudeFeatureFlagState } from '@/components/AmplitudeProvider/types';

export interface OffersResultResponse {
  success: boolean;
  data: OfferDataModel;
}

export const offerPromosAtom = atom<OfferDataModel>({
  deal: [],
  groups: [],
});

const invokeNativeApiCall = new InvokeNativeAPICall();

const useOffers = (platformAdapter: IPlatformAdapter) => {
  const [offerPromos, setOfferPromos] = useAtom(offerPromosAtom);
  const amplitudeExperiments = useAtomValue(experimentsAndFeatureFlags);
  const userProfileValue = useAtomValue(userProfile);
  const setSpinner = useSetAtom(spinner);

  const getOfferPromos = useCallback(async () => {
    try {
      const results: OffersResultResponse = await darkRead(
        {
          experimentEnabled:
            platformAdapter.getAmplitudeFeatureFlag(FeatureFlags.MODERN_FLEXI_MENU_HYBRID) ===
            AmplitudeFeatureFlagState.On,
          darkReadEnabled: false,
        },
        async () => v4Offers(),
        async () =>
          v5Offers(
            platformAdapter,
            platformAdapter.getAmplitudeFeatureFlag(FeatureFlags.CMS_OFFERS) !== 'on',
            userProfileValue?.service,
            userProfileValue?.dob,
          ),
      );

      setOfferPromos(results.data);
      setSpinner(false);
    } catch (err) {
      console.error('Error requesting offer promos', err);
    }
  }, [
    platformAdapter,
    setOfferPromos,
    amplitudeExperiments,
    userProfileValue?.service,
    userProfileValue?.dob,
  ]);

  return {
    offerPromos,
    getOfferPromos,
  };
};

const v4Offers = async (): Promise<OffersResultResponse> => {
  const results = await invokeNativeApiCall.requestDataAsync<OffersResultResponse>(
    APIUrl.OfferPromos,
  );

  if (!results?.success) {
    throw new Error('Error in offer promos results response');
  }

  return results;
};

const v5Offers = async (
  platformAdapter: IPlatformAdapter,
  useLegacyIds = true,
  organisation: string = '',
  dob: string = '',
): Promise<OffersResultResponse> => {
  const results = await platformAdapter.invokeV5Api(V5_API_URL.Menus, {
    method: 'GET',
    cachePolicy: 'auto',
    queryParameters: {
      organisation,
      dob,
    },
  });

  const parsedSearchResults = JSON.parse(results.data).data;
  return {
    success: true,
    data: mapV5MenuResults(parsedSearchResults, useLegacyIds),
  };
};

const mapV5MenuResults = (data: any, useLegacyIds: boolean): OfferDataModel => {
  const marketplaceMenus = data.marketplace.map((menu: any) =>
    mapMarketplaceMenu(menu, useLegacyIds),
  );
  const featuredOffersMenu = mapFeaturedOffers(data.featured, useLegacyIds);

  return {
    deal: mapDealsOfTheWeek(data.dealsOfTheWeek, useLegacyIds),
    flexible: data.flexible.length > 0 ? mapFlexibleMenu(data.flexible[0]) : undefined,
    groups: [...marketplaceMenus, featuredOffersMenu],
  };
};

const mapDealsOfTheWeek = (menu: any, useLegacyIds: boolean): OfferSharedModel[] => {
  return [
    {
      title: 'Deals of the Week',
      random: true,
      items: menu.offers.map((offer: any) => mapV5OfferToOfferModel(offer, useLegacyIds)),
    },
  ];
};

const mapFlexibleMenu = (menu: any): OfferFlexibleModel => {
  return {
    title: menu.title,
    subtitle: '',
    random: true,
    items: menu.menus.map((item: any) => mapFlexibleItem(item)),
  };
};

const mapFlexibleItem = (item: any): OfferFlexibleItemModel => {
  return {
    id: item.id,
    title: item.title,
    imagehome: item.imageURL,
    imagedetail: '',
    navtitle: '',
    intro: '',
    footer: '',
    random: true,
    hide: false,
    items: [],
  };
};

const mapMarketplaceMenu = (menu: any, useLegacyIds: boolean): OfferSharedModel => {
  return {
    title: menu.title,
    random: true,
    items: menu.offers.map((offer: any) => mapV5OfferToOfferModel(offer, useLegacyIds)),
  };
};

const mapFeaturedOffers = (menu: any, useLegacyIds: boolean): OfferSharedModel => {
  return {
    title: 'Featured Offers',
    random: true,
    items: menu.offers.map((offer: any) => mapV5OfferToOfferModel(offer, useLegacyIds)),
  };
};

const mapV5OfferToOfferModel = (offer: any, useLegacyIds: boolean): OfferPromosModel => {
  return {
    id: useLegacyIds && offer.legacyOfferID ? offer.legacyOfferID : offer.offerID,
    compid: useLegacyIds && offer.legacyCompanyID ? offer.legacyCompanyID : offer.companyID,
    offername: offer.offerName,
    logos: offer.imageURL,
    companyname: offer.companyName,
    image: offer.imageURL,
    s3Image: offer.imageURL,
    absoluteLogos: offer.imageURL,
    s3logos: offer.imageURL,
    absoluteImage: offer.imageURL,
  };
};

export default useOffers;
