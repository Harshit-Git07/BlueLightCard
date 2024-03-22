import React from 'react';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '@/components/Image/Image';
import Label from '@/components/Label/Label';
import MagicButton from '@/components/MagicButton/MagicButton';
import { Props as RedemptionPageProps } from '../RedemptionPage';

export const ShowCardPageMobile = (props: RedemptionPageProps) => {
  return (
    <div className="flex flex-col h-[100vh] items-center mx-auto">
      {/* Top section - Product info, share/fav etc. */}
      <div className="flex flex-col text-center items-center justify-center text-wrap space-y-2 mt-6 mx-auto">
        <Image
          src="/assets/blc-card.png"
          alt="blcCard"
          fill={false}
          width={250}
          height={400}
          className="shadow-md rounded-[30px]"
        />
      </div>
      {/* Bottom section - Button labels etc */}
      <div className="w-full pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-white">
        <div className="w-full flex flex-wrap mb-2 justify-center">
          {props.labels.map((label, index) => (
            <Label key={index} type={'normal'} text={label} className="m-1" />
          ))}
        </div>

        <MagicButton variant="secondary" className="w-full" animate>
          <div className="flex-col min-h-7 text-nowrap items-center">
            <div className="text-md font-bold flex gap-2 items-center">
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              <div>Simply show your Blue Light Card</div>
            </div>
            <div className="text-sm text-[#616266] font-normal">to get your discount</div>
          </div>
        </MagicButton>
      </div>
    </div>
  );
};
