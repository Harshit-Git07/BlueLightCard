import { render } from '@testing-library/react';
import NotificationButton from '../../../../NavBar/components/atoms/NotificationButton';

describe('NotificationButton', () => {
  it('renders', () => {
    const { container } = render(<NotificationButton href="/mock-href" />);
    expect(container).toMatchSnapshot();
  });
});
