import { Meta, StoryFn } from '@storybook/react';
import TenancyBannerPresenter from './Components/TenancyBannerPresenter';

const componentMeta: Meta<typeof TenancyBannerPresenter> = {
  title: 'Molecules/Tenancy Banner',
  component: TenancyBannerPresenter,
  args: {
    bannersData: {
      small: [
        {
          imageSource: '/assets/forest.jpeg',
          link: 'www.google.com',
          __typename: 'Banner',
        },
        {
          imageSource: '/assets/forest.jpeg',
          link: 'www.apple.com',
          __typename: 'Banner',
        },
      ],
      large: [
        {
          imageSource: '/assets/forest.jpeg',
          legacyCompanyId: 123,
          link: 'www.google.com',
          __typename: 'Banner',
        },
        {
          imageSource: '/assets/forest.jpeg',
          legacyCompanyId: 456,
          link: 'www.google.com',
          __typename: 'Banner',
        },
        {
          imageSource: '/assets/forest.jpeg',
          legacyCompanyId: 789,
          link: 'www.apple.com',
          __typename: 'Banner',
        },
      ],
    },
  },
  argTypes: {
    variant: {
      description: 'Controls which variant of tenancy banner to render, either small or large',
      control: 'radio',
      options: ['small', 'large'],
    },
  },
  parameters: {
    status: 'done',
  },
};

const DefaultTemplate: StoryFn<typeof TenancyBannerPresenter> = (args) => {
  return <TenancyBannerPresenter {...args} />;
};

export const Large = DefaultTemplate.bind({});

Large.args = {
  variant: 'large',
};

export const Small = DefaultTemplate.bind({});

Small.args = {
  variant: 'small',
};

export default componentMeta;
