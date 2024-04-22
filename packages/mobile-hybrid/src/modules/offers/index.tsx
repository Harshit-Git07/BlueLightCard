import { FC, useContext, useMemo, useState } from 'react';
import useOffers from '@/hooks/useOffers';
import Heading from '@/components/Heading/Heading';
import CardCarousel from '@/components/Carousel/CardCarousel';
import InvokeNativeNavigation from '@/invoke/navigation';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { OfferFlexibleItemModel, OfferPromosModel } from '@/models/offer';
import { AppContext } from '@/store';
import { NewsPreview } from '../news';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { PlatformVariant, OfferSheet as SharedOfferSheet } from '@bluelightcard/shared-ui';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import Amplitude from '@/components/Amplitude/Amplitude';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

// TODO uncomment below types to see the offer sheet working on mobile app with amplitude events
// type AmplitudeLogParams = {
//   [key: string]: string | number | boolean | undefined;
// };

// type AmplitudeArg = {
//   event: string;
//   params: AmplitudeLogParams;
// };

const Offers: FC = () => {
  const { flexible, groups } = useOffers();
  const { experiments: expr } = useContext(AppContext);
  // TODO uncomment below state to see the offer sheet working on mobile app
  // const [isOfferSheetOpen, setIsOfferSheetOpen] = useState(false);

  // TODO uncomment below mocked data variables to see the offer sheet working on mobile app
  // also need to uncomment code at the bottom of this file to see the offer sheet component
  // const mockedOfferDetails: any = {
  //   status: 'success',
  //   data: {
  //     companyId: 4016,
  //     companyLogo: 'companyimages/complarge/retina/',
  //     description:
  //       'SEAT have put together a discount on the price of a new car.  Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
  //     expiry: '2030-06-30T23:59:59.000Z',
  //     id: 3802,
  //     name: 'Save with SEAT',
  //     terms: 'Must be a Blue Light Card member in order to receive the discount.',
  //     type: 'Online',
  //   },
  // };
  // const mockedOfferToDisplay: any = {
  //   offerId: 3802,
  //   companyId: 4016,
  //   companyName: 'SEAT',
  // };

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
    navigation.navigate(`/flexibleOffers.php?id=${id}`, 'home');
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_CARD_CLICKED,
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
    // TODO remove below navigation once OfferSheet integration is completed and APIs are integrated on Get Discount button
    navigation.navigate(`/offerdetails.php?cid=${compid}`, 'home');
    // TODO uncomment below set state to see the offer sheet working on mobile app and comment above navigation.navigate to open the offerSheet
    // setIsOfferSheetOpen(true);
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_CARD_CLICKED,
      parameters: {
        carousel_name: categoryTitle,
        brand_name: companyname,
        brand_offer: offername,
      },
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
          {expr[Experiments.STREAMLINED_HOMEPAGE] !== 'on' && flexible.subtitle.length && (
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
      {expr[Experiments.STREAMLINED_HOMEPAGE] !== 'on' && <NewsPreview />}
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
      {/* TODO uncomment below div and component once we have API v5 integration on mobile hybrid */}
      {/* NOTE: SharedOfferSheet naming can be updated, this was just to make it cleared for now in the code. */}
      {/* above you will be able to find mocked data just for the purpose of understanding what should be passed on to the props in below component */}
      {/* should be the exact same structure that we will have on web, since implementation should be the same with API v5 */}
      {/* <div
        className={`w-full h-full transition-visibility duration-1000 ${
          isOfferSheetOpen ? 'visible' : 'invisible'
        }`}
      >
        <SharedOfferSheet
          platform={PlatformVariant.Mobile}
          isOpen={isOfferSheetOpen}
          onClose={() => setIsOfferSheetOpen(false)}
          // TODO replace with below values once we have the API integration for v5
          // now we see mocked values so the component does not break
          offerStatus={mockedOfferDetails.status}
          offerDetails={mockedOfferDetails.data}
          offerMeta={mockedOfferToDisplay}
          // TODO CDN URL should be coming from an environment variable as on web package
          cdnUrl="https://cdn.bluelightcard.co.uk"
          isMobileHybrid={true}
          amplitudeEvent={({ event, params }: AmplitudeArg) => {
            analytics.logAnalyticsEvent({ event, parameters: params });
          }}
          // BRAND is hardcoded as the app only supports blc-uk for now
          BRAND="blc-uk"
        />
      </div> */}
    </>
  );
};

export default Offers;
