import { FC, useMemo } from 'react';
import { PlatformVariant, useOfferDetails, usePlatformAdapter } from '@bluelightcard/shared-ui';
import useOffers from '@/hooks/useOffers';
import Heading from '@/components/Heading/Heading';
import CardCarousel from '@/components/Carousel/CardCarousel';
import InvokeNativeNavigation from '@/invoke/navigation';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { OfferFlexibleItemModel, OfferPromosModel } from '@/models/offer';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { Experiments, FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { useAmplitude } from '@/hooks/useAmplitude';
import { AmplitudeFeatureFlagState } from '@/components/AmplitudeProvider/types';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const Offers: FC = () => {
  const { is } = useAmplitude();
  const platformAdapter = usePlatformAdapter();
  const {
    offerPromos: { flexible, groups },
  } = useOffers(platformAdapter);
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

  const modernFlexiMenu = is(FeatureFlags.MODERN_FLEXI_MENU_HYBRID, AmplitudeFeatureFlagState.On);
  const headingFeatureFlag = is(Experiments.BF_FLEXI, AmplitudeFeatureFlagState.On);

  const onFlexOfferClick = (flexiTitle: string, { id, title }: OfferFlexibleItemModel) => {
    const path = modernFlexiMenu ? `/flexible-offers?id=${id}` : `/flexibleOffers.php?id=${id}`;

    navigation.navigate(path);

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

    await viewOffer({
      offerId: id,
      companyId: compid,
      companyName: companyname,
      platform: PlatformVariant.MobileHybrid,
    });
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
          <CardCarousel
            slides={flexible.items
              .filter((offer) => offer.hide == false)
              .map((offer) => ({
                id: offer.id,
                imageSrc: offer.imagedetail,
                meta: offer,
              }))}
            onSlideItemClick={(slide) =>
              onFlexOfferClick(
                flexible.title,
                flexible.items.find((flex) => flex.id === slide.id) as OfferFlexibleItemModel,
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
              meta: offer,
            }))}
            onSlideItemClick={(slide) =>
              onCompanyOfferClick(homepagePositionOffersExpr.title, slide.meta)
            }
            onSlideChanged={() => onSlideChange(homepagePositionOffersExpr.title)}
          />
        </section>
      )}
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
                meta: offer,
              }))}
              onSlideItemClick={(slide) => onCompanyOfferClick(group.title, slide.meta)}
              onSlideChanged={() => onSlideChange(group.title)}
            />
          </section>
        ))}
      </div>
    </>
  );
};

export default Offers;
