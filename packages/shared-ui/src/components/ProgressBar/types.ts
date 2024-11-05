export interface ProgressBarProps {
  className?: string;
  numberOfCompletedSteps: number;
  totalNumberOfSteps: number;
  label?: string;
  ariaLabel?: string;
  showLabels?: boolean;
}
