import WelcomeHeader from '../../WelcomeHeader/WelcomeHeader';
import { WelcomeHeaderProps } from '../../WelcomeHeader/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('welcome header component', () => {
  let props: WelcomeHeaderProps;

  beforeEach(() => {
    props = {
      id: 'welcomeheader',
      show: true,
      welcomeHeader: 'heading of welcome',
      welcomeText: 'some text',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<WelcomeHeader {...props} />);
      const header = screen.getAllByRole('heading')[0];
      expect(header).toBeTruthy();
    });
  });
});
