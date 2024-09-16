import Image from '../Image';
import { useState } from 'react';
import Heading from '../Heading';
import Button from '../Button';
import { ThemeVariant } from '../../types';
import ShareButton from '../ShareButton';
import Accordion from '../Accordion';
import Markdown from 'markdown-to-jsx';
import amplitudeEvents from '../../utils/amplitude/events';
import { useSharedUIConfig } from '../../providers';
import type { OfferData } from '../../api/offers';
import { mergeClassnames } from '../../utils/cssUtils';
import { Amplitude } from '../../adapters';

export type Props = {
  showOfferDescription?: boolean;
  showShareButton?: boolean;
  showTerms?: boolean;
  showExclusions?: boolean;
  offerData: OfferData;
  className?: string;
  companyName: string;
  amplitude?: Amplitude | null;
};

const OfferSheetHeader = ({
  showOfferDescription = true,
  showShareButton = true,
  showTerms = true,
  showExclusions = true,
  className,
  offerData,
  companyName,
  amplitude,
}: Props) => {
  const config = useSharedUIConfig();
  const [expanded, setExpanded] = useState(false);
  const finalFallbackImage = `${config.globalConfig.cdnUrl}/misc/Logo_coming_soon.jpg`;

  const handleSeeMore = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={mergeClassnames(
        className,
        'flex flex-col text-center text-wrap space-y-2 p-[24px_24px_14px_24px] pt-0',
      )}
    >
      <div className="space-y-2">
        {/* Offer Image */}
        <div className="flex justify-center">
          <Image
            src={offerData.companyLogo ?? finalFallbackImage}
            alt={'company logo'}
            responsive={false}
            width={100}
            height={64}
            className="!relative object-contain object-center rounded shadow-[0_4px_12px_0_rgba(0,0,0,0.15)]"
          />
        </div>
        {/* Offer Name */}
        <Heading headingLevel={'h2'}>{offerData.name}</Heading>
        {/* Offer description */}
        {showOfferDescription && (
          <>
            <p
              className={`text-colour-onSurface-light dark:text-colour-onSurface-dark font-typography-body-light font-typography-body-light-weight text-typography-body-light tracking-typography-body-light leading-typography-body-light mt-2 ${
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

        {/* Share */}
        {showShareButton && (
          <div className="flex flex-wrap justify-center mt-4">
            <ShareButton
              {...{
                shareDetails: {
                  name: offerData.name,
                  description: offerData.description,
                  url: `${
                    typeof window !== 'undefined'
                      ? `${window.location.protocol}//${window.location.hostname}`
                      : ''
                  }/offerdetails.php?cid=${offerData.companyId}&oid=${offerData.id}`,
                },
                shareLabel: 'Share offer',
                amplitudeDetails: {
                  event: amplitudeEvents.OFFER_SHARE_CLICKED,
                  params: {
                    company_id: offerData.companyId,
                    company_name: companyName,
                    offer_id: offerData.id,
                    offer_name: offerData.name,
                    brand: config.globalConfig.brand,
                  },
                },
              }}
              amplitude={amplitude}
            />
          </div>
        )}

        {/* Offer Terms & Conditions */}
        {showTerms && offerData.terms && (
          <div className={`w-full text-left ${showExclusions ? '' : 'mt-4'}`}>
            <Accordion
              title="Terms & Conditions"
              amplitude={amplitude}
              amplitudeDetails={{
                event: amplitudeEvents.OFFER_TERMS_CLICKED,
                params: {
                  company_id: offerData.companyId,
                  company_name: companyName,
                  offer_id: offerData.id,
                  offer_name: offerData.name,
                  brand: config.globalConfig.brand,
                },
              }}
            >
              <Markdown>{offerData.terms}</Markdown>
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferSheetHeader;
