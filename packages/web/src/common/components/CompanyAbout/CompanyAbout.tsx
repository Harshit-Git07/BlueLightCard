import { FC } from 'react';
import { CompanyAboutProps } from './types';
import Heading from '../Heading/Heading';

const CompanyAbout: FC<CompanyAboutProps> = ({ CompanyName, CompanyDescription }) => {
  return (
    <div>
      {/* Company name */}
      <Heading
        headingLevel={'h1'}
        className={
          '!text-black tablet:!text-5xl mobile:!text-base tablet:!leading-[56px] mobile:!leading-5 tablet:font-bold mobile:font-normal'
        }
      >
        {CompanyName}
      </Heading>

      {/* Company description */}
      <p className="text-[#1c1d22] font-['MuseoSans'] font-light tablet:!text-base mobile:!text-sm tablet:leading-6 mobile:leading-5">
        {CompanyDescription}
      </p>
    </div>
  );
};

export default CompanyAbout;
