import React from 'react';
import { RedemptionPage } from '../RedemptionPage';
import { useMedia } from 'react-use';
import { ShowCardPageMobile } from './ShowCardPageMobile';
import { ShowCardPageDesktop } from './ShowCardPageDesktop';

export const ShowCardPage = RedemptionPage((props, hooks) => {
  const isMobile = useMedia('(max-width: 500px)');

  if (isMobile) {
    return <ShowCardPageMobile {...props} />;
  }

  return <ShowCardPageDesktop {...props} />;
});
