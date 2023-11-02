import ProfilePicture from '../../ProfilePicture/ProfilePicture';
import { ProfilePictureProps } from '../../ProfilePicture/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('profile picture component', () => {
  let props: ProfilePictureProps;

  beforeEach(() => {
    props = {
      id: 'profilePicture',
      profilePicture: '/random.png',
      firstname: 'Daniel',
      surname: 'Cook',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<ProfilePicture {...props} />);
      const image = screen.getAllByRole('img')[0];
      expect(image).toBeTruthy();
    });
  });
});
