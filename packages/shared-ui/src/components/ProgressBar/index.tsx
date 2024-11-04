import { FC, useCallback } from 'react';
import { useProgressCalculation } from '../../hooks/useProgressCalculation';

const ProgressBar: FC<ProgressBarProps> = ({
  steps,
  numberOfCompletedSteps,
  emptyFirstStep = false,
  showLabels = false,
  completionLabel,
  className,
}) => {
  const { isSingleStep, progressPercentage } = useProgressCalculation({
    steps,
    numberOfCompletedSteps: numberOfCompletedSteps,
    emptyFirstStep,
  });

  const isComplete = useCallback(() => {
    if (isSingleStep) {
      return numberOfCompletedSteps === 1;
    }
    return numberOfCompletedSteps >= steps.length;
  }, [isSingleStep, numberOfCompletedSteps, steps.length]);

  const getDisplayLabel = useCallback(() => {
    if (isComplete() && completionLabel) {
      return completionLabel;
    }
    return steps[Math.min(numberOfCompletedSteps, steps.length - 1)].label;
  }, [isComplete, completionLabel, steps, numberOfCompletedSteps]);

  const getAriaLabel = useCallback(() => {
    if (isSingleStep) {
      return numberOfCompletedSteps === 1
        ? 'Step completed'
        : steps[0].ariaLabel ?? 'Step in progress';
    }
    if (numberOfCompletedSteps >= steps.length) {
      return 'Steps completed';
    }
    return steps[numberOfCompletedSteps].ariaLabel;
  }, [isSingleStep, numberOfCompletedSteps, steps]);

  return (
    <div className={`w-full ${className ?? ''}`}>
      {showLabels && (
        <div className="flex justify-between mb-0.5">
          <div className="font-typography-label-semibold font-typography-label-semibold-weight text-typography-label-semibold leading-typography-label-semibold text-colour-onSurface dark:text-colour-onSurface-dark">
            {getDisplayLabel()}
          </div>
        </div>
      )}

      <div className="relative">
        <div
          className="w-full h-[5px] bg-colour-primary-container dark:bg-colour-primary-container-dark"
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-label={getAriaLabel()}
        >
          <div
            className={`h-full transition-all bg-colour-primary dark:bg-colour-primary-dark ${
              isSingleStep ? 'duration-150' : 'duration-300'
            }`}
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
