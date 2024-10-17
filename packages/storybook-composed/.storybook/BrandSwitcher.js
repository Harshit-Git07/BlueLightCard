import React from 'react';
import { IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { ProfileIcon } from '@storybook/icons';
import { useStorybookApi, useStorybookState } from 'storybook/internal/manager-api';

export const BrandSwitcher = () => {
  const api = useStorybookApi();
  const storybookState = useStorybookState();

  const [, selectedBrand] = storybookState.ref ? storybookState.refId.split('/') : '';

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
      id: 'dds-uk',
      title: 'DDS UK',
    },
  ];

  const onBrandClick = (brand, onHide) => () => {
    const url = api.getUrlState();
    const brandReplaceRegex = /blc-uk|blc-au|dds-uk/gi;
    const path = url.path.replace(brandReplaceRegex, brand.id);

    const newRefId = storybookState.refId.replace(brandReplaceRegex, brand.id);

    api.navigate(path);

    const iframe = document.getElementById(`storybook-ref-${newRefId}`);

    // The iframes don't seem to get updated properly when navigating
    // via the Storybook API, so we have to do this ourselves.
    // Implementation might be wrong or Storybook Composition is a bit jank.
    if (iframe?.src) {
      const iframeUrl = new URL(iframe.src);
      iframeUrl.searchParams.set('id', storybookState.storyId);
      iframeUrl.searchParams.set('refId', newRefId);
      iframe.src = iframeUrl.toString().replace(brandReplaceRegex, brand.id);
    }

    onHide();
  };

  return (
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
  );
};
