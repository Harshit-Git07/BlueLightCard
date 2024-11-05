import { FC, useMemo } from 'react';
import { useProgressCalculation } from '../../hooks/useProgressCalculation';
import { ProgressBarProps } from './types';

const ProgressBar: FC<ProgressBarProps> = ({
  className = '',
  numberOfCompletedSteps,
  totalNumberOfSteps,
  label,
  ariaLabel,
  showLabels = label !== undefined,
}) => {
  const progressPercentage = useProgressCalculation({
    numberOfCompletedSteps,
    totalNumberOfSteps,
  });

  const isSingleStep = useMemo(() => totalNumberOfSteps === 1, [totalNumberOfSteps]);

  const ariaLabelWithDefault = useMemo(() => {
    if (numberOfCompletedSteps >= totalNumberOfSteps) {
      return 'Steps completed';
    }

    if (isSingleStep) {
      return ariaLabel ?? 'Step in progress';
    }

    return ariaLabel;
  }, [isSingleStep, numberOfCompletedSteps, ariaLabel]);

  const progressBarFillClassName = useMemo(() => {
    const animations = isSingleStep ? 'duration-150' : 'duration-300';

    return `h-full transition-all bg-colour-primary dark:bg-colour-primary-dark ${animations}`;
  }, [isSingleStep]);

  return (
    <div className={`w-full ${className}`} data-testid="progressbar">
      {showLabels && (
        <div className="flex justify-between mb-0.5">
          <div className="font-typography-label-semibold font-typography-label-semibold-weight text-typography-label-semibold leading-typography-label-semibold text-colour-onSurface dark:text-colour-onSurface-dark">
            {label}
          </div>
        </div>
      )}

      <div className="relative">
        <div
          className="w-full h-[5px] bg-colour-primary-container dark:bg-colour-primary-container-dark"
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-label={ariaLabelWithDefault}
        >
          <div
            className={progressBarFillClassName}
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
