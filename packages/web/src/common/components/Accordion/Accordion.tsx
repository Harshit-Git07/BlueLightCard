import React, { FC, useState } from 'react';
import { AccordionProps } from '@/components/Accordion/types';
import Markdown from 'markdown-to-jsx';

const Accordion: FC<AccordionProps> = ({ title, content }) => {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!active);
  };
  return (
    <div className="mb-8 w-full p-4 sm:p-8 lg:px-6 xl:px-8">
      <button className={`flex w-full text-left`} onClick={() => handleToggle()}>
        <div className="w-full">
          <h4 className="mt-1.5 font-['MuseoSans'] text-lg font-semibold text-shade-greyscale-grey-900">
            {title}
          </h4>
        </div>
        <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center">
          <span className="icon inline-flex h-12 w-full max-w-[32px] items-center justify-center text-3xl font-semibold text-[#001B80]">
            {active ? '-' : '+'}
          </span>
        </div>
      </button>

      <div className={`duration-200 ease-in-out ${active ? 'block' : 'hidden'}`}>
        <Markdown className="font-['MuseoSans'] py-3 text-shade-greyscale-grey-900 whitespace-pre-wrap">
          {content}
        </Markdown>
      </div>
    </div>
  );
};

export default Accordion;
