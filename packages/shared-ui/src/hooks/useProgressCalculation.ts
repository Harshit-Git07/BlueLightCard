import { useMemo } from 'react';

interface UseProgressCalculationProps {
  steps: ProgressStepProps[];
  numberOfCompletedSteps: number;
  emptyFirstStep?: boolean;
}

export const useProgressCalculation = ({
  steps,
  numberOfCompletedSteps,
  emptyFirstStep = false,
}: UseProgressCalculationProps) => {
  const isSingleStep = useMemo(() => steps.length === 1, [steps]);

  const progressPercentage = useMemo(() => {
    if (isSingleStep) {
      return numberOfCompletedSteps === 0 ? 0 : 100;
    }

    if (emptyFirstStep) {
      if (numberOfCompletedSteps >= steps.length) return 100;
      return Math.round((numberOfCompletedSteps / steps.length) * 100);
    }

    return Math.round(((numberOfCompletedSteps + 1) / steps.length) * 100);
  }, [steps, numberOfCompletedSteps, isSingleStep, emptyFirstStep]);

  return {
    isSingleStep,
    progressPercentage,
  };
};
