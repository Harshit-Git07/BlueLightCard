import { render } from '@testing-library/react';
import UnauthenticatedNavBar from '../../../../Navigation/NavBar/components/organisms/UnauthenticatedNavBar';

describe('UnauthenticaedNavBar', () => {
  it('renders', () => {
    const { container } = render(<UnauthenticatedNavBar />);
    expect(container).toMatchSnapshot();
  });
});
