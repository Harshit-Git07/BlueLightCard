import React, { FC, useState } from 'react';
import { AccordionProps } from '@/components/Accordion/types';
import Image from '../Image/Image';

const Accordion: FC<AccordionProps> = ({ title, children }) => {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!active);
  };
  return (
    <div className="w-full leading-6">
      <button
        className={`flex w-full text-left py-3 px-1 items-center border-b-[0.5px] border-b-[#DCDCDC] border-solid`}
        onClick={() => handleToggle()}
      >
        <div className="w-full">
          <h4 className="font-['MuseoSans'] text-base font-medium text-shade-greyscale-grey-900">
            {title}
          </h4>
        </div>
        <div className="flex max-w-[40px] items-center justify-end">
          {active ? (
            <Image src="/assets/minus.svg" alt="minus" fill={false} width={14} height={14} />
          ) : (
            <Image src="/assets/plus.svg" alt="plus" fill={false} width={15} height={15} />
          )}
        </div>
      </button>

      <div
        className={`duration-200 ease-in-out ${
          active ? 'block' : 'hidden'
        } font-['MuseoSans'] py-3 text-base break-words font-light leading-5 whitespace-pre-wrap`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
