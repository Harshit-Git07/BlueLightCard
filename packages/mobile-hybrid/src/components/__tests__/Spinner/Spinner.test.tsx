import { render } from '@testing-library/react';
import Spinner from '@/components/Spinner/v2';

describe('Spinner Component', () => {
  it('should render correctly', () => {
    const { container } = render(<Spinner />);
    expect(container).toMatchSnapshot();
  });
});
