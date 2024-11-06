import { formatBytes } from './formatBytes';

const randomSelectionOfValuesToCheck: Array<{
  input: Parameters<typeof formatBytes>;
  output: ReturnType<typeof formatBytes>;
}> = [
  {
    input: [0],
    output: '0 bytes',
  },
  {
    input: [100],
    output: '100 bytes',
  },
  {
    input: [1000],
    output: '1KB',
  },
  {
    input: [1499],
    output: '1KB',
  },
  {
    input: [1500],
    output: '2KB',
  },
  {
    input: [1500, 1],
    output: '1.5KB',
  },
  {
    input: [1500, 2],
    output: '1.5KB',
  },
  {
    input: [1550, 2],
    output: '1.55KB',
  },
  {
    input: [1000000],
    output: '1MB',
  },
];
describe('formatBytes', () => {
  it.each(randomSelectionOfValuesToCheck)('works as expected for $input', ({ input, output }) => {
    expect(formatBytes(...input)).toEqual(output);
  });

  it('handles negative bytes', () => {
    expect(formatBytes(-100)).toEqual('0 bytes');
  });

  it('handles non-integer decimal val', () => {
    expect(formatBytes(5555, -2)).toEqual('6KB');
  });
});
