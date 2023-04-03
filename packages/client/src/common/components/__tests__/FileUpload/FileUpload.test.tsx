import FileUpload from '@/components/FileUpload/FileUpload';
import { FileUploadProps } from '@/components/FileUpload/types';
import { render } from '@testing-library/react';

describe('FileUpload component', () => {
  let props: FileUploadProps;

  beforeEach(() => {
    props = {};
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<FileUpload {...props} />);
    });
  });
});
