import { env } from '../../../env';
import { BRAND } from '../../../types';

interface NavigationItem {
  text: string;
  link: string;
}

export function useNavigationItems(): NavigationItem[] {
  switch (env.APP_BRAND) {
    case BRAND.DDS_UK:
      return ddsUkItems;
    case BRAND.BLC_AU:
      return blcAuItems;
    default:
      return blcUkItems;
  }
}

const ddsUkItems: NavigationItem[] = [
  {
    text: 'Terms & Conditions',
    link: 'https://www.defencediscountservice.co.uk/terms_and_conditions.php',
  },
  {
    text: 'Legal and Regulatory',
    link: 'https://www.defencediscountservice.co.uk/legal-and-regulatory.php',
  },
  {
    text: 'Privacy Notice',
    link: 'https://www.defencediscountservice.co.uk/privacy-notice.php',
  },
  {
    text: 'Cookie Policy',
    link: 'https://www.defencediscountservice.co.uk/cookies_policy.php',
  },
];

const blcAuItems: NavigationItem[] = [
  {
    text: 'Terms & Conditions',
    link: 'https://www.bluelightcard.com.au/terms_and_conditions.php',
  },
  {
    text: 'Candidate Privacy Notice',
    link: 'https://www.bluelightcard.com.au/candidate-privacy-notice.php',
  },
  {
    text: 'Privacy Notice',
    link: 'https://www.bluelightcard.com.au/privacy-notice.php',
  },
  {
    text: 'Cookie Policy',
    link: 'https://www.bluelightcard.com.au/cookies_policy.php',
  },
];

const blcUkItems: NavigationItem[] = [
  {
    text: 'Terms & Conditions',
    link: 'https://www.bluelightcard.co.uk/terms_and_conditions.php',
  },
  {
    text: 'Privacy Notice',
    link: 'https://www.bluelightcard.co.uk/privacy-notice.php',
  },
  {
    text: 'Legal and Regulatory',
    link: 'https://www.bluelightcard.co.uk/legal-and-regulatory.php',
  },
  {
    text: 'Cookie Policy',
    link: 'https://www.bluelightcard.co.uk/cookies_policy.php',
  },
  {
    text: 'Candidate Privacy Notice',
    link: 'https://www.bluelightcard.co.uk/candidate-privacy-notice.php',
  },
];
