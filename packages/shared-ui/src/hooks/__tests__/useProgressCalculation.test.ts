import { renderHook } from '@testing-library/react';
import { useProgressCalculation } from '../useProgressCalculation';

describe('useProgressCalculation', () => {
  describe('isSingleStep', () => {
    it('should return true when steps array has length of 1', () => {
      const { result } = renderHook(() =>
        useProgressCalculation({
          steps: [{ label: 'Step 1' }],
          numberOfCompletedSteps: 0,
        }),
      );

      expect(result.current.isSingleStep).toBe(true);
    });

    it('should return false when steps array has length greater than 1', () => {
      const { result } = renderHook(() =>
        useProgressCalculation({
          steps: [{ label: 'Step 1' }, { label: 'Step 2' }],
          numberOfCompletedSteps: 0,
        }),
      );

      expect(result.current.isSingleStep).toBe(false);
    });
  });

  describe('progressPercentage with single step', () => {
    it('should return 0 when currentStep is 0', () => {
      const { result } = renderHook(() =>
        useProgressCalculation({
          steps: [{ label: 'Step 1' }],
          numberOfCompletedSteps: 0,
        }),
      );

      expect(result.current.progressPercentage).toBe(0);
    });

    it('should return 100 when currentStep is not 0', () => {
      const { result } = renderHook(() =>
        useProgressCalculation({
          steps: [{ label: 'Step 1' }],
          numberOfCompletedSteps: 1,
        }),
      );

      expect(result.current.progressPercentage).toBe(100);
    });
  });

  describe('progressPercentage with multiple steps and emptyFirstStep true', () => {
    const steps = [
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3' },
      { label: 'Step 4' },
    ];

    it('should return 0 for step 0', () => {
      const { result } = renderHook(() =>
        useProgressCalculation({
          steps,
          numberOfCompletedSteps: 0,
          emptyFirstStep: true,
        }),
      );

      expect(result.current.progressPercentage).toBe(0);
    });

    it('should return 25 for step 1', () => {
      const { result } = renderHook(() =>
        useProgressCalculation({
          steps,
          numberOfCompletedSteps: 1,
          emptyFirstStep: true,
        }),
      );

      expect(result.current.progressPercentage).toBe(25);
    });

    it('should return 100 when currentStep equals steps length', () => {
      const { result } = renderHook(() =>
        useProgressCalculation({
          steps,
          numberOfCompletedSteps: 4,
          emptyFirstStep: true,
        }),
      );

      expect(result.current.progressPercentage).toBe(100);
    });

    it('should return 100 when currentStep exceeds steps length', () => {
      const { result } = renderHook(() =>
        useProgressCalculation({
          steps,
          numberOfCompletedSteps: 5,
          emptyFirstStep: true,
        }),
      );

      expect(result.current.progressPercentage).toBe(100);
    });
  });

  describe('progressPercentage with multiple steps and emptyFirstStep false', () => {
    const steps = [
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3' },
      { label: 'Step 4' },
    ];

    it('should return 25 for step 0', () => {
      const { result } = renderHook(() =>
        useProgressCalculation({
          steps,
          numberOfCompletedSteps: 0,
        }),
      );

      expect(result.current.progressPercentage).toBe(25);
    });

    it('should return 50 for step 1', () => {
      const { result } = renderHook(() =>
        useProgressCalculation({
          steps,
          numberOfCompletedSteps: 1,
        }),
      );

      expect(result.current.progressPercentage).toBe(50);
    });

    it('should return 100 for final step', () => {
      const { result } = renderHook(() =>
        useProgressCalculation({
          steps,
          numberOfCompletedSteps: 3,
        }),
      );

      expect(result.current.progressPercentage).toBe(100);
    });
  });
});
