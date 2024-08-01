import React, { Fragment } from 'react';
import { IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { ProfileIcon } from '@storybook/icons';
import { useStorybookApi, useStorybookState } from 'storybook/internal/manager-api';

export const BrandSwitcher = () => {
  const api = useStorybookApi();
  const storybookState = useStorybookState();

  const [, selectedBrand] = storybookState.refId.split('/');

  const brandsList = [
    {
      id: 'blc-uk',
      title: 'BLC UK',
    },
    {
      id: 'blc-au',
      title: 'BLC AU',
    },
    {
      id: 'dds',
      title: 'DDS',
    },
  ];

  const onBrandClick = (brand, onHide) => () => {
    const url = api.getUrlState();
    const path = url.path.replace(/blc-uk|blc-au|dds/gi, brand.id);

    const newRefId = storybookState.refId.replace(/blc-uk|blc-au|dds/gi, brand.id);

    api.navigate(path);

    const iframe = document.getElementById(`storybook-ref-${newRefId}`);

    // The iframes don't seem to get updated properly when navigating
    // via the Storybook API, so we have to do this ourselves.
    // Implementation might be wrong or Storybook Composition is a bit jank.
    if (iframe?.src) {
      const iframeUrl = new URL(iframe.src);
      iframeUrl.searchParams.set('id', storybookState.storyId);
      iframeUrl.searchParams.set('refId', newRefId);
      iframe.src = iframeUrl.toString().replace(/blc-uk|blc-au|dds/gi, brand.id);
    }

    onHide();
  };

  return (
    <Fragment>
      <WithTooltip
        placement="top"
        trigger="click"
        closeOnOutsideClick
        tooltip={({ onHide }) => {
          return (
            <TooltipLinkList
              links={brandsList.map((brand) => ({
                ...brand,
                active: selectedBrand === brand.id,
                onClick: onBrandClick(brand, onHide),
              }))}
            />
          );
        }}
      >
        <IconButton key="brand-switcher" title="Brand">
          <ProfileIcon />
        </IconButton>
      </WithTooltip>
    </Fragment>
  );
};
