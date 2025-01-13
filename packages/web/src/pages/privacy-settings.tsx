import React from 'react';
import { NextPage } from 'next';
import Button from '@bluelightcard/shared-ui/components/Button-V2/index';
import { ThemeVariant, fonts } from '@bluelightcard/shared-ui';
import { faDownload, faTrash } from '@fortawesome/pro-solid-svg-icons';
import withAccountLayout from '../common/layouts/AccountBaseLayout/withAccountLayout';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';

export const supportLink = (brand: BRANDS) => {
  const SUPPORT_URLS = {
    [BRANDS.BLC_UK]:
      'https://support.bluelightcard.co.uk/hc/en-gb/requests/new?ticket_form_id=23553686637969',
    [BRANDS.DDS_UK]:
      'https://support.defencediscountservice.co.uk/hc/en-gb/requests/new?ticket_form_id=25146038943889',
    [BRANDS.BLC_AU]:
      'https://support-zendesk.bluelightcard.com.au/hc/en-gb/requests/new?ticket_form_id=28000130152593',
  };

  return SUPPORT_URLS[brand] || SUPPORT_URLS[BRANDS.BLC_UK];
};

const PrivacySettingsPage: NextPage = () => {
  const handleOpenLinkInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="mt-[6px]">
      <h2 className={`pb-[24px] ${fonts.titleLarge}`}>Privacy</h2>

      <div className="pb-5 grid laptop:grid-cols-3 w-full">
        <div className="laptop:col-span-2">
          <h3
            className={`pb-1 ${fonts.body} text-colour-onSurface dark:text-colour-onSurface-dark`}
          >
            Request your data access
          </h3>
          <p
            className={` ${fonts.body} text-colour-onSurface-subtle-light dark:!text-colour-onSurface-subtle-dark`}
          >
            Access all the data we hold on you anytime you wish.
          </p>
        </div>
        <div className="laptop:col-span-1 flex w-full laptop:justify-end laptop:items-center">
          <Button
            invertColor={false}
            variant={ThemeVariant.Tertiary}
            iconRight={faDownload}
            onClick={() => handleOpenLinkInNewTab(supportLink(BRAND))}
          >
            Request your data
          </Button>
        </div>
      </div>

      <div className="grid laptop:grid-cols-3 w-full">
        <div className="laptop:col-span-2">
          <h3
            className={`pb-1 ${fonts.body} text-colour-onSurface dark:text-colour-onSurface-dark`}
          >
            Delete your account
          </h3>
          <p
            className={`${fonts.body} text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark max-w-[650px]`}
          >
            You can delete your account anytime. This will remove your personal data and end your
            access to the Blue Light Card community and its exclusive offers.
          </p>
        </div>
        <div className="laptop:col-span-1 flex w-full laptop:justify-end laptop:items-center">
          <Button
            variant={ThemeVariant.TertiaryDanger}
            iconRight={faTrash}
            size="Small"
            onClick={() => handleOpenLinkInNewTab(supportLink(BRAND))}
          >
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withAccountLayout(PrivacySettingsPage, {});
