import React from 'react';
import { RedemptionPage } from '../RedemptionPage';
import { OfferDetailsErrorPage } from '../../OfferDetailsPage/OfferDetailsErrorPage';
import LoadingSpinner from '@/offers/components/LoadingSpinner/LoadingSpinner';

export const LegacyPage = RedemptionPage((props) => {
  if (props.state === 'error') {
    return <OfferDetailsErrorPage offer={props.offerMeta} />;
  }

  return <LoadingSpinner containerClassName="text-palette-primary" spinnerClassName="text-[5em]" />;
});
