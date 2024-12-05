import { Meta, StoryFn } from '@storybook/react';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';
import { RenewalModal } from '@/root/src/member-eligibility/renewal/modal/RenewalModal';

const componentMeta: Meta<typeof RenewalModal> = {
  title: 'Pages/Renewal Eligibility Flow/Renewal Modal',
  component: RenewalModal,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
  },
};

const DesktopTemplate: StoryFn<typeof RenewalModal> = () => {
  return <RenewalModal />;
};
export const Desktop = DesktopTemplate.bind({});

const MobileTemplate: StoryFn<typeof RenewalModal> = () => {
  return <RenewalModal forceMobileView />;
};
export const Mobile = MobileTemplate.bind({});

export default componentMeta;
