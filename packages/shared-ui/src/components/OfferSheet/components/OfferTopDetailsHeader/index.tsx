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

export type Props = {
  showOfferDescription?: boolean;
  showShareFavorite?: boolean;
  showTerms?: boolean;
  showExclusions?: boolean;
};

export const getShareButtonTargetPage = (
  companyPageExperiment: string | undefined,
  companyId: number | string | null,
  offerId: number | string | undefined,
) => {
  let targetUrl = '/';

  if (companyPageExperiment === 'treatment') {
    targetUrl += 'company';
  } else {
    targetUrl += 'offerdetails.php';
  }

  return `${targetUrl}?cid=${companyId}&oid=${offerId}`;
};

const OfferTopDetailsHeader: FC<Props> = ({
  showOfferDescription = true,
  showShareFavorite = true,
  showTerms = true,
  showExclusions = true,
}) => {
  const adapter = usePlatformAdapter();
  const config = useSharedUIConfig();
  const { offerDetails: offerData, offerMeta, qrCodeValue } = useAtomValue(offerSheetAtom);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  // TODO CDN URL could be replaced with global var?
  const finalFallbackImage = `${config.globalConfig.cdnUrl}/misc/Logo_coming_soon.jpg`;
  const isDescriptionLong =
    offerData.description &&
    toPlainText(offerData.description.content as unknown as PortableTextBlock).length > 300;

  const hostname = adapter.getBrandURL();

  const handleSeeMore = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const urlContainsImage = /\.(jpe?g|png|gif|bmp)$/i.test(offerData.image ?? '');
    if (offerData.image && urlContainsImage) {
      setImageSource(offerData.image);
    } else if (offerData.companyId) {
      const imageUrl = `${config.globalConfig.cdnUrl}/companyimages/complarge/retina/${offerData.companyId}.jpg`;
      setImageSource(imageUrl);
    }
  }, [offerData?.image, offerData.companyId, config.globalConfig.cdnUrl]);

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
        {/* Offer Name */}
        <Heading
          headingLevel={'h2'}
          className={
            'mt-4 text-colour-onSurface-light dark:text-colour-onSurface-dark font-typography-title-large font-typography-title-large-weight text-typography-title-large tracking-typography-title-large leading-typography-title-large'
          }
        >
          {decodeEntities(offerData.name || '')}
        </Heading>

        {/* Offer description */}
        {showOfferDescription &&
          offerData.description &&
          !(adapter.platform === PlatformVariant.MobileHybrid && qrCodeValue) && (
            <>
              <div
                className={`mt-2 text-colour-onSurface-light dark:text-colour-onSurface-dark font-typography-body-light font-typography-body-light-weight text-typography-body-light tracking-typography-body-light leading-typography-body-light ${
                  isDescriptionLong && !expanded
                    ? 'mobile:line-clamp-3 tablet:line-clamp-4 desktop:line-clamp-5'
                    : ''
                }`}
              >
                <PortableText
                  value={offerData.description.content as unknown as PortableTextBlock}
                />
              </div>

              {/* Show more/less button for description */}
              {offerData.description && isDescriptionLong && (
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
                    name: offerData.name,
                    description: offerData.description as PortableTextBlock,
                    url: `${
                      typeof window !== 'undefined'
                        ? `${window.location.protocol}//${hostname}`
                        : ''
                    }${getShareButtonTargetPage(
                      adapter.platform == PlatformVariant.MobileHybrid
                        ? adapter.getAmplitudeFeatureFlag('app-new-company-page')
                        : adapter.getAmplitudeFeatureFlag('web-new-company-sheet'),
                      offerData.companyId,
                      offerData.id,
                    )}`,
                  },
                  shareLabel: 'Share offer',
                  amplitudeDetails: {
                    event: amplitudeEvents.OFFER_SHARE_CLICKED,
                    params: {
                      company_id: String(offerMeta.companyId),
                      company_name: offerMeta.companyName,
                      offer_id: String(offerMeta.offerId),
                      offer_name: offerData.name,
                      brand: config.globalConfig.brand,
                    },
                  },
                }}
              />
            </div>
          )}

        {/* Exclusions */}
        {/* --- Uncomment when Exclusions API is ready --- */}
        {/* TODO add check on API integration do only display this block if exclusions exist in the offer*/}
        {/* {showExclusions && (
            <div className="w-full text-left mt-4">
              <Accordion title="Exclusions">
                <IconListItem
                  iconSrc="/assets/box-open-light-slash.svg"
                  title="Not valid on certain item(s)"
                  link="View details"
                  onClickLink={() => setOpenExclusionsDetails('items')}
                />
                <IconListItem
                  iconSrc="/assets/store-light-slash.svg"
                  title="Not valid in certain store(s)"
                  link="View details"
                  onClickLink={() => setOpenExclusionsDetails('store')}
                />
                <IconListItem
                  iconSrc="/assets/tags-light-slash.svg"
                  title="Not valid with other promotions"
                />
                <IconListItem
                  iconSrc="/assets/circle-sterling-light.svg"
                  title="Only valid on full price items"
                />
              </Accordion>
            </div>
          )} */}

        {/* Offer Terms & Conditions */}
        {showTerms &&
          offerData.termsAndConditions &&
          !(adapter.platform === PlatformVariant.MobileHybrid && qrCodeValue) && (
            <div className={`w-full text-left ${showExclusions ? '' : 'mt-4'}`}>
              <Accordion
                title="Terms & Conditions"
                amplitudeDetails={{
                  event: amplitudeEvents.OFFER_TERMS_CLICKED,
                  params: {
                    company_id: String(offerMeta.companyId),
                    company_name: offerMeta.companyName,
                    offer_id: String(offerMeta.offerId),
                    offer_name: offerData.name,
                    brand: config.globalConfig.brand,
                  },
                }}
              >
                <PortableText
                  value={offerData.termsAndConditions.content as unknown as PortableTextBlock}
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
        <OfferExclusions
          navigateBack={() => setOpenExclusionsDetails(null)}
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
