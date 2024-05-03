import Image from '../../../Image';
import { FC, useEffect, useState } from 'react';
import Heading from '../../../Heading';
import { useAtomValue } from 'jotai';
import { offerSheetAtom } from '../../store';
import Button from '../../../Button';
import { ThemeVariant } from '../../../../types';
import ShareButton from '../../../ShareButton';
import Accordion from '../../../Accordion';
import Markdown from 'markdown-to-jsx';
import amplitudeEvents from '../../../../utils/amplitude/events';

type Props = {
  showOfferDescription?: boolean;
  showShareFavorite?: boolean;
  showTerms?: boolean;
  showExclusions?: boolean;
};

const OfferTopDetailsHeader: FC<Props> = ({
  showOfferDescription = true,
  showShareFavorite = true,
  showTerms = true,
  showExclusions = true,
}) => {
  const { offerDetails: offerData, cdnUrl, offerMeta, BRAND } = useAtomValue(offerSheetAtom);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  // TODO CDN URL could be replaced with global var?
  const finalFallbackImage = `${cdnUrl}/misc/Logo_coming_soon.jpg`;

  const handleSeeMore = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setImageSource(offerData?.companyLogo ?? finalFallbackImage);
  }, [offerData]);

  return (
    <div className="flex flex-col text-center text-wrap space-y-2 p-[24px_24px_14px_24px] pt-0 font-museo">
      <div>
        {/* Offer Image */}
        <div className="flex justify-center">
          {imageSource && (
            <Image
              src={imageSource}
              alt="Some dummy alt text here"
              responsive={false}
              width={100}
              height={64}
              className="!relative object-contain object-center rounded shadow-[0_4px_12px_0_rgba(0,0,0,0.15)]"
              onError={() => setImageSource(finalFallbackImage)}
            />
          )}
        </div>
        {/* Offer Name */}
        <Heading headingLevel={'h2'} className={'leading-8 mt-4 !text-black'}>
          {offerData.name}
        </Heading>
        {/* Offer description */}
        {showOfferDescription && (
          <>
            <p
              className={`text-base font-light font-museo leading-5 mt-2 ${
                offerData.description && offerData.description.length > 300 && !expanded
                  ? 'mobile:line-clamp-3 tablet:line-clamp-4 desktop:line-clamp-5'
                  : ''
              }`}
            >
              {offerData.description}
            </p>

            {/* Show more/less button for description */}
            {offerData.description && offerData.description.length > 300 && (
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
        {showShareFavorite && (
          <div className="flex flex-wrap justify-center mt-4">
            <ShareButton
              {...{
                shareDetails: {
                  name: offerData.name,
                  description: offerData.description,
                  url: `${
                    typeof window !== 'undefined'
                      ? `${window.location.protocol}/${window.location.hostname}`
                      : ''
                  }/offerdetails.php?cid=${offerData.companyId}&oid=${offerData.id}`,
                },
                shareLabel: 'Share offer',
                amplitudeDetails: {
                  event: amplitudeEvents.OFFER_SHARE_CLICKED,
                  params: {
                    company_id: offerMeta.companyId,
                    company_name: offerMeta.companyName,
                    offer_id: offerMeta.offerId,
                    offer_name: offerData.name,
                    brand: BRAND,
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
        {showTerms && offerData.terms && (
          <div className={`w-full text-left ${showExclusions ? '' : 'mt-4'}`}>
            <Accordion
              title="Terms & Conditions"
              amplitudeDetails={{
                event: amplitudeEvents.OFFER_TERMS_CLICKED,
                params: {
                  company_id: offerMeta.companyId,
                  company_name: offerMeta.companyName,
                  offer_id: offerMeta.offerId,
                  offer_name: offerData.name,
                  brand: BRAND,
                },
              }}
            >
              <Markdown>{offerData.terms}</Markdown>
            </Accordion>
          </div>
        )}
      </div>

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
