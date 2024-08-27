import { FC, useMemo } from 'react';
import BannerCarousel from '@/components/Banner/BannerCarousel';
import InvokeNativeNavigation from '@/invoke/navigation';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { OfferDataModel, OfferPromosModel } from '@/models/offer';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import useAPI, { APIResponse } from '@/hooks/useAPI';
import { APIUrl } from '@/globals';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { useAmplitude } from '@/hooks/useAmplitude';
import { AmplitudeExperimentState } from '@/components/AmplitudeProvider/types';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const PromoBanner: FC = () => {
  const { is } = useAmplitude();

  const onSlideItemClick = ({ compid, companyname, offername }: OfferPromosModel) => {
    const companyPageExperiment = is(
      Experiments.NEW_COMPANY_PAGE,
      AmplitudeExperimentState.Treatment,
    );

    if (companyPageExperiment) navigation.navigate(`/company?cid=${compid}`);
    else navigation.navigate(`/offerdetails.php?cid=${compid}`);

    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_CARD_CLICKED,
      parameters: {
        carousel_name: 'Billboard',
        brand_name: companyname,
        brand_offer: offername,
      },
    });
  };

  const response = useAPI(APIUrl.OfferPromos) as APIResponse<OfferDataModel>;

  const deals = useMemo(
    () =>
      (response?.data.deal ?? []).reduce((acc, deal) => {
        deal.items.forEach((item) => {
          acc.push(item);
        });
        return acc;
      }, [] as OfferPromosModel[]),
    [response?.data],
  );

  return (
    <>
      {!!deals.length && (
        <BannerCarousel
          slides={deals.map((deal) => ({
            id: deal.id,
            text: deal.offername,
            imageSrc: deal.image?.length ? deal.image : deal.s3logos,
          }))}
          onSlideItemClick={(id) =>
            onSlideItemClick(deals.find((deal) => deal.id === id) as OfferPromosModel)
          }
        />
      )}
    </>
  );
};

export default PromoBanner;
