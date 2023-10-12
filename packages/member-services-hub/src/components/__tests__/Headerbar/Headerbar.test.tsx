import Headerbar from '../../../components/Headerbar/Headerbar';
import { HeaderbarProps } from '../../../components/Headerbar/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Headerbar component', () => {
  let props: HeaderbarProps;

  beforeEach(() => {
    props = {
      firstname: 'Daniel',
      surname: 'Cook',
      email: 'danielcook@bluelightcard.co.uk',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Headerbar {...props} />);
      const headerbar = screen.getAllByRole('banner')[0];
      expect(headerbar).toBeTruthy();
    });
  });

  describe('default', () => {
    props = {
      firstname: 'Daniel',
      surname: 'Cook',
      email: 'danielcook@bluelightcard.co.uk',
    };
    it('html contains correct passed name default', () => {
      render(<Headerbar {...props} />);
      expect(screen.getAllByText(props.firstname + ' ' + props.surname)).toBeTruthy();
    });
    it('html contains correct passed email default', () => {
      render(<Headerbar {...props} />);
      expect(screen.getAllByText(props.email)).toBeTruthy();
    });
  });

  describe('AllOn', () => {
    props = {
      ...props,
      profilePicture: 'https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-02.jpg',
      button: true,
      buttonText: 'buttonText',
      rightChevron: true,
      leftChevron: true,
      notifications: true,
      messages: true,
      calender: true,
      welcome: true,
      welcomeHeader: 'Welcome Message!',
      welcomeText: 'Welcome to the new admin panel!',
      search: true,
    };
    it('html contains correct passed name => all on', () => {
      render(<Headerbar {...props} />);
      expect(screen.getAllByText(props.firstname + ' ' + props.surname)).toBeTruthy();
    });
    it('html contains correct passed email all on', () => {
      render(<Headerbar {...props} />);
      expect(screen.getAllByText(props.email)).toBeTruthy();
    });
    it('html contains correct passed welcome header all on', () => {
      render(<Headerbar {...props} />);
      expect(screen.getAllByText(props.welcomeHeader ?? '')).toBeTruthy();
    });
    it('html contains correct passed welcome text all on', () => {
      render(<Headerbar {...props} />);
      expect(screen.getAllByText(props.welcomeText ?? '')).toBeTruthy();
    });
    it('html contains correct passed profile picture all on', () => {
      render(<Headerbar {...props} />);
      expect(screen.getAllByText(props.profilePicture ?? '')).toBeTruthy();
    });
    it('html defaults when not passed all on', () => {
      render(<Headerbar {...props} profilePicture={undefined} />);
      expect(screen.getAllByText(props.firstname[0] + props.surname[0])).toBeTruthy();
    });
  });
});
