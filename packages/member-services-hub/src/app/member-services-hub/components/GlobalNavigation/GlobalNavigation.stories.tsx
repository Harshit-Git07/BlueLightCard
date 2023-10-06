import type { Meta, StoryFn } from '@storybook/react';

import GlobalNavigation from './GlobalNavigation';

const componentMeta: Meta<typeof GlobalNavigation> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'member-services-hub/GlobalNavigation',
  component: GlobalNavigation,
};

export default componentMeta;

const DefaultTemplate: StoryFn<typeof GlobalNavigation> = () => <GlobalNavigation />;

export const Default = DefaultTemplate.bind({});
