import { Meta, StoryFn } from '@storybook/react';
import IdVerification from './index';
import StoryDrawerWrapper from './StoryDrawerWrapper';

const componentMeta: Meta<typeof IdVerification> = {
  title: 'Organisms/Id Verification',
  component: IdVerification,
};

const DefaultTemplate: StoryFn<typeof IdVerification> = (args) => {
  const { isDoubleId = false } = args;
  const content = <IdVerification isDoubleId={isDoubleId} />;

  return <StoryDrawerWrapper content={content} minHeight={800} />;
};

export const Default = DefaultTemplate.bind({});

Default.args = {
  isDoubleId: false,
};

export default componentMeta;
