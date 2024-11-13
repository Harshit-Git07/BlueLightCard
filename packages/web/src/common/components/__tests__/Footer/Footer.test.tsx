import { render, screen } from '@testing-library/react';
import Footer from '@/root/src/common/components/Footer/Footer';
import * as footerConfigHelper from '../../Footer/helpers/getFooterDetails';
import '@testing-library/jest-dom';
import { FooterConfig } from '../../Footer/types';

jest.mock('../../Footer/helpers/getFooterDetails', () => ({
  getFooterDetails: jest.fn(),
}));

jest.mock('../../../context/AmplitudeExperiment/hooks', () => ({
  ...jest.requireActual('../../../context/AmplitudeExperiment/hooks'), // This retains other exports
  useAmplitudeExperiment: jest.fn().mockResolvedValue({ data: { variantName: 'off' } }),
}));

const mockFooterConfig: FooterConfig = {
  navigationItems: [
    {
      title: 'Mock Nav Item',
      navLinks: [{ label: 'Sub Item One', url: '/mock-sub-item' }],
    },
  ],
  copyrightText: 'mock copyright text',
};

describe('FooterV2 component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFooterDetails = jest.fn();
  jest.spyOn(footerConfigHelper, 'getFooterDetails').mockImplementation(mockFooterDetails);
  describe('Render tests', () => {
    it('should render navigation items and copyright text', () => {
      mockFooterDetails.mockReturnValueOnce(mockFooterConfig);

      const { container } = render(<Footer isAuthenticated />);
      expect(container).toMatchSnapshot();
      expect(screen.getByText(mockFooterConfig.navigationItems[0].title)).toBeDefined();
      expect(screen.getByText(mockFooterConfig.copyrightText)).toBeDefined();
    });

    it('should not render a text block if textBlock is NOT in the config', () => {
      mockFooterDetails.mockReturnValueOnce(mockFooterConfig);
      render(<Footer isAuthenticated />);
      expect(screen.queryByTestId('text-block')).toBeNull();
      expect(screen.queryByTestId('mobile-text-block')).toBeNull();
    });

    it('should render a text block if its in the config', () => {
      const configWithTextBlock: FooterConfig = {
        ...mockFooterConfig,
        textBlock: 'This is a mock text block',
      };
      mockFooterDetails.mockReturnValueOnce(configWithTextBlock);
      render(<Footer isAuthenticated />);
      expect(screen.getByTestId('desktop-text-block')).toBeDefined();
      expect(screen.getByTestId('mobile-text-block')).toBeDefined();
    });

    it('should render social links if in the config', () => {
      const configWithSocialLinks: FooterConfig = {
        ...mockFooterConfig,
        socialLinks: [
          {
            iconName: 'facebook',
            link: 'https://www.facebook.com/bluelightcarddiscounts',
            helpText: 'Mock help text',
          },
        ],
      };
      mockFooterDetails.mockReturnValueOnce(configWithSocialLinks);
      render(<Footer isAuthenticated />);
      expect(screen.getAllByTitle('Mock help text')).toBeDefined();
    });

    it('should not render social links if NOT in the config', () => {
      mockFooterDetails.mockReturnValueOnce(mockFooterConfig);
      render(<Footer isAuthenticated />);
      expect(screen.queryByTitle('Mock help text')).not.toBeInTheDocument();
    });

    it('should render download links', () => {
      mockFooterDetails.mockReturnValueOnce(mockFooterConfig);
      render(<Footer isAuthenticated />);

      const mobileDownloadLinks = screen.getByTestId('download-links');

      expect(mobileDownloadLinks).toBeDefined();
    });

    it('should render the logo without error', () => {
      mockFooterDetails.mockReturnValueOnce(mockFooterConfig);
      render(<Footer isAuthenticated />);

      const logo = screen.getByTestId('brandLogo');

      expect(logo).toBeDefined();
    });
  });
});
