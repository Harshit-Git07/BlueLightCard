import { render } from '@testing-library/react';
import Spinner from '@/components/Spinner/Spinner';

describe('Spinner Component', () => {
  it('should render correctly', () => {
    const { container } = render(<Spinner />);
    expect(container).toMatchSnapshot();
  });
});
