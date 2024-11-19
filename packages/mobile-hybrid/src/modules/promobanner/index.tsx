import { FC, useMemo } from 'react';
import BannerCarousel from '@/components/Banner/BannerCarousel';
import InvokeNativeNavigation from '@/invoke/navigation';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { OfferPromosModel } from '@/models/offer';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { useAmplitude } from '@/hooks/useAmplitude';
import { AmplitudeExperimentState } from '@/components/AmplitudeProvider/types';
import useOffers from '@/hooks/useOffers';
import { usePlatformAdapter } from '@bluelightcard/shared-ui';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const PromoBanner: FC = () => {
  const { is } = useAmplitude();
  const platformAdapter = usePlatformAdapter();
  const {
    offerPromos: { deal },
  } = useOffers(platformAdapter);

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

  const deals = useMemo(
    () =>
      (deal ?? []).reduce((acc, deal) => {
        deal.items.forEach((item) => {
          acc.push(item);
        });
        return acc;
      }, [] as OfferPromosModel[]),
    [deal],
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
