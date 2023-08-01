import { render } from '@testing-library/react';
import Loader from '../../Loader/Loader';

describe('Loader component', () => {
  test('smoke test', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toBeTruthy();
  });
});
