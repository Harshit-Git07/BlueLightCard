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
    numberOfCompletedSteps: {
      control: {
        type: 'number',
        min: 0,
      },
      description: 'Current step in the progress flow',
    },
    totalNumberOfSteps: {
      control: {
        type: 'number',
        min: 4,
      },
      description: 'Total number of steps in the progress flow',
    },
    label: {
      control: {
        type: 'string',
      },
      description: 'A label shown above the progress bar',
    },
    ariaLabel: {
      control: {
        type: 'string',
      },
      description: "An accessibility label the progress bar's fill",
    },
    showLabels: {
      control: 'boolean',
      description: 'Toggles the visibility of the step labels',
    },
  },
};

const DefaultTemplate: StoryFn<typeof ProgressBar> = (args) => {
  const [_, updateArgs] = useArgs();

  const handleNext = () => {
    if (args.numberOfCompletedSteps < args.totalNumberOfSteps) {
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
    updateArgs({
      label: `Step ${args.numberOfCompletedSteps + 1}`,
      ariaLabel: `Step ${args.numberOfCompletedSteps} of ${args.totalNumberOfSteps + 1}`,
      totalNumberOfSteps: args.totalNumberOfSteps + 1,
    });
  };

  const handleRemoveStep = () => {
    if (args.totalNumberOfSteps <= 1) return;

    if (args.numberOfCompletedSteps >= args.totalNumberOfSteps - 1) {
      updateArgs({ numberOfCompletedSteps: args.totalNumberOfSteps - 2 });
    }

    updateArgs({
      totalNumberOfSteps: args.totalNumberOfSteps - 1,
    });
  };

  const isBackDisabled = args.numberOfCompletedSteps === 0;
  const isNextDisabled = args.numberOfCompletedSteps >= args.totalNumberOfSteps;
  const isRemoveDisabled = args.totalNumberOfSteps <= 1;

  return (
    <div className="space-y-4">
      <ProgressBar {...args} />
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
      <ProgressBar {...args} />
    </div>
  );
};

export const Default = StaticTemplate.bind({});
Default.args = {
  numberOfCompletedSteps: 0,
  totalNumberOfSteps: 3,
  label: 'Step 1',
  ariaLabel: 'Step 1 of 3',
};

export const DefaultWithControls = DefaultTemplate.bind({});
DefaultWithControls.args = {
  numberOfCompletedSteps: 0,
  totalNumberOfSteps: 3,
  label: 'Step 1',
  ariaLabel: 'Step 1 of 3',
};

export const SingleStep = DefaultTemplate.bind({});
SingleStep.args = {
  showLabels: true,
  numberOfCompletedSteps: 0,
  totalNumberOfSteps: 1,
  label: 'Complete',
};

export const WithoutLabels = DefaultTemplate.bind({});
WithoutLabels.args = {
  ...Default.args,
  showLabels: false,
};

export const UnfilledStart = DefaultTemplate.bind({});
UnfilledStart.args = {
  numberOfCompletedSteps: 0,
  totalNumberOfSteps: 3,
  label: 'Complete',
};

export default componentMeta;
