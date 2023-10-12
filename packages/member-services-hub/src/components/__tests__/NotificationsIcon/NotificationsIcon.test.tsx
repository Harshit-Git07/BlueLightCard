import NotificationsIcon from '../../NotificationsIcon/NotificationsIcon';
import { NotificationsIconProps } from '../../NotificationsIcon/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('notification icon component', () => {
  let props: NotificationsIconProps;

  beforeEach(() => {
    props = {
      id: 'NotificationIcon',
      show: true,
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<NotificationsIcon {...props} />);
      const icon = screen.getAllByRole('button')[0];
      expect(icon).toBeTruthy();
    });
  });
});
