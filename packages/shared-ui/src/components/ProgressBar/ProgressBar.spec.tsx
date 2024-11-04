import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from './index';
import renderer from 'react-test-renderer';

describe('ProgressBar component', () => {
  const defaultSteps: ProgressStepProps[] = [
    {
      label: 'Step 1',
      ariaLabel: 'First step',
    },
    {
      label: 'Step 2',
      ariaLabel: 'Second step',
    },
    {
      label: 'Step 3',
      ariaLabel: 'Third step',
    },
  ];

  const props: ProgressBarProps = {
    steps: defaultSteps,
    numberOfCompletedSteps: 0,
    showLabels: false,
  };

  describe('smoke test', () => {
    it('should render component without error', () => {
      const { baseElement } = render(<ProgressBar {...props} />);

      expect(baseElement).toBeTruthy();
    });
  });

  describe('multi-step progress', () => {
    it('should render correct progress percentage for first step', () => {
      render(<ProgressBar {...props} />);
      const progressBar = screen.getByRole('progressbar');

      expect(progressBar).toHaveAttribute('aria-valuenow', '33');
    });

    it('should render correct progress percentage for middle step', () => {
      const middleStep = 1;

      render(<ProgressBar {...props} numberOfCompletedSteps={middleStep} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '67');
    });

    it('should render correct progress percentage for last step', () => {
      const lastStep = 2;

      render(<ProgressBar {...props} numberOfCompletedSteps={lastStep} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });

    it('should show correct aria-label for current step', () => {
      const middleStep = 1;

      render(<ProgressBar {...props} numberOfCompletedSteps={middleStep} />);
      const progressBar = screen.getByRole('progressbar');

      expect(progressBar).toHaveAttribute('aria-label', 'Second step');
    });
  });

  describe('single-step progress', () => {
    const singleStepProps: ProgressBarProps = {
      steps: [
        {
          label: 'Single Step',
          ariaLabel: 'Single step in progress',
        },
      ],
      numberOfCompletedSteps: 0,
      showLabels: false,
    };

    it('should show 0% progress when not completed', () => {
      render(<ProgressBar {...singleStepProps} numberOfCompletedSteps={0} />);
      const progressBar = screen.getByRole('progressbar');

      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });

    it('should show 100% progress when completed', () => {
      const completedStep = 1;

      render(<ProgressBar {...singleStepProps} numberOfCompletedSteps={completedStep} />);
      const progressBar = screen.getByRole('progressbar');

      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });

    it('should show completion label when provided and step is complete', () => {
      const completionLabel = 'Completed!';

      render(
        <ProgressBar
          {...singleStepProps}
          numberOfCompletedSteps={1}
          showLabels={true}
          completionLabel={completionLabel}
        />,
      );

      expect(screen.getByText(completionLabel)).toBeInTheDocument();
    });

    it('should show original label when step is not complete', () => {
      render(<ProgressBar {...singleStepProps} numberOfCompletedSteps={0} showLabels={true} />);

      expect(screen.getByText('Single Step')).toBeInTheDocument();
    });
  });

  describe('labels', () => {
    it('should not show labels when showLabels is false', () => {
      render(<ProgressBar {...props} />);

      expect(screen.queryByText('Step 1')).not.toBeInTheDocument();
    });

    it('should show current step label when showLabels is true', () => {
      const currentStep = 1;

      render(<ProgressBar {...props} showLabels={true} numberOfCompletedSteps={currentStep} />);

      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });
  });

  describe('transitions', () => {
    it('should have correct transition duration for multi-step', () => {
      const { container } = render(<ProgressBar {...props} />);
      const progressBar = container.querySelector('.transition-all');

      expect(progressBar).toHaveClass('duration-300');
    });

    it('should have correct transition duration for single-step', () => {
      const singleStep = [{ label: 'Single Step' }];

      const { container } = render(<ProgressBar {...props} steps={singleStep} />);
      const progressBar = container.querySelector('.transition-all');

      expect(progressBar).toHaveClass('duration-150');
    });
  });

  describe('visual states', () => {
    it('renders multi-step progress bar correctly', () => {
      const component = renderer.create(<ProgressBar {...props} />);
      const tree = component.toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders single-step progress bar correctly', () => {
      const singleStepProps = {
        steps: [
          {
            label: 'Single Step',
            ariaLabel: 'Single step',
          },
        ],
        numberOfCompletedSteps: 0,
        showLabels: true,
      };

      const component = renderer.create(<ProgressBar {...singleStepProps} />);
      const tree = component.toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders completed progress bar with completion label', () => {
      const completedProps = {
        steps: [
          {
            label: 'Single Step',
            ariaLabel: 'Single step',
          },
        ],
        numberOfCompletedSteps: 1,
        showLabels: true,
        completionLabel: 'Done!',
      };

      const component = renderer.create(<ProgressBar {...completedProps} />);
      const tree = component.toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
