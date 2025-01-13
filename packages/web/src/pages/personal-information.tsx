import React from 'react';
import { NextPage } from 'next';
import withAccountLayout from '../common/layouts/AccountBaseLayout/withAccountLayout';
import { fonts, PersonalInformation } from '@bluelightcard/shared-ui';

const PersonalInformationPage: NextPage = () => {
  return (
    <div className="mt-[6px] flex flex-col gap-[24px]">
      <h2 className={fonts.titleLarge}>Personal Information</h2>
      <PersonalInformation />
    </div>
  );
};

export default withAccountLayout(PersonalInformationPage, {});
