import { render } from '@testing-library/react';
import CompanyPageError from '../CompanyPageError';

describe('Company Page Error Component', () => {
  it('should render correctly', () => {
    const { container } = render(<CompanyPageError message="Failed to load" />);
    expect(container).toMatchSnapshot();
  });
});
