import { FC } from 'react';
import { AccordionChildTextProps } from './types';

const AccordionChildText: FC<AccordionChildTextProps> = ({ text }) => {
  return (
    <>
      <div className="w-[109.6%] ml-[-50px] h-[1px] bg-[#e7e7e7]"></div>
      <p className="ml-3 mt-5">{text}</p>
    </>
  );
};

export default AccordionChildText;
