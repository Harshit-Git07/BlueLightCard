import React from 'react';
import { NextPage } from 'next';
import withAccountLayout from '../common/layouts/AccountBaseLayout/withAccountLayout';
import { fonts, MarketingPreferences, useMemberId } from '@bluelightcard/shared-ui';

const ContactPreferencesPage: NextPage = () => {
  const memberId = useMemberId();

  return (
    <div className="mt-[6px]">
      <h2 className={fonts.titleLarge}>Marketing preferences</h2>
      <MarketingPreferences memberUuid={memberId} />
    </div>
  );
};

export default withAccountLayout(ContactPreferencesPage, {});
