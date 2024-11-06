import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploadStatusCard, { Props } from '.';
import { UploadStatus } from '../types';
import { userEvent } from '@storybook/testing-library';

const mockRemoveFile = jest.fn();
describe('FileUploadCounter component', () => {
  const defaultProps: Props = {
    fileName: 'testFile.name',
    uploadStatus: UploadStatus.Ready,
    removeFile: mockRemoveFile,
  };

  // smoke test
  it('should render component without error', () => {
    const { baseElement } = render(<FileUploadStatusCard {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it.each(Object.values(UploadStatus))('matches snapshot for uploadStatus %s', (uploadStatus) => {
    const { container } = render(
      <FileUploadStatusCard {...defaultProps} uploadStatus={uploadStatus} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('triggers callback when clicking close button', async () => {
    render(<FileUploadStatusCard {...defaultProps} />);

    const closeButton = screen.getByRole('button');
    await userEvent.click(closeButton);

    expect(mockRemoveFile).toHaveBeenCalled();
  });
});
