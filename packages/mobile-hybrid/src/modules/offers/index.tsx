import { FC, useContext, useMemo } from 'react';
import useOffers from '@/hooks/useOffers';
import Heading from '@/components/Heading/Heading';
import CardCarousel from '@/components/Carousel/CardCarousel';
import InvokeNativeNavigation from '@/invoke/navigation';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { OfferFlexibleItemModel, OfferPromosModel } from '@/models/offer';
import { AppContext } from '@/store';
import { NewsPreview } from '../news';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const Offers: FC = () => {
  const { flexible, groups } = useOffers();
  const { experiments: expr } = useContext(AppContext);

  /**
   * @experiment
   * Locate specific offers
   */
  const homepagePositionOffersExpr = useMemo(() => {
    if (expr['homepage-positioning'] === 'treatment-a') {
      return groups.find(
        (group) => group.title.toLowerCase() === `general offers - don't miss out`,
      );
    } else if (expr['homepage-positioning'] === 'treatment-b') {
      return groups.find((group) => group.title.toLowerCase() === 'top offers');
    }
  }, [expr, groups]);

  const offers = useMemo(() => {
    if (expr['homepage-positioning'] === 'treatment-a') {
      return groups.filter(
        (group) => group.title.toLowerCase() !== `general offers - don't miss out`,
      );
    } else if (expr['homepage-positioning'] === 'treatment-b') {
      return groups.filter((group) => group.title.toLowerCase() !== 'top offers');
    }
    return groups;
  }, [expr, groups]);

  /**
   * @featureFlag bf-flexi
   * @description Conditionally render different headings depending on the feature flag
   * */
  const headingFeatureFlag = expr['bf-flexi'] === 'on';
  const onFlexOfferClick = (flexiTitle: string, { id, title }: OfferFlexibleItemModel) => {
    navigation.navigate(`/flexibleOffers.php?id=${id}`);
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_card_clicked',
      parameters: {
        carousel_name: flexiTitle,
        brand_offer: title,
      },
    });
  };
  const onCompanyOfferClick = (
    categoryTitle: string,
    { compid, offername, companyname }: OfferPromosModel,
  ) => {
    navigation.navigate(`/offerdetails.php?cid=${compid}`);
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_card_clicked',
      parameters: {
        carousel_name: categoryTitle,
        brand_name: companyname,
        brand_offer: offername,
      },
    });
  };
  const onSlideChange = (carouselName: string) => {
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_interacted',
      parameters: {
        carousel_name: carouselName,
      },
    });
  };
  return (
    <>
      {flexible && (
        <div className="mb-4">
          <Heading title={headingFeatureFlag ? 'Shop Black Friday' : flexible.title} />
          {expr['streamlined-homepage'] !== 'on' && flexible.subtitle.length && (
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
      {expr['streamlined-homepage'] !== 'on' && <NewsPreview />}
      <div className="my-2">
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
