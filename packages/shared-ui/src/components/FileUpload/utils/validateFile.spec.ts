import { defaultFileTypes, defaultMaxFileSize } from '../FileSelectionBody';
import { validateFile } from './validateFile';

const mockGetDocument = jest.fn().mockResolvedValue('Success');
jest.mock('pdfjs-dist/webpack.mjs', () => ({
  getDocument: () => ({ promise: mockGetDocument() }),
}));

Object.defineProperty(File.prototype, 'arrayBuffer', {
  value: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
  writable: true,
});

describe('validateFile', () => {
  it('passes valid files', async () => {
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    const result = await validateFile(file, defaultFileTypes, defaultMaxFileSize, true);

    expect(result.type).toEqual('success');
  });

  it('rejects invalid file types', async () => {
    const invalidFile = new File(['???'], 'chucknorris.invalid', { type: 'invalid' });

    const result = await validateFile(invalidFile, [], defaultMaxFileSize, true);

    expect(result.type).toEqual('error');
  });

  it('rejects files that are too large', async () => {
    const invalidFile = new File(Array(2000).fill(1), 'tooLargeFile.pdf', {
      type: 'application/pdf',
    });

    const result = await validateFile(invalidFile, defaultFileTypes, 200, true);

    expect(result.type).toEqual('error');
  });

  it('ignores password protected pdf files', async () => {
    mockGetDocument.mockRejectedValue({ name: 'PasswordException' });
    const protectedFile = new File(['(⌐□_□)'], 'chucknorris.pdf', { type: 'application/pdf' });

    const result = await validateFile(protectedFile, defaultFileTypes, defaultMaxFileSize, true);

    expect(result.type).toEqual('error');
  });
});
