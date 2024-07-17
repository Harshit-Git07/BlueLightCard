import Footer from '@/components/Footer/Footer';
import { FooterNavigationSection, FooterProps } from '@/components/Footer/types';
import SocialMediaIconProps from '@/components/SocialMediaIcon/types';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';

jest.mock('../../../context/AmplitudeExperiment/hooks', () => ({
  ...jest.requireActual('../../../context/AmplitudeExperiment/hooks'), // This retains other exports
  useAmplitudeExperiment: jest.fn().mockResolvedValue({ data: { variantName: 'off' } }),
}));

const oneNavSection = [
  {
    title: 'Company Info',
    navLinks: [
      { label: 'Blue Light Card Foundation', url: '/' },
      { label: 'Latest News & Blogs', url: '/' },
      { label: 'About Us', url: '/' },
      { label: 'Free Tickets', url: '/' },
      { label: 'Compliance', url: '/' },
    ],
  },
];

const twoNavSections: FooterNavigationSection[] = [
  ...oneNavSection,
  {
    title: 'Links',
    navLinks: [
      { label: 'Add a discount', url: '/' },
      { label: 'Mobile App', url: '/' },
      { label: 'Competitions', url: '/' },
      { label: 'Sitemap', url: '/' },
      { label: 'Contact Us', url: '/' },
    ],
  },
];

const socialLinks: SocialMediaIconProps[] = [
  {
    iconName: 'facebook',
    link: 'https://facebook.com',
    helpText: 'Blue light card on Facebook',
  },
  {
    iconName: 'twitter',
    link: 'https://twitter.com',
    helpText: 'Blue light card on Twitter',
  },

  {
    iconName: 'instagram',
    link: 'https://instagram.com',
    helpText: 'Blue light card on instagram',
  },
];

const downloadLinks = [
  {
    imageUrl: '/web/assets/google-play-badge.png',
    downloadUrl:
      'https://play.google.com/store/apps/details?id=com.bluelightcard.user&amp;hl=en_GB',
    linkTitle: 'Get the Blue Light Card app on Google Play',
  },
];

const loginSection = (
  <div data-testid="login-sect">
    <h1>Test</h1>
  </div>
);

const copyrightText = 'test text';

describe('components/Footer', () => {
  let props: any;
  beforeEach(() => {
    props = {};
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Footer {...props} navigationItems={oneNavSection} />);
    });
  });

  describe('Component rendering', () => {
    it('renders a footer with the multiple sections', () => {
      render(<Footer navigationItems={twoNavSections} />);

      expect(screen.getByText(/Links/i)).toBeTruthy();
      expect(screen.getByText(/Competitions/i)).toBeTruthy();
    });

    it('renders a footer with the login section', async () => {
      render(<Footer loginForm={loginSection} navigationItems={oneNavSection} />);

      expect(screen.getByTestId('login-sect')).toBeTruthy();
    });

    it('renders a footer with the social links', () => {
      render(<Footer navigationItems={oneNavSection} socialLinks={socialLinks} />);

      const image = screen.getByTitle(socialLinks[0].helpText);
      expect(image).toBeTruthy();
    });

    it('renders a footer with the download links', () => {
      render(<Footer navigationItems={oneNavSection} downloadLinks={downloadLinks} />);

      const image = screen.getByAltText(downloadLinks[0].linkTitle);
      expect(image).toBeTruthy();
    });

    it('renders the copyright section when provided', () => {
      render(<Footer navigationItems={oneNavSection} copyrightText={copyrightText} />);

      const copyText = screen.getByText(copyrightText);
      expect(copyText).toBeTruthy();
    });
  });
});
