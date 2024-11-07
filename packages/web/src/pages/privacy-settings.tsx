import React from 'react';
import { NextPage } from 'next';
import withAccountLayout from '../common/layouts/AccountBaseLayout/withAccountLayout';
import { Typography } from '@bluelightcard/shared-ui';

const PrivacySettingsPage: NextPage = () => {
  return <Typography variant="title-large">Privacy</Typography>;
};

export default withAccountLayout(PrivacySettingsPage, {});
