interface ProgressStepProps {
  label?: string;
  ariaLabel?: string;
}

interface ProgressBarProps {
  steps: ProgressStepProps[];
  numberOfCompletedSteps: number;
  emptyFirstStep?: boolean;
  showLabels?: boolean;
  completionLabel?: string;
  className?: string;
}
