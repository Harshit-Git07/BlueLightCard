import { renderHook } from '@testing-library/react';
import { useProgressCalculation } from '../useProgressCalculation';

describe('percentage calculation for a single step', () => {
  it('should return 0', () => {
    const { result } = renderHook(() =>
      useProgressCalculation({
        numberOfCompletedSteps: 0,
        totalNumberOfSteps: 1,
      }),
    );

    expect(result.current).toBe(0);
  });

  it('should return 100', () => {
    const { result } = renderHook(() =>
      useProgressCalculation({
        numberOfCompletedSteps: 1,
        totalNumberOfSteps: 1,
      }),
    );

    expect(result.current).toBe(100);
  });
});

describe('percentage calculation when there are 4 total steps', () => {
  it('should return 0 for step 0', () => {
    const { result } = renderHook(() =>
      useProgressCalculation({
        numberOfCompletedSteps: 0,
        totalNumberOfSteps: 4,
      }),
    );

    expect(result.current).toBe(0);
  });

  it('should return 25 for step 1', () => {
    const { result } = renderHook(() =>
      useProgressCalculation({
        numberOfCompletedSteps: 1,
        totalNumberOfSteps: 4,
      }),
    );

    expect(result.current).toBe(25);
  });

  it('should return 50 for step 2', () => {
    const { result } = renderHook(() =>
      useProgressCalculation({
        numberOfCompletedSteps: 2,
        totalNumberOfSteps: 4,
      }),
    );

    expect(result.current).toBe(50);
  });

  it('should return 75 for step 3', () => {
    const { result } = renderHook(() =>
      useProgressCalculation({
        numberOfCompletedSteps: 3,
        totalNumberOfSteps: 4,
      }),
    );

    expect(result.current).toBe(75);
  });

  it('should return 100 for step 4', () => {
    const { result } = renderHook(() =>
      useProgressCalculation({
        numberOfCompletedSteps: 4,
        totalNumberOfSteps: 4,
      }),
    );

    expect(result.current).toBe(100);
  });
});
