import { useMemo } from 'react';

interface UseProgressCalculationProps {
  numberOfCompletedSteps: number;
  totalNumberOfSteps: number;
}

export function useProgressCalculation({
  numberOfCompletedSteps,
  totalNumberOfSteps,
}: UseProgressCalculationProps): number {
  return useMemo(() => {
    return Math.round((numberOfCompletedSteps / totalNumberOfSteps) * 100);
  }, [totalNumberOfSteps, numberOfCompletedSteps]);
}
