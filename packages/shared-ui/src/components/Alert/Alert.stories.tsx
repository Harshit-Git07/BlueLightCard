import { Meta, StoryFn } from '@storybook/react';
import Alert from '.';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';

import { ThemeVariant } from 'src/types';
import Button from '../Button';
import Link from '../Link';
const icons = { faCircle };

library.add(...Object.values(icons));
const componentMeta: Meta<typeof Alert> = {
  title: 'Component System/Alert',
  component: Alert,
  argTypes: {
    isDismissable: {
      control: 'boolean',

      if: { arg: 'variant', eq: 'Banner' },
    },
    icon: {
      control: {
        type: 'text',
      },
      description: 'Custom icon to display (required for Default state) *',
    },
    variant: {
      control: 'select',
      options: ['Banner', 'Inline'],
    },
  },
};

const AlertTemplate: StoryFn<typeof Alert> = (args) => <Alert {...args} />;

export const Banner = AlertTemplate.bind({});
Banner.args = {
  variant: 'Banner',
  state: 'Default',
  icon: 'faCircle',
  title: 'This is a banner alert on desktop',
  isDismissable: true,
};

export const Inline = AlertTemplate.bind({});
Inline.args = {
  variant: 'Inline',
  icon: 'faCircle',
  state: 'Default',
  title: 'This is an inline alert on desktop',
  subtext: <p>Some subtext can go here it can be up to two lines.</p>,
};

Inline.argTypes = {
  isDismissable: { table: { disable: true } },
};

Inline.decorators = [
  (Story) => (
    <div style={{ width: '500px', margin: '0 auto' }}>
      <Story />
    </div>
  ),
];

export const BannerButton = AlertTemplate.bind({});

BannerButton.args = {
  variant: 'Banner',
  state: 'Default',
  icon: 'faCircle',
  title:
    'This is a Banner button alert with very long title-  it has no sub text and no close but has a cta and maintains minimum height of 84px.',
  isDismissable: true,
  children: (
    <Button
      type="button"
      iconLeft={icons.faCircle}
      iconRight={icons.faCircle}
      variant={ThemeVariant.Primary}
      onClick={() => {}}
    >
      Click me
    </Button>
  ),
};

export const InlineButton = AlertTemplate.bind({});

InlineButton.args = {
  variant: 'Inline',
  state: 'Default',
  icon: 'faCircle',
  title: 'This is a Inline button alert',
  subtext: <p>Some subtext can go here it can be up to two lines.</p>,
  children: (
    <Button
      type="button"
      iconLeft={icons.faCircle}
      iconRight={icons.faCircle}
      variant={ThemeVariant.Primary}
      onClick={() => {}}
    >
      Click me
    </Button>
  ),
};

InlineButton.decorators = [
  (Story) => (
    <div style={{ width: '500px', margin: '0 auto' }}>
      <Story />
    </div>
  ),
];

export const BannerLink = AlertTemplate.bind({});

BannerLink.args = {
  variant: 'Banner',
  isDismissable: true,
  state: 'Default',
  icon: 'faCircle',
  title: 'This is a Banner alert with link',
  children: (
    <Button type="button" variant={ThemeVariant.Tertiary} onClick={() => {}}>
      Click me
    </Button>
  ),
};

export const InlineLink = AlertTemplate.bind({});

InlineLink.args = {
  variant: 'Inline',
  state: 'Default',
  icon: 'faCircle',
  title: 'This is a inline alert with link',
  children: (
    <Button type="button" variant={ThemeVariant.Tertiary} onClick={() => {}}>
      Click me
    </Button>
  ),
};

InlineLink.decorators = [
  (Story) => (
    <div style={{ width: '500px', margin: '0 auto' }}>
      <Story />
    </div>
  ),
];

export const AlertSuccess = AlertTemplate.bind({});

AlertSuccess.args = {
  variant: 'Banner',
  title: 'Success! Your action was completed.',
  state: 'Success',
  subtext: <p>Everything went smoothly. You can continue with your tasks.</p>,
  isDismissable: true,
};

export const AlertInfo = AlertTemplate.bind({});
AlertInfo.args = {
  variant: 'Banner',
  title: 'Information Alert',
  state: 'Info',
  subtext: <p>Please note that some important information is available.</p>,
  isDismissable: true,
};

export const AlertWarning = AlertTemplate.bind({});

AlertWarning.args = {
  variant: 'Banner',
  title: 'Warning! Check your input.',
  state: 'Warning',
  subtext: <p>There seems to be an issue. Please verify your entries.</p>,
  isDismissable: true,
};

export const AlertError = AlertTemplate.bind({});

AlertError.args = {
  variant: 'Banner',
  title: 'Error! Something went wrong.',
  state: 'Error',
  subtext: <p>An error occurred while processing your request. Please try again.</p>,
  isDismissable: true,
};

export const RichTextBanner = AlertTemplate.bind({});

RichTextBanner.args = {
  variant: 'Banner',
  state: 'Default',
  icon: 'faCircle',
  title: 'This is a banner alert on desktop',
  subtext: (
    <>
      <p>
        This is {''}
        <strong className="text-colour-secondary-light dark:text-colour-secondary-dark">
          line one
        </strong>
      </p>
      <p>
        This is <i>line two</i>
      </p>
      <p className="pt-1">
        <Link onClickLink={() => {}} useLegacyRouting={false}>
          View details
        </Link>
      </p>
    </>
  ),
  isDismissable: true,
};

export const RichTextInline = AlertTemplate.bind({});

RichTextInline.args = {
  variant: 'Inline',
  state: 'Default',
  icon: 'faCircle',
  title: 'This is a Inline alert on desktop',
  subtext: (
    <>
      <p>
        This is {''}
        <strong className="text-colour-secondary-light dark:text-colour-secondary-dark">
          line one
        </strong>
      </p>
      <p>
        This is <i>line two</i>
      </p>
      <p className="pt-1">
        <Link onClickLink={() => {}} useLegacyRouting={false}>
          View details
        </Link>
      </p>
    </>
  ),
};

RichTextInline.decorators = [
  (Story) => (
    <div style={{ width: '500px', margin: '0 auto' }}>
      <Story />
    </div>
  ),
];

export const CustomBanner = AlertTemplate.bind({});

CustomBanner.args = {
  variant: 'Banner',
  state: 'Default',
  icon: 'faCircle',
  title: 'This is a banner alert on desktop',
  isDismissable: true,
  alertBackgroundColor:
    'bg-colour-secondary-highlight-fixed-light dark:bg-colour-secondary-highlight-fixed-dark',
  iconAccentColor:
    'text-colour-primary-highlight-fixed-light dark:text-colour-primary-highlight-fixed-dark',
};

export const CustomInline = AlertTemplate.bind({});

CustomInline.args = {
  variant: 'Inline',
  state: 'Default',
  icon: 'faCircle',
  title: 'This is a Inline alert on desktop',
  alertBackgroundColor:
    'bg-colour-secondary-highlight-fixed-light dark:bg-colour-secondary-highlight-fixed-dark',
  iconAccentColor:
    'text-colour-primary-highlight-fixed-light dark:text-colour-primary-highlight-fixed-dark',
};

CustomInline.decorators = [
  (Story) => (
    <div style={{ width: '500px', margin: '0 auto' }}>
      <Story />
    </div>
  ),
];

export default componentMeta;
