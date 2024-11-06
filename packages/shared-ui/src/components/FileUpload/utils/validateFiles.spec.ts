import { validateFileList } from './validateFiles';

describe('validateFiles', () => {
  it('returns success on valid file list', () => {
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const result = validateFileList([file], 3, 3);

    expect(result.type).toEqual('success');
  });

  it('returns error on invalid file list', () => {
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const result = validateFileList([file], 0, 3);

    expect(result.type).toEqual('error');
  });
});
