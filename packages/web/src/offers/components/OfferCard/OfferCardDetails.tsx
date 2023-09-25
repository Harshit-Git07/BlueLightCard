import React, { FC } from 'react';
import { OfferCardDetailsProps } from './types';

const OfferCardDetails: FC<OfferCardDetailsProps> = ({
  offerName,
  companyName,
  variant = 'standard',
}) => {
  const small = (
    <>
      <div className="px-5 desktop:pt-4 laptop:pt-4 tablet:pt-2.5 mobile:pt-3">
        <p className='text-shade-greyscale-black dark:text-shade-greyscale-white text-base font-normal font-["MuseoSans"] truncate'>
          {offerName}
        </p>
      </div>
    </>
  );

  const standard = (
    <>
      <div className="pl-5 desktop:pt-4 laptop:pt-4 tablet:pt-2.5 mobile:pt-3">
        <p className='text-shade-greyscale-black font-light desktop:text-lg laptop:text-lg tablet:text-md mobile:text-sm font-["MuseoSans"] dark:text-shade-greyscale-white'>
          {companyName}
        </p>
      </div>
      <div className="px-5">
        <p className='text-shade-greyscale-black dark:text-shade-greyscale-white desktop:text-xl laptop:text-xl mobile:text-md tablet:text-lg font-bold font-["MuseoSans"] truncate'>
          {offerName}
        </p>
      </div>
    </>
  );

  return variant === 'small' ? small : standard;
};
export default OfferCardDetails;
