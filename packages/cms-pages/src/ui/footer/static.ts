import { BRAND } from '@bluelightcard/shared-ui/types';

type AppStoreLink = {
  url: string;
  image: string;
  title?: string;
};

type StaticContent = Record<
  keyof typeof BRAND,
  {
    appStoreLinks?: AppStoreLink[];
    textContent?: string;
  }
>;

export const staticContent: StaticContent = {
  BLC_UK: {
    appStoreLinks: [
      {
        url: 'https://itunes.apple.com/gb/app/blue-light-card/id689970073?mt=8',
        image: '/app-store.svg',
        title: 'Get the app on Apple store',
      },
      {
        url: 'https://play.google.com/store/apps/details?id=com.bluelightcard.user&amp;hl=en_GB',
        image: '/google-play-store.svg',
        title: 'Get the app on Google Play store',
      },
    ],
  },
  BLC_AU: {
    appStoreLinks: [
      {
        url: 'https://apps.apple.com/au/app/blue-light-card/id1637398997',
        image: '/app-store.svg',
        title: 'Get the app on Apple store',
      },
      {
        url: 'https://play.google.com/store/apps/details?id=com.au.bluelightcard.user',
        image: '/google-play-store.svg',
        title: 'Get the app on Google Play store',
      },
    ],
    textContent:
      'Blue Light Card acknowledges the people and Elders, both past and present, of the Aboriginal and Torres Strait Islander Nations as the Traditional Owners and Custodians of the land, seas and skies of Australia.',
  },
  DDS_UK: {},
};
