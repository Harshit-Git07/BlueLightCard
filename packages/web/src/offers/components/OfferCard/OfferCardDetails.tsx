import React, { FC } from 'react';
import { OfferCardDetailsProps } from './types';
import Link from '@/components/Link/Link';
import OfferCardDetailsConfig, { convertOfferTagIndexToString } from './OfferCardDetailsConfig';

const OfferCardDetails: FC<OfferCardDetailsProps> = ({
  offerName,
  companyName,
  offerLink,
  showFindOutMore = false,
  variant = 'standard',
  xPaddingClassName = 'px-5',
  offerTag,
  upperCaseTitle = false,
}) => {
  const { offerTagIcon, offerTagText } = OfferCardDetailsConfig(
    typeof offerTag === 'string' ? offerTag : convertOfferTagIndexToString(offerTag)
  );

  const small = (
    <>
      <div className={`${xPaddingClassName} desktop:pt-4 laptop:pt-4 tablet:pt-2.5 mobile:pt-3`}>
        <p className="text-shade-greyscale-black dark:text-shade-greyscale-white pb-3 text-center">
          {offerTagIcon} {offerTagText}
        </p>
        <p className='text-shade-greyscale-black dark:text-shade-greyscale-white text-base font-light font-["SourceSansPro"] text-center truncate'>
          {offerName}
        </p>
      </div>
    </>
  );

  const standard = (
    <>
      <div className={`${xPaddingClassName} desktop:pt-4 laptop:pt-4 tablet:pt-2.5 mobile:pt-3`}>
        <p className="text-shade-greyscale-black dark:text-shade-greyscale-white pb-3">
          {offerTagIcon} {offerTagText}
        </p>
        <p className='text-shade-greyscale-black font-bold desktop:text-lg laptop:text-lg tablet:text-md mobile:text-sm font-["MuseoSans"] dark:text-shade-greyscale-white'>
          {upperCaseTitle ? companyName.toUpperCase() : companyName}
        </p>
      </div>
      <div className={xPaddingClassName}>
        <p className='text-shade-greyscale-grey-600 dark:text-shade-greyscale-white desktop:text-md laptop:text-ms mobile:text-sm tablet:text-md font-light font-["SourceSansPro"] truncate'>
          {offerName}
        </p>
      </div>
      <div className={`${xPaddingClassName} pt-2`}>
        {offerLink && showFindOutMore && <Link href={offerLink}>Find out more...</Link>}
        {!offerLink && showFindOutMore && <Link>Find out more...</Link>}
      </div>
    </>
  );

  return variant === 'small' ? small : standard;
};
export default OfferCardDetails;
