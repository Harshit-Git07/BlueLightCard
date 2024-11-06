import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileSelectionBody, { Props } from '.';
import { userEvent } from '@testing-library/user-event';

const mockFilesSelected = jest.fn();
describe('FileSelectionBody component', () => {
  const defaultProps: Props = {
    onFilesSelected: mockFilesSelected,
  };
  const pngFile = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' }); // react testing lib docs
  const pdfFile = new File(['(⌐□_□)'], 'chucknorris.pdf', { type: 'application/pdf' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // smoke test
  it('should render component without error', () => {
    const { baseElement } = render(<FileSelectionBody {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<FileSelectionBody {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when hovering a file', () => {
    const { container } = render(<FileSelectionBody {...defaultProps} />);

    const dropzone = screen.getByLabelText('Dropzone to Upload Files');

    fireEvent.dragEnter(dropzone, {
      dataTransfer: {
        files: [pngFile],
      },
    });

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when disabled', () => {
    const { container } = render(<FileSelectionBody {...defaultProps} disabled />);

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with different allowedFileTypes and maxFileSize', () => {
    const { container: smallProps } = render(
      <FileSelectionBody {...defaultProps} allowedFileTypes={[]} maxFileSize={0} />,
    );
    expect(smallProps).toMatchSnapshot();
    const { container: mediumProps } = render(
      <FileSelectionBody {...defaultProps} allowedFileTypes={['image/png']} maxFileSize={2000} />,
    );
    expect(mediumProps).toMatchSnapshot();
    const { container: largeProps } = render(
      <FileSelectionBody
        {...defaultProps}
        allowedFileTypes={['image/png', 'application/pdf']}
        maxFileSize={2000000000}
      />,
    );
    expect(largeProps).toMatchSnapshot();
  });

  it('triggers the callback when valid files are selected via input', async () => {
    render(<FileSelectionBody {...defaultProps} />);
    const label = screen.getByLabelText(/Choose File/i);

    await userEvent.upload(label, [pngFile, pdfFile]);

    expect(getLastCallFileNames(mockFilesSelected)).toEqual(['chucknorris.png', 'chucknorris.pdf']);
  });

  it('triggers the callback when multiple valid files are dragged in', () => {
    render(<FileSelectionBody {...defaultProps} />);

    const dropzone = screen.getByLabelText(/Dropzone/i);

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [pngFile, pdfFile],
      },
    });

    expect(getLastCallFileNames(mockFilesSelected)).toEqual(['chucknorris.png', 'chucknorris.pdf']);
  });

  it('blocks callbacks when in disabled state', () => {
    render(<FileSelectionBody {...defaultProps} disabled />);

    const label = screen.getByLabelText(/Choose File/i);
    expect(label).toBeDisabled();

    const dropzone = screen.getByLabelText(/Dropzone/i);
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [pngFile, pdfFile],
      },
    });
    expect(mockFilesSelected).not.toHaveBeenCalled();
  });
});

const getLastCallFileNames = (mockFn: jest.Mock) => {
  const lastCallArgs = mockFn.mock.lastCall[0];

  return lastCallArgs.map((file: File) => file.name);
};
