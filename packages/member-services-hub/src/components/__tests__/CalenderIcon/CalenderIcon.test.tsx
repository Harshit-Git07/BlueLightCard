import CalenderIcon from '../../CalenderIcon/CalenderIcon';
import { CalenderIconProps } from '../../CalenderIcon/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('calender icon component', () => {
  let props: CalenderIconProps;

  beforeEach(() => {
    props = {
      id: 'CalenderIcon',
      show: true,
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<CalenderIcon {...props} />);
      const icon = screen.getAllByRole('button')[0];
      expect(icon).toBeTruthy();
    });
  });
});
