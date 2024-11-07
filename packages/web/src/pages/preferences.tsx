import React from 'react';
import { NextPage } from 'next';
import withAccountLayout from '../common/layouts/AccountBaseLayout/withAccountLayout';
import { Typography } from '@bluelightcard/shared-ui';

const ContactPreferencesPage: NextPage = () => {
  return <Typography variant="title-large">Contact Preferences</Typography>;
};

export default withAccountLayout(ContactPreferencesPage, {});
