import { Meta } from '@storybook/react';
import OfferTopDetailsHeaderComponent, { Props } from './index';

const props: Props = {
  showOfferDescription: true,
  showShareFavorite: true,
  showTerms: true,
  showExclusions: true,
};

const meta: Meta<typeof OfferTopDetailsHeaderComponent> = {
  title: 'Component System/Offer Sheet/Offer Top Details Header',
  component: OfferTopDetailsHeaderComponent,
  args: props,
  parameters: {
    layout: 'centered',
  },
};

const renderTemplate = (args: Partial<Props>) => (
  // This represents the width of the parent container
  <div style={{ width: '24rem' }}>
    <OfferTopDetailsHeaderComponent {...props} {...args} />
  </div>
);

export const ShowOrHideSections = () =>
  renderTemplate({
    showOfferDescription: true,
    showShareFavorite: true,
    showTerms: true,
  });

export const DescriptionSeeMore = () =>
  renderTemplate({
    showOfferDescription: true,
    showShareFavorite: false,
    showTerms: false,
  });

export default meta;
