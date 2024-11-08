import { act, render, screen } from '@testing-library/react';
import Footer from '../../Footer/Footer';
import { FooterProps } from '../../Footer/Types';
import { UserEvent } from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';

describe('Footer component', () => {
  let props: FooterProps;
  let user: UserEvent;
  beforeEach(() => {
    props = {
      navItems: [
        { text: 'Terms & Conditions', link: '/' },
        { text: 'Privacy Policy', link: '/' },
        { text: 'Cookie Policy', link: '/' },
        { text: "FAQ's", link: '/' },
      ],
      mobileBreakpoint: 768,
    };
  });
  user = userEvent.setup();

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Footer {...props} />);

      const footer = screen.getByRole('contentinfo');

      expect(footer).toBeTruthy();
    });
  });
  describe('Footer link rendering', () => {
    it('should render footer links with correct href', async () => {
      render(<Footer {...props} />);
      props.navItems.forEach((item) => {
        const link = screen.getByRole('link', { name: `${item.text} footer link` });

        // Check if the href property's pathname matches the expected path
        const link_href = link.attributes.getNamedItem('href');
        expect(link_href?.value).toEqual(item.link);
      });
    });
  });
});
