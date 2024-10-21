import { FC, useState } from 'react';
import { AccordionProps } from './types';
import AccordionChildText from './AccordionChildText';

const Accordian: FC<AccordionProps> = ({ header, icon, childComponent }) => {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!active);
  };

  return (
    <div className="mb-10 rounded-xl bg-white px-7 py-6 shadow-[0px_4px_18px_0px_rgba(0,0,0,0.07)] md:px-10 md:py-8">
      <button className={`faq-btn flex w-full items-center justify-between text-left`} onClick={() => handleToggle()}>
        <div className="flex">
          <div className="fa-2xl m-3">{icon !== undefined ? icon : ''}</div>
          <div className="m-3">
            <h4 data-testid='h4-header' className="mr-2 text-base text-[#000099] text-3xl sm:text-lg md:text-2xl lg:text-3xl">{header}</h4>
          </div>
        </div>
        <span className="icon inline-flex h-8 w-full max-w-[32px] max-h-[32px] items-center justify-center rounded-full border-2 border-[#3757f9] text-lg font-semibold text-[#3757f9]">
          {active ? '-' : '+'}
        </span>
      </button>

      <div className={`${active ? 'block' : 'hidden'}`}>
        <p className="text-relaxed pt-6 text-base text-[#637381]">
          {childComponent !== undefined ? childComponent : <AccordionChildText text="This has yet to be implemented" />}
        </p>
      </div>
    </div>
  );
};

export default Accordian;
