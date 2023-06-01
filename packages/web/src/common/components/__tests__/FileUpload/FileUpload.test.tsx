import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from '@/components/FileUpload/FileUpload';
import { FileUploadMimeTypes, FileUploadProps } from '@/components/FileUpload/types';

describe('FileUpload component', () => {
  let props: FileUploadProps;

  beforeEach(() => {
    props = {
      mimeTypes: [FileUploadMimeTypes.PNG],
      maxUploadSizeMb: 2,
      allowMultiple: false,
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<FileUpload {...props} />);
    });
  });

  describe('component rendering', () => {
    it('should output list of file mime types in the correct order', () => {
      props.mimeTypes = [
        FileUploadMimeTypes.JPEG,
        FileUploadMimeTypes.PDF,
        FileUploadMimeTypes.PNG,
      ];

      render(<FileUpload {...props} />);

      const text = screen.getByText(/it must be a JPEG, PDF or PNG/i);

      expect(text).toBeTruthy();
    });

    it('should output description text', () => {
      props.description = 'This is some description text';

      render(<FileUpload {...props} />);

      const text = screen.getByText('This is some description text');

      expect(text).toBeTruthy();
    });
  });

  describe('component functionality', () => {
    it('should call onUpload prop callback with list of one file', async () => {
      const onUploadMockFn = jest.fn();
      const user = userEvent.setup();

      props.mimeTypes = [FileUploadMimeTypes.JPEG, FileUploadMimeTypes.PNG];
      props.onUpload = onUploadMockFn;

      render(<FileUpload {...props} />);

      const file = new File(['test_jpeg'], 'test_jpeg.jpeg', { type: 'image/jpeg' });
      const fileInput: HTMLInputElement = screen.getByLabelText(/upload a file/i);

      await user.upload(fileInput, file);

      expect(onUploadMockFn).toHaveBeenCalledWith([file]);
    });

    it('should call onUpload prop callback with list of files', async () => {
      const onUploadMockFn = jest.fn();
      const user = userEvent.setup();

      props.mimeTypes = [FileUploadMimeTypes.JPEG, FileUploadMimeTypes.PNG];
      props.allowMultiple = true;
      props.onUpload = onUploadMockFn;

      render(<FileUpload {...props} />);

      const files = [
        new File(['test_jpeg'], 'test_jpeg.jpeg', { type: 'image/jpeg' }),
        new File(['test_png'], 'test_png.jpeg', { type: 'image/png' }),
      ];
      const fileInput: HTMLInputElement = screen.getByLabelText(/upload a file/i);

      await user.upload(fileInput, files);

      expect(onUploadMockFn).toHaveBeenCalledWith(files);
    });

    it('should call onError prop callback with list of failed files, when size of files exceed max upload option', async () => {
      const onErrorMockFn = jest.fn();
      const user = userEvent.setup();

      props.mimeTypes = [FileUploadMimeTypes.JPEG, FileUploadMimeTypes.PNG];
      props.allowMultiple = true;
      props.maxUploadSizeMb = 2;
      props.onError = onErrorMockFn;

      render(<FileUpload {...props} />);

      const files = [
        new File(['test_jpeg'], 'test_jpeg.jpeg', { type: 'image/jpeg' }),
        new File(['test_png'], 'test_png.jpeg', { type: 'image/png' }),
      ];

      // set file size to 3mb
      Object.defineProperty(files[0], 'size', {
        value: 1024 ** 2 * 3,
      });

      const fileInput: HTMLInputElement = screen.getByLabelText(/upload a file/i);

      await user.upload(fileInput, files);

      expect(onErrorMockFn).toHaveBeenCalledWith([files[0]]);
    });
  });
});
