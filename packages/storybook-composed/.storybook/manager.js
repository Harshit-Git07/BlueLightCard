import React from 'react';
import { addons, types } from '@storybook/manager-api';
import { BrandSwitcher } from './BrandSwitcher';

addons.register('brand-switcher', () => {
  addons.add('brand-switcher', {
    title: 'Brand Switcher',
    type: types.TOOL,
    match: ({ tabId, viewMode }) => !tabId && viewMode === 'story',
    render: () => <BrandSwitcher />,
  });
});
