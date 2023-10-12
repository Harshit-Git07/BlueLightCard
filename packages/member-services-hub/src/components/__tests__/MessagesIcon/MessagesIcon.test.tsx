import MessagesIcon from '../../MessagesIcon/MessagesIcon';
import { MessagesIconProps } from '../../MessagesIcon/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('messages icon component', () => {
  let props: MessagesIconProps;

  beforeEach(() => {
    props = {
      id: 'MessengerIcon',
      show: true,
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<MessagesIcon {...props} />);
      const icon = screen.getAllByRole('button')[0];
      expect(icon).toBeTruthy();
    });
  });
});
