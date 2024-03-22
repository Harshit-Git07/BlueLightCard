import React from 'react';
import { RedemptionPage } from '../RedemptionPage';
import { useMedia } from 'react-use';
import { VaultQRPageMobile } from './VaultQRPageMobile';
import { VaultQRPageDesktop } from './VaultQRPageDesktop';

export const VaultQRPage = RedemptionPage((props) => {
  const isMobile = useMedia('(max-width: 500px)');

  if (isMobile) {
    return <VaultQRPageMobile {...props} />;
  }

  return <VaultQRPageDesktop {...props} />;
});
