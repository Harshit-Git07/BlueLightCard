import React from 'react';
import { NextPage } from 'next';
import withAccountLayout from '../common/layouts/AccountBaseLayout/withAccountLayout';
import { Typography } from '@bluelightcard/shared-ui';
import MarketingPreferences from '@bluelightcard/shared-ui/components/MarketingPreferences';

const ContactPreferencesPage: NextPage = () => {
  return (
    <>
      <Typography variant="title-large">Marketing Preferences</Typography>
      <MarketingPreferences memberUuid={'abcd-1234'} />
    </>
  );
};

export default withAccountLayout(ContactPreferencesPage, {});
