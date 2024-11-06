import { formatFileTypes } from './formatFileTypes';
import { defaultFileTypes } from '../FileSelectionBody';

const unhappyPath: Array<{
  input: string;
  output: ReturnType<typeof formatFileTypes>;
}> = [
  { input: 'image', output: undefined },
  { input: 'image/png/png', output: '.PNG' },
  { input: 'image/*', output: '.*' },
  { input: '.jpg', output: undefined },
];

describe('formatFileTypes', () => {
  it('handles expected file types', () => {
    const result = formatFileTypes(defaultFileTypes);

    expect(result).toEqual('.PNG, .JPEG or .PDF');
  });

  it.each(unhappyPath)('handles incorrect filetype $input', ({ input, output }) => {
    const result = formatFileTypes([input]);

    expect(result).toEqual(output);
  });
});
