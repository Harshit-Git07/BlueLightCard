import type { Meta } from '@storybook/react';

import EligibilityCard from './EligibilityCard';

const meta: Meta<typeof EligibilityCard> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'EligibilityCard',
  component: EligibilityCard,
};

export default meta;
