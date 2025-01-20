import { parseCsvFile, CsvRow } from '../csvParser';
import fs from 'fs';
import path from 'path';

jest.mock('fs');

describe('parseCsvFile', () => {
  const mockFilePath = path.join(__dirname, 'mock.csv');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should parse CSV file correctly', async () => {
    fs.createReadStream = jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function (event, callback) {
        if (event === 'data') {
          callback({ name: 'John', age: '30' });
          callback({ name: 'Jane', age: '25' });
        }
        if (event === 'end') {
          callback();
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this;
      }),
    });

    const result: CsvRow[] = await parseCsvFile(mockFilePath);
    expect(result).toEqual([
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ]);
  });

  it('should handle errors during CSV parsing', async () => {
    const mockError = new Error('File not found');
    fs.createReadStream = jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function (event, callback) {
        if (event === 'error') {
          callback(mockError);
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this;
      }),
    });

    await expect(parseCsvFile(mockFilePath)).rejects.toThrow('File not found');
  });
});
