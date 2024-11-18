import { render, screen } from '@testing-library/react';
import SocialLinks from './SocialLinks';
import '@testing-library/jest-dom';

describe('renders SocialLinks component with correct text', () => {
  it('should render an social links', () => {
    render(<SocialLinks />);

    expect(screen.getByText(/download the/i)).toBeInTheDocument();
    expect(screen.getByText(/blue light card/i)).toBeInTheDocument();
    expect(screen.getByText(/app for a better in-store experience\./i)).toBeInTheDocument();
  });

  it('should render an social links', () => {
    render(<SocialLinks />);

    const googlePlayLink = screen.getByRole('link', { name: /googlePlay/i });
    expect(googlePlayLink).toBeInTheDocument();
    expect(googlePlayLink).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=com.bluelightcard.user&hl=en_GB'
    );

    const appleStoreLink = screen.getByRole('link', { name: /appleStore/i });
    expect(appleStoreLink).toBeInTheDocument();
    expect(appleStoreLink).toHaveAttribute(
      'href',
      'https://itunes.apple.com/gb/app/blue-light-card/id689970073?mt=8'
    );
  });
});
