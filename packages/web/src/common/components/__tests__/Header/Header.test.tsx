import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import Header from '@/components/Header/Header';
import { HeaderProps } from '@/components/Header/types';

describe('Header component', () => {
  let props: HeaderProps;
  beforeEach(() => {
    props = {
      logoUrl: 'https://www.test.com',
      navItems: {
        loggedIn: [
          {
            text: 'Register',
            link: '/',
            dropdown: [
              {
                text: 'test',
                link: '/',
              },
            ],
          },
        ],
        loggedOut: [
          {
            text: 'Log out',
            link: '/',
            dropdown: [
              {
                text: 'test',
                link: '/',
              },
            ],
          },
        ],
      },
    };
  });
  describe('Header is rendered', () => {
    it('should render component without error', () => {
      render(<Header {...props} />);
    });
  });
});
