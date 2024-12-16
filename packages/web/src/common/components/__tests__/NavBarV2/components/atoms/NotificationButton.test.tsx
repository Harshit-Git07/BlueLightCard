import { render } from '@testing-library/react';
import NotificationButton from '../../../../NavBarV2/components/atoms/NotificationButton';

describe('NotificationButton', () => {
  it('renders', () => {
    const { container } = render(<NotificationButton href="/mock-href" />);
    expect(container).toMatchSnapshot();
  });
});
