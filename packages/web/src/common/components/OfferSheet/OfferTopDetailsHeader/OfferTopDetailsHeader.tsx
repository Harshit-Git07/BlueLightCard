import { useState } from 'react';
import Image from '@/components/Image/Image';
import getCDNUrl from '@/utils/getCDNUrl';
import { ThemeVariant } from '@/types/theme';
import { OfferTopDetailsHeaderProps } from '../types';
import Button from '../../Button/Button';
import Accordion from '../../Accordion/Accordion';
import ShareButton from '@/components/ShareButton/ShareButton';
import FavouriteButton from '@/components/FavouriteButton/FavouriteButton';
import Heading from '@/components/Heading/Heading';
import Markdown from '@/components/Markdown/Markdown';

const OfferTopDetailsHeader: React.FC<OfferTopDetailsHeaderProps> = ({
  offerMeta,
  offerData,
  showOfferDescription = true,
  showShareFavorite = true,
  showTerms = true,
  showExclusions = true,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [shareBtnState, setShareBtnState] = useState<'share' | 'error' | 'success'>('share');
  const [openExclusionsDetails] = useState<'items' | 'store' | null>(null);

  const exclusionsParser = {
    items: {
      iconSrc: '/assets/box-open-light-slash.svg',
      text: 'item(s)',
      exclusionsArray: ['Galaxy S24', 'Galaxy S24+', 'Galaxy Z Flip 5', 'Galaxy S24 Ultra'],
    },
    store: {
      iconSrc: '/assets/store-light-slash.svg',
      text: 'store(s)',
      exclusionsArray: [],
    },
  };

  const finalFallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);
  const imageSource = offerData.companyLogo ?? finalFallbackImage;

  console.log(offerData.companyLogo && getCDNUrl(offerData.companyLogo));

  // Event handlers
  const copyLink = () => {
    const copyUrl = `${window.location.protocol}//${window.location.hostname}/offerdetails.php?cid=${offerData.companyId}&oid=${offerData.id}`;

    if (!navigator.clipboard) {
      return false;
    }
    navigator.clipboard.writeText(copyUrl);
    return true;
  };

  const handleSeeMore = () => {
    setExpanded(!expanded);
  };

  const onShareClick = () => {
    const success = copyLink();
    if (success) {
      setShareBtnState('success');
    } else {
      setShareBtnState('error');
      setTimeout(() => setShareBtnState('share'), 1500);
    }
  };

  return (
    <>
      <div className="flex flex-col text-center text-wrap space-y-2 p-[24px_24px_14px_24px] pt-0 font-['MuseoSans'] ">
        <div
          className={`${
            openExclusionsDetails && 'translate-x-[-110%] relative'
          } transition-all duration-15000 `}
        >
          {/* Offer Image */}
          <div className="flex justify-center">
            {imageSource && (
              <Image
                src={imageSource}
                alt={offerData.name as string}
                responsive={false}
                width={100}
                height={64}
                className="!relative object-contain object-center rounded shadow-[0_4px_12px_0_rgba(0,0,0,0.15)]"
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
                className={`text-base font-light font-['MuseoSans'] leading-5 mt-2 ${
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
                  className={`w-fit`}
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
            <div className={`flex flex-wrap justify-center mt-4`}>
              <ShareButton {...{ onShareClick, shareBtnState }} />
              <FavouriteButton offerMeta={offerMeta} offerData={offerData} />
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
              <Accordion title="Terms & Conditions">
                <Markdown content={offerData.terms} />
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
    </>
  );
};

export default OfferTopDetailsHeader;
