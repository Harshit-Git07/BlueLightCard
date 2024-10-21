import Radial from '../../Radial/Radial';
import { RadialProps } from '../../Radial/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Radial component', () => {
  let props: RadialProps;

  beforeEach(() => {
    props = {
      options: ['hello', 'darkness', 'my', 'old', 'friend'],
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Radial {...props} />);
      const label = screen.getAllByTestId('radial-label');

      expect(label).toBeTruthy();
    });
  });
});
