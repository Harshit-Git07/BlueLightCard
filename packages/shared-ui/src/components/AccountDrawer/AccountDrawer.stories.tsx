import { Meta, StoryFn } from '@storybook/react';
import AccountDrawer from './index';
import Drawer from '../Drawer/index';
import { useEffect } from 'react';
import useDrawer from '../Drawer/useDrawer';
import Button from '../Button/index';

const componentMeta: Meta<typeof AccountDrawer> = {
  title: 'Component System/AccountDrawer',
  component: AccountDrawer,
  argTypes: {
    children: {
      control: 'text',
      description: 'Content to be displayed within the AccountDrawer.',
    },
  },
};

const Template: StoryFn<typeof AccountDrawer> = (args) => {
  const { close, open } = useDrawer();

  const content = (
    <AccountDrawer
      title={args.title}
      primaryButtonLabel={args.primaryButtonLabel || 'Enabled Action'}
      primaryButtonOnClick={() => true}
      secondaryButtonLabel={args.secondaryButtonLabel || 'Cancel'}
      secondaryButtonOnClick={close}
      isDisabled={args.isDisabled}
    >
      <p className="text-black dark:text-white">
        {args.children ||
          'Content goes in here ... This is the default behaviour of Account Drawer with no title'}
      </p>
    </AccountDrawer>
  );

  useEffect(() => {
    open(content);
    return () => close();
  }, []);

  return (
    <div style={{ minHeight: 800 }}>
      <Drawer />
      <Button onClick={() => open(content)}>Open</Button>
    </div>
  );
};

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  title: 'This is an optional Title',
  primaryButtonLabel: 'Disabled Action',
  secondaryButtonLabel: 'Cancel',
  isDisabled: true,
  children: 'Content goes in here... this account drawer action cta is disabled',
};

export default componentMeta;
