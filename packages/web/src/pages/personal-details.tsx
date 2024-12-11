import React from 'react';
import { NextPage } from 'next';
import withAccountLayout from '../common/layouts/AccountBaseLayout/withAccountLayout';
import PersonalDetails from '@bluelightcard/shared-ui/components/PersonalDetails';

const PersonalDetailsPage: NextPage = () => {
  return <PersonalDetails />;
};

export default withAccountLayout(PersonalDetailsPage, {});
