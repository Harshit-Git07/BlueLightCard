import FileListItem from '@/components/FileListItem/FileListItem';
import { FileListItemProps } from '@/components/FileListItem/types';
import { render } from '@testing-library/react';

describe('FileListItem component', () => {
  let props: FileListItemProps;

  beforeEach(() => {
    props = {
      name: 'File name.png',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<FileListItem {...props} />);
    });
  });
});
