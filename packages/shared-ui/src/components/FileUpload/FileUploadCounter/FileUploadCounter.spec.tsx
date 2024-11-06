import { render } from '@testing-library/react';
import FileUploadCounter, { Props } from '.';

describe('FileUploadCounter', () => {
  const defaultProps: Props = {
    currentNumberOfUploads: 0,
    expectedNumberOfUploads: 3,
  };

  // smoke test
  it('should render component without error', () => {
    const { baseElement } = render(<FileUploadCounter {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<FileUploadCounter {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });
});
