import { env } from '../../env';
import { BRAND } from '../../types';
export const getCopyrightText = () => {
  const currentYear = new Date().getFullYear();

  return env.APP_BRAND === 'dds-uk' ? (
    <>
      <span className="block">{`© Defence Discount Service 2012 - ${currentYear}`}</span>
      <span className="block">Operated by Blue Light Card Ltd</span>
    </>
  ) : (
    `©Blue Light Card 2008 - ${currentYear}`
  );
};

const blcUkNavItems = [
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

const blcAuNavItems = [
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

const ddsUkNavItems = [
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

export const getNavigationItems = () => {
  const brand = env.APP_BRAND;
  switch (brand) {
    case BRAND.DDS_UK:
      return ddsUkNavItems;
    case BRAND.BLC_AU:
      return blcAuNavItems;
    default:
      return blcUkNavItems;
  }
};
