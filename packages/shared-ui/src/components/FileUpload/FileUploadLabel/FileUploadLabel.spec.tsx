import { render } from '@testing-library/react';
import FileUploadLabel, { Props } from '.';

describe('FileUploadLabel', () => {
  const defaultProps: Props = {
    labelText: 'LABEL',
  };

  // smoke test
  it('should render component without error', () => {
    const { baseElement } = render(<FileUploadLabel {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<FileUploadLabel {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });
});
