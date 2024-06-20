import { Meta, StoryFn } from '@storybook/react';
import BannerCarousel from './BannerCarousel';
import { CampaignCardProps } from '../CampaignCard/types';

const componentMeta: Meta = {
  title: 'Component System/BannerCarousel',
  component: BannerCarousel,
  argTypes: {
    bannerOne: {
      name: 'Show Banner One',
      control: 'boolean',
    },
    bannerOneName: {
      name: 'Banner One Name',
      control: 'text',
      if: {
        arg: 'bannerOne',
      },
    },
    bannerOneImage: {
      name: 'Banner One Image URL',
      control: 'text',
      if: {
        arg: 'bannerOne',
      },
    },
    bannerOneLink: {
      name: 'Banner One Link URL',
      control: 'text',
      if: {
        arg: 'bannerOne',
      },
    },
    bannerTwo: {
      name: 'Show Banner Two',
      control: 'boolean',
    },
    bannerTwoName: {
      name: 'Banner Two Name',
      control: 'text',
      if: {
        arg: 'bannerTwo',
      },
    },
    bannerTwoImage: {
      name: 'Banner Two Image URL',
      control: 'text',
      if: {
        arg: 'bannerTwo',
      },
    },
    bannerTwoLink: {
      name: 'Banner Two Link URL',
      control: 'text',
      if: {
        arg: 'bannerTwo',
      },
    },
    bannerThree: {
      name: 'Show Banner Three',
      control: 'boolean',
    },
    bannerThreeName: {
      name: 'Banner Three Name',
      control: 'text',
      if: {
        arg: 'bannerThree',
      },
    },
    bannerThreeImage: {
      name: 'Banner Three Image URL',
      control: 'text',
      if: {
        arg: 'bannerThree',
      },
    },
    bannerThreeLink: {
      name: 'Banner Three Link URL',
      control: 'text',
      if: {
        arg: 'bannerThree',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'This component combines the use of the SwiperCarousel and the CampaignCard to create a Banner Carousel for image offers.',
      },
    },
    controls: {
      exclude: ['banners'],
    },
  },
};

const DefaultTemplate: StoryFn = ({
  bannerOne,
  bannerOneName,
  bannerOneImage,
  bannerOneLink,
  bannerTwo,
  bannerTwoName,
  bannerTwoImage,
  bannerTwoLink,
  bannerThree,
  bannerThreeName,
  bannerThreeImage,
  bannerThreeLink,
}) => {
  const banners: CampaignCardProps[] = [];
  if (bannerOne) {
    banners.push({ image: bannerOneImage, linkUrl: bannerOneLink, name: bannerOneName });
  }
  if (bannerTwo) {
    banners.push({ image: bannerTwoImage, linkUrl: bannerTwoLink, name: bannerTwoName });
  }
  if (bannerThree) {
    banners.push({ image: bannerThreeImage, linkUrl: bannerThreeLink, name: bannerThreeName });
  }
  return <BannerCarousel banners={banners} />;
};

export const Default = DefaultTemplate.bind({});

Default.args = {
  bannerOne: true,
  bannerOneName: 'Banner One',
  bannerOneImage: 'https://picsum.photos/2400/1000',
  bannerOneLink: 'https://www.google.com',
  bannerTwo: true,
  bannerTwoName: 'Banner Two',
  bannerTwoImage: 'https://picsum.photos/600/250',
  bannerTwoLink: 'https://bluelightcard.co.uk',
  bannerThree: false,
  bannerThreeName: '',
  bannerThreeImage: '',
  bannerThreeLink: '',
};

export default componentMeta;
