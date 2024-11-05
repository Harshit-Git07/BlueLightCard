import { render, RenderResult, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from './index';
import renderer from 'react-test-renderer';
import { ProgressBarProps } from './types';

const threeStepProgressBar: ProgressBarProps = {
  numberOfCompletedSteps: 0,
  totalNumberOfSteps: 3,
  label: 'Step 1',
  ariaLabel: 'Test',
  showLabels: false,
};

describe('given component is rendered with three total steps and labels disabled', () => {
  const props: ProgressBarProps = { ...threeStepProgressBar };

  let renderResult: RenderResult;
  let progressBarContainer: HTMLElement;

  beforeEach(() => {
    renderResult = render(<ProgressBar {...props} />);
    progressBarContainer = renderResult.container;
  });

  it('should render without error', async () => {
    expect(await screen.findByTestId('progressbar')).toBeInTheDocument();
  });

  it('should render correct progress percentage', () => {
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('should have aria label', () => {
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', 'Test');
  });

  it('should not show labels', () => {
    expect(screen.queryByText('Step 1')).not.toBeInTheDocument();
  });

  it('should have correct transition duration', () => {
    const progressBar = progressBarContainer.querySelector('.transition-all');
    expect(progressBar).toHaveClass('duration-300');
  });

  it('should match the snapshot', () => {
    const component = renderer.create(<ProgressBar {...props} />);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('when first step is completed', () => {
    beforeEach(() => {
      renderResult.rerender(<ProgressBar {...props} numberOfCompletedSteps={1} />);
    });

    it('should render correct progress percentage', () => {
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '33');
    });
  });

  describe('when second step is completed', () => {
    beforeEach(() => {
      renderResult.rerender(<ProgressBar {...props} numberOfCompletedSteps={2} />);
    });

    it('should render correct progress percentage', () => {
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '67');
    });
  });

  describe('when all steps are completed', () => {
    beforeEach(() => {
      renderResult.rerender(<ProgressBar {...props} numberOfCompletedSteps={3} />);
    });

    it('should render correct progress percentage', () => {
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });
  });
});

describe('given component is rendered with a single steps and labels disabled', () => {
  const props: ProgressBarProps = {
    ...threeStepProgressBar,
    totalNumberOfSteps: 1,
  };

  let renderResult: RenderResult;
  let progressBarContainer: HTMLElement;

  beforeEach(() => {
    renderResult = render(<ProgressBar {...props} />);
    progressBarContainer = renderResult.container;
  });

  it('should render without error', async () => {
    expect(await screen.findByTestId('progressbar')).toBeInTheDocument();
  });

  it('should render correct progress percentage', () => {
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('should have aria label', () => {
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', 'Test');
  });

  it('should not show labels', () => {
    expect(screen.queryByText('Step 1')).not.toBeInTheDocument();
  });

  it('should have correct transition duration', () => {
    const progressBar = progressBarContainer.querySelector('.transition-all');
    expect(progressBar).toHaveClass('duration-150');
  });

  it('should match the snapshot', () => {
    const component = renderer.create(<ProgressBar {...props} />);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('when first step is completed', () => {
    beforeEach(() => {
      renderResult.rerender(<ProgressBar {...props} numberOfCompletedSteps={1} />);
    });

    it('should render correct progress percentage', () => {
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });
  });
});

describe('given component is rendered with labels enabled', () => {
  const props: ProgressBarProps = {
    ...threeStepProgressBar,
    showLabels: true,
  };

  beforeEach(() => {
    render(<ProgressBar {...props} />);
  });

  it('should show current step label', () => {
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });
});
