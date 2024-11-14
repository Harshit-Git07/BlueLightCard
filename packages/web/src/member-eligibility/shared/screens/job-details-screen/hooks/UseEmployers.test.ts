import * as target from './UseEmployers';
import { useMemo } from 'react';

jest.mock('react');

const useMemoMock = jest.mocked(useMemo);

type Result = ReturnType<typeof target.useEmployers>;
let result: Result;

beforeEach(() => {
  useMemoMock.mockImplementation((callback) => callback());
});

describe('given the organisation is undefined', () => {
  beforeEach(() => {
    result = target.useEmployers(undefined);
  });

  it('should return stub list of employers', () => {
    expect(result).toBeUndefined();
  });
});

describe('given the organisation is "Blood Bikes"', () => {
  beforeEach(() => {
    result = target.useEmployers('Blood Bikes');
  });

  it('should return stub empty list of employers', () => {
    expect(result).toEqual([]);
  });
});

describe('given the organisation is not undefined or "Blood Bikes"', () => {
  beforeEach(() => {
    result = target.useEmployers('NHS');
  });

  it('should return stub list of employers', () => {
    expect(result).toEqual(<Result>[
      { id: '1', label: 'Employer 1' },
      { id: '2', label: 'Employer 2' },
      { id: '3', label: 'Employer 3' },
    ]);
  });
});
