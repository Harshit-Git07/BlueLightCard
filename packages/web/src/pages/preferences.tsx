import React from 'react';
import { NextPage } from 'next';
import withAccountLayout from '../common/layouts/AccountBaseLayout/withAccountLayout';
import { fonts, MarketingPreferences } from '@bluelightcard/shared-ui';

const ContactPreferencesPage: NextPage = () => {
  return (
    <div className="mt-[6px]">
      <h2 className={fonts.titleLarge}>Marketing Preferences</h2>
      <MarketingPreferences memberUuid={'abcd-1234'} />
    </div>
  );
};

export default withAccountLayout(ContactPreferencesPage, {});
