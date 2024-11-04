import { Meta, StoryFn } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import ProgressBar from './';
import Button from '../Button-V2';

const componentMeta: Meta<typeof ProgressBar> = {
  title: 'Component System/ProgressBar',
  component: ProgressBar,
  parameters: {
    status: 'done',
  },
  argTypes: {
    steps: {
      control: {
        type: 'object',
      },
      description: 'Array of steps to show in the progress flow',
    },
    numberOfCompletedSteps: {
      control: {
        type: 'number',
        min: 0,
      },
      description: 'Current step in the progress flow',
    },
    emptyFirstStep: {
      control: 'boolean',
      description: 'Whether to include the first step in progress calculation',
      defaultValue: true,
    },
    showLabels: {
      control: 'boolean',
      description: 'Toggles the visibility of the step labels',
    },
    completionLabel: {
      control: 'text',
      description: 'Label to show when single step is complete',
    },
  },
};

const DefaultTemplate: StoryFn<typeof ProgressBar> = (args) => {
  const [_, updateArgs] = useArgs();

  const getMaxStep = () => {
    if (args.steps.length === 1) return 1;
    return args.emptyFirstStep ? args.steps.length : args.steps.length - 1;
  };

  const handleNext = () => {
    const maxStep = getMaxStep();
    if (args.numberOfCompletedSteps < maxStep) {
      const newStep = args.numberOfCompletedSteps + 1;
      updateArgs({ numberOfCompletedSteps: newStep });
    }
  };

  const handleBack = () => {
    if (args.numberOfCompletedSteps > 0) {
      const newStep = args.numberOfCompletedSteps - 1;
      updateArgs({ numberOfCompletedSteps: newStep });
    }
  };

  const handleAddStep = () => {
    const newStepNumber = args.steps.length + 1;
    const newStep = {
      label: `Step ${newStepNumber}`,
      ariaLabel: `Step ${newStepNumber} of ${newStepNumber}`,
    };

    const updatedSteps = [...args.steps, newStep].map((step, index) => ({
      ...step,
      ariaLabel: `Step ${index + 1} of ${newStepNumber}`,
    }));

    updateArgs({ steps: updatedSteps });
  };

  const handleRemoveStep = () => {
    if (args.steps.length <= 1) return;

    if (args.numberOfCompletedSteps >= args.steps.length - 1) {
      updateArgs({ numberOfCompletedSteps: args.steps.length - 2 });
    }

    const updatedSteps = args.steps.slice(0, -1).map((step, index) => ({
      ...step,
      ariaLabel: `Step ${index + 1} of ${args.steps.length - 1}`,
    }));

    updateArgs({ steps: updatedSteps });
  };

  const maxStep = getMaxStep();
  const isBackDisabled = args.numberOfCompletedSteps === 0;
  const isNextDisabled = args.numberOfCompletedSteps >= maxStep;
  const isRemoveDisabled = args.steps.length <= 1;

  return (
    <div className="space-y-4">
      <ProgressBar
        steps={args.steps}
        numberOfCompletedSteps={args.numberOfCompletedSteps}
        emptyFirstStep={args.emptyFirstStep}
        completionLabel={args.completionLabel}
        showLabels={args.showLabels}
      />
      <div className="flex gap-4">
        <Button onClick={handleBack} disabled={isBackDisabled}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={isNextDisabled}>
          Next
        </Button>
        <Button onClick={handleAddStep}>Add Step</Button>
        <Button onClick={handleRemoveStep} disabled={isRemoveDisabled}>
          Remove Step
        </Button>
      </div>
    </div>
  );
};

const StaticTemplate: StoryFn<typeof ProgressBar> = (args) => {
  return (
    <div className="space-y-4">
      <ProgressBar
        steps={args.steps}
        numberOfCompletedSteps={args.numberOfCompletedSteps}
        emptyFirstStep={args.emptyFirstStep}
        completionLabel={args.completionLabel}
        showLabels={args.showLabels}
      />
    </div>
  );
};

export const Default = StaticTemplate.bind({});
Default.args = {
  steps: [
    {
      label: 'Step 1',
      ariaLabel: 'Step 1 of 3',
    },
    {
      label: 'Step 2',
      ariaLabel: 'Step 2 of 3',
    },
    {
      label: 'Step 3',
      ariaLabel: 'Step 3 of 3',
    },
  ],
  numberOfCompletedSteps: 0,
  showLabels: true,
};

export const DefaultWithControls = DefaultTemplate.bind({});
DefaultWithControls.args = {
  steps: [
    {
      label: 'Step 1',
      ariaLabel: 'Step 1 of 3',
    },
    {
      label: 'Step 2',
      ariaLabel: 'Step 2 of 3',
    },
    {
      label: 'Step 3',
      ariaLabel: 'Step 3 of 3',
    },
  ],
  numberOfCompletedSteps: 0,
  showLabels: true,
};

export const SingleStep = DefaultTemplate.bind({});
SingleStep.args = {
  steps: [
    {
      label: 'Single Step',
      ariaLabel: 'Single Step Progress',
    },
  ],
  showLabels: true,
  numberOfCompletedSteps: 0,
  completionLabel: 'Complete',
};

export const WithoutLabels = DefaultTemplate.bind({});
WithoutLabels.args = {
  ...Default.args,
  showLabels: false,
};

export const UnfilledStart = DefaultTemplate.bind({});
UnfilledStart.args = {
  steps: [
    {
      label: 'Step 1',
      ariaLabel: 'Step 1 of 3',
    },
    {
      label: 'Step 2',
      ariaLabel: 'Step 2 of 3',
    },
    {
      label: 'Step 3',
      ariaLabel: 'Step 3 of 3',
    },
  ],
  numberOfCompletedSteps: 0,
  showLabels: true,
  emptyFirstStep: true,
  completionLabel: 'Complete',
};

export default componentMeta;
