import { render } from '@testing-library/react';
import Logo from './';

describe('Logo', () => {
  it('should render without error', () => {
    const { container } = render(<Logo />);
    expect(container).toMatchSnapshot();
  });
});
