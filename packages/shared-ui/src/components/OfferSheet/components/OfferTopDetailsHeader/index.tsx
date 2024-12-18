import { PortableText, PortableTextBlock, toPlainText } from '@portabletext/react';
import { useAtomValue } from 'jotai';
import { type FC, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import Image from '../../../Image';
import Heading from '../../../Heading';
import { offerSheetAtom } from '../../store';
import Button from '../../../Button';
import { PlatformVariant, ThemeVariant } from '../../../../types';
import ShareButton from '../../../ShareButton';
import Accordion from '../../../Accordion';
import amplitudeEvents from '../../../../utils/amplitude/events';
import { useSharedUIConfig } from '../../../../providers';
import decodeEntities from '../../../../utils/decodeEntities';
import { usePlatformAdapter } from '../../../../adapters';
import { Offer, Event } from '../../../../../../api/offers-cms/src/api/schema';
import { formatDateDDMMMYYYY_12HourTime } from '../../../../utils/dates';

import moment from 'moment';
import DealsTimer from '../../../DealsTimer';

export type Props = {
  showOfferDescription?: boolean;
  showShareFavorite?: boolean;
  showTerms?: boolean;
};

type OfferData = Offer | Event;

const isEvent = (data: OfferData): data is Event => {
  return data.type === 'ticket';
};

export const getShareButtonTargetPage = (offer: OfferData) => {
  if (!isEvent(offer)) {
    return `/company?cid=${offer.companyId}&oid=${offer.id}`;
  } else {
    return `share for event is not implemented yet`;
  }
};
const OfferTopDetailsHeader: FC<Props> = ({
  showOfferDescription = true,
  showShareFavorite = true,
  showTerms = true,
}) => {
  const adapter = usePlatformAdapter();
  const config = useSharedUIConfig();
  const {
    offerDetails: offerData,
    eventDetails: eventData,
    offerMeta,
    qrCodeValue,
    redemptionType,
  } = useAtomValue(offerSheetAtom);
  const [imageSource, setImageSource] = useState<string | undefined>();
  const [expanded, setExpanded] = useState(false);
  // TODO CDN URL could be replaced with global var?
  const finalFallbackImage = `${config.globalConfig.cdnUrl}/misc/Logo_coming_soon.jpg`;

  const offer = redemptionType === 'ballot' && eventData ? eventData : offerData;
  const description = offer.description;
  const isDescriptionLong =
    description && toPlainText(description.content as unknown as PortableTextBlock).length > 300;

  if (isEvent(offer)) showShareFavorite = false;

  const hostname = adapter.getBrandURL();

  const handleSeeMore = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const urlContainsImage = /\.(jpe?g|png|gif|bmp)$/i.test(offer.image ?? '');
    if (offer.image && urlContainsImage) {
      setImageSource(offer.image);
    } else if (!isEvent(offer) && offer.companyId) {
      const imageUrl = `${config.globalConfig.cdnUrl}/companyimages/complarge/retina/${offer.companyId}.jpg`;
      setImageSource(imageUrl);
    }
  }, [offer?.image, offerData.companyId, config.globalConfig.cdnUrl]);

  const expiryDate = moment(offerData.expires);
  const currentDate = moment();
  const remainingDays = expiryDate.diff(currentDate, 'days');

  return (
    <div className="flex flex-col text-center text-wrap space-y-2 p-[24px_24px_14px_24px] pt-0 bg-colour-surface-light dark:bg-colour-surface-dark">
      <div>
        {/* Offer Image */}
        <div className="flex justify-center">
          {imageSource && (
            <Image
              src={imageSource}
              alt={`${offerMeta.companyName ?? 'company'} logo`}
              responsive={false}
              width={100}
              height={64}
              className="!relative object-contain object-center rounded shadow-[0_4px_12px_0_rgba(0,0,0,0.15)]"
              onError={() => setImageSource(finalFallbackImage)}
            />
          )}
        </div>
        {/* Offer/Event Name */}
        <Heading
          headingLevel={'h2'}
          className={
            'mt-4 text-colour-onSurface-light dark:text-colour-onSurface-dark font-typography-title-large font-typography-title-large-weight text-typography-title-large tracking-typography-title-large leading-typography-title-large'
          }
        >
          {decodeEntities(offer.name || '')}
        </Heading>

        {/* Event Date */}
        {isEvent(offer) && (
          <div className="mt-2 font-bold text-colour-onSurface-light dark:text-colour-onSurface-dark">
            {offer.startDate && <p>{formatDateDDMMMYYYY_12HourTime(offer.startDate)}</p>}
          </div>
        )}

        {/* Event Venue */}
        {isEvent(offer) && offer.venueName && (
          <div className="mt-2 font-light text-colour-onSurface-light">
            <p>{offer.venueName}</p>
          </div>
        )}

        {!isEvent(offer) &&
          adapter.getAmplitudeFeatureFlag('conv-blc-8-0-deals-timer') &&
          adapter.getAmplitudeFeatureFlag('conv-blc-8-0-deals-timer') === 'treatment' &&
          remainingDays <= 14 &&
          offer.expires && <DealsTimer expiry={offer.expires}></DealsTimer>}

        {/* Offer Description */}
        {!isEvent(offer) &&
          showOfferDescription &&
          description &&
          !(adapter.platform === PlatformVariant.MobileHybrid && qrCodeValue) && (
            <>
              <div
                className={`mt-2 text-colour-onSurface-light dark:text-colour-onSurface-dark font-typography-body-light
            font-typography-body-light-weight text-typography-body-light tracking-typography-body-light
            leading-typography-body-light ${
              isDescriptionLong && !expanded
                ? 'mobile:line-clamp-3 tablet:line-clamp-4 desktop:line-clamp-5'
                : ''
            }`}
              >
                <PortableText value={description.content as unknown as PortableTextBlock} />
              </div>

              {/* Show more/less button for description */}
              {offer.description && isDescriptionLong && (
                <Button
                  variant={ThemeVariant.Tertiary}
                  slim
                  withoutHover
                  className="w-fit"
                  onClick={handleSeeMore}
                  borderless
                >
                  {expanded ? 'See less' : 'See more...'}
                </Button>
              )}
            </>
          )}

        {/* Share & Favorite */}
        {showShareFavorite &&
          !(adapter.platform === PlatformVariant.MobileHybrid && qrCodeValue) && (
            <div className="flex flex-wrap justify-center mt-4">
              <ShareButton
                {...{
                  shareDetails: {
                    name: offer.name,
                    description: offer.description as PortableTextBlock,
                    url: `${
                      typeof window !== 'undefined'
                        ? `${window.location.protocol}//${hostname}`
                        : ''
                    }${getShareButtonTargetPage(offer)}`,
                  },
                  shareLabel: 'Share',
                  amplitudeDetails: {
                    event: amplitudeEvents.OFFER_SHARE_CLICKED,
                    params: {
                      company_id: String(offerMeta.companyId),
                      company_name: offerMeta.companyName,
                      offer_id: String(offerMeta.offerId),
                      offer_name: offer.name,
                      brand: config.globalConfig.brand,
                    },
                  },
                }}
              />
            </div>
          )}

        {/* About this event */}
        {isEvent(offer) && description && (
          <div className="w-full text-left mt-4">
            <Accordion title="About this event">
              <PortableText value={description.content as unknown as PortableTextBlock} />
            </Accordion>
          </div>
        )}

        {/* Event How It Works */}
        {isEvent(offer) && offer.howItWorks && (
          <div className="w-full text-left mt-4">
            <Accordion title="How It Works">
              <PortableText value={offer.howItWorks.content as unknown as PortableTextBlock} />
            </Accordion>
          </div>
        )}

        {/* Exclusions */}
        {/* --- Uncomment when Exclusions API is ready --- */}
        {/* TODO add check on API integration do only display this block if exclusions exist in the offer*/}
        {/* {showExclusions && (
        <div className="w-full text-left mt-4">
          <Accordion title="Exclusions">
            <IconListItem iconSrc="/assets/box-open-light-slash.svg" title="Not valid on certain item(s)"
              link="View details" onClickLink={()=> setOpenExclusionsDetails('items')}
              />
              <IconListItem iconSrc="/assets/store-light-slash.svg" title="Not valid in certain store(s)"
                link="View details" onClickLink={()=> setOpenExclusionsDetails('store')}
                />
                <IconListItem iconSrc="/assets/tags-light-slash.svg" title="Not valid with other promotions" />
                <IconListItem iconSrc="/assets/circle-sterling-light.svg" title="Only valid on full price items" />
          </Accordion>
        </div>
        )} */}

        {/* Offer Terms & Conditions */}
        {showTerms &&
          offer.termsAndConditions &&
          !(adapter.platform === PlatformVariant.MobileHybrid && qrCodeValue) && (
            <div className="w-full text-left mt-4">
              <Accordion
                title="Terms & Conditions"
                amplitudeDetails={{
                  event: amplitudeEvents.OFFER_TERMS_CLICKED,
                  params: {
                    company_id: String(offerMeta.companyId),
                    company_name: offerMeta.companyName,
                    offer_id: String(offerMeta.offerId),
                    offer_name: offer.name,
                    brand: config.globalConfig.brand,
                  },
                }}
              >
                <PortableText
                  value={offer.termsAndConditions?.content as unknown as PortableTextBlock}
                />
              </Accordion>
            </div>
          )}
      </div>

      {qrCodeValue && (
        <div className="transition-all flex items-center flex-col p-4">
          <div className="bg-colour-surface-light p-2">
            <QRCode value={qrCodeValue} size={200} aria-label="QR code" />
          </div>
          <h1 className="pt-4 pb-2 text-colour-onSurface-light dark:text-colour-onSurface-dark font-typography-body-semibold font-typography-body-semibold-weight text-typography-body-semibold tracking-typography-body-semibold leading-typography-body-semibold">
            {qrCodeValue}
          </h1>
        </div>
      )}

      {/* --- Uncomment when Exclusions API is ready ---
      <OfferExclusions navigateBack={()=> setOpenExclusionsDetails(null)}
        openExclusionsDetails={!!openExclusionsDetails}
        exclusionsArr={
        openExclusionsDetails ? exclusionsParser[openExclusionsDetails].exclusionsArray : []
        }
        iconSrc={openExclusionsDetails ? exclusionsParser[openExclusionsDetails].iconSrc : ''}
        text={openExclusionsDetails ? exclusionsParser[openExclusionsDetails].text : ''}
        /> */}
    </div>
  );
};

export default OfferTopDetailsHeader;
