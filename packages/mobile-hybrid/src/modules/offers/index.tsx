import { FC, useMemo } from 'react';
import { useOfferDetails } from '@bluelightcard/shared-ui';
import useOffers from '@/hooks/useOffers';
import Heading from '@/components/Heading/Heading';
import CardCarousel from '@/components/Carousel/CardCarousel';
import InvokeNativeNavigation from '@/invoke/navigation';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { OfferFlexibleItemModel, OfferPromosModel } from '@/models/offer';
import { NewsPreview } from '../news';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { useAmplitude } from '@/hooks/useAmplitude';
import { AmplitudeFeatureFlagState } from '@/components/AmplitudeProvider/types';
import { useAtomValue } from 'jotai';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const Offers: FC = () => {
  const { is } = useAmplitude();
  const { flexible, groups } = useOffers();
  const amplitudeExperiment = useAtomValue(experimentsAndFeatureFlags);
  const { viewOffer } = useOfferDetails();

  /**
   * @experiment
   * Locate specific offers
   */
  const homepagePositionOffersExpr = useMemo(() => {
    if (is(Experiments.HOMEPAGE_POSITIONING, 'treatment-a')) {
      return groups.find(
        (group) => group.title.toLowerCase() === `general offers - don't miss out`,
      );
    } else if (is(Experiments.HOMEPAGE_POSITIONING, 'treatment-b')) {
      return groups.find((group) => group.title.toLowerCase() === 'top offers');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  const offers = useMemo(() => {
    if (is(Experiments.HOMEPAGE_POSITIONING, 'treatment-a')) {
      return groups.filter(
        (group) => group.title.toLowerCase() !== `general offers - don't miss out`,
      );
    } else if (is(Experiments.HOMEPAGE_POSITIONING, 'treatment-b')) {
      return groups.filter((group) => group.title.toLowerCase() !== 'top offers');
    }
    return groups;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  /**
   * @featureFlag bf-flexi
   * @description Conditionally render different headings depending on the feature flag
   * */
  const headingFeatureFlag = is(Experiments.BF_FLEXI, AmplitudeFeatureFlagState.On);
  const onFlexOfferClick = (flexiTitle: string, { id, title }: OfferFlexibleItemModel) => {
    navigation.navigate(`/flexibleOffers.php?id=${id}`);
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_CARD_CLICKED,
      parameters: {
        carousel_name: flexiTitle,
        brand_offer: title,
      },
    });
  };
  const onCompanyOfferClick = async (
    categoryTitle: string,
    { offername, companyname, id, compid }: OfferPromosModel,
  ) => {
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_CARD_CLICKED,
      parameters: {
        carousel_name: categoryTitle,
        brand_name: companyname,
        brand_offer: offername,
      },
    });

    await viewOffer(amplitudeExperiment[Experiments.OFFER_SHEET], id, compid);
  };
  const onSlideChange = (carouselName: string) => {
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_INTERACTED,
      parameters: {
        carousel_name: carouselName,
      },
    });
  };

  return (
    <>
      {flexible && (
        <div className="mb-6">
          <Heading title={headingFeatureFlag ? 'Shop Black Friday' : flexible.title} />
          {!is(Experiments.STREAMLINED_HOMEPAGE, AmplitudeFeatureFlagState.On) &&
            flexible.subtitle.length && (
              <p className="px-4 mb-3 dark:text-neutral-white">{flexible.subtitle}</p>
            )}
          <CardCarousel
            slides={flexible.items
              .filter((offer) => offer.hide == false)
              .map((offer) => ({
                id: offer.id,
                imageSrc: offer.imagedetail,
              }))}
            onSlideItemClick={(id) =>
              onFlexOfferClick(
                flexible.title,
                flexible.items.find((flex) => flex.id === id) as OfferFlexibleItemModel,
              )
            }
            onSlideChanged={() => onSlideChange(flexible.title)}
          />
        </div>
      )}
      {homepagePositionOffersExpr && (
        <section className="mb-6">
          <Heading title={homepagePositionOffersExpr.title} />
          <CardCarousel
            slides={homepagePositionOffersExpr.items.map((offer) => ({
              id: offer.compid,
              title: offer.companyname,
              text: offer.offername,
              imageSrc: offer.image?.length ? offer.image : offer.s3logos,
            }))}
            onSlideItemClick={(id) =>
              onCompanyOfferClick(
                homepagePositionOffersExpr.title,
                homepagePositionOffersExpr.items.find(
                  (offer) => offer.compid === id,
                ) as OfferPromosModel,
              )
            }
            onSlideChanged={() => onSlideChange(homepagePositionOffersExpr.title)}
          />
        </section>
      )}
      {!is(Experiments.STREAMLINED_HOMEPAGE, AmplitudeFeatureFlagState.On) && <NewsPreview />}
      <div className="mb-2">
        {offers.map((group, index) => (
          <section key={`${group.title}_${index}`} className="mb-6">
            <Heading title={group.title} />
            <CardCarousel
              slides={group.items.map((offer) => ({
                id: offer.compid,
                title: offer.companyname,
                text: offer.offername,
                imageSrc: offer.image?.length ? offer.image : offer.s3logos,
              }))}
              onSlideItemClick={(id) =>
                onCompanyOfferClick(
                  group.title,
                  group.items.find((offer) => offer.compid === id) as OfferPromosModel,
                )
              }
              onSlideChanged={() => onSlideChange(group.title)}
            />
          </section>
        ))}
      </div>
    </>
  );
};

export default Offers;
