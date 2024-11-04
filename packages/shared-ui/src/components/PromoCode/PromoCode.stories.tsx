import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import PromoCode from './';
import { PromoCodeVariant } from './types';

const componentMeta: Meta<typeof PromoCode> = {
  title: 'Component System/PromoCode',
  component: PromoCode,
  parameters: {
    status: 'done',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'open', 'error', 'success'] as PromoCodeVariant[],
    },
    icon: {
      control: 'boolean',
    },
  },
};

const Template: StoryFn<typeof PromoCode> = (args) => {
  const [variant, setVariant] = useState<PromoCodeVariant>(args.variant ?? 'default');
  const [value, setValue] = useState(args.value ?? '');
  const [errorMessage, setErrorMessage] = useState(args.errorMessage ?? '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (variant === 'error') {
      setVariant('open');
      setErrorMessage('');
    }
  };

  const handleApply = (code: string) => {
    if (code.toUpperCase() === 'INVALID') {
      setVariant('error');
      setErrorMessage('The code has expired.');
    } else {
      setVariant('success');
      setErrorMessage('');
    }
  };

  const handleStateChange = (newVariant: PromoCodeVariant) => {
    setVariant(newVariant);
    if (newVariant === 'default') {
      setErrorMessage('');
    }
  };

  const handleRemove = () => {
    setValue('');
  };

  return (
    <PromoCode
      {...args}
      variant={variant}
      value={value}
      onChange={handleChange}
      onApply={handleApply}
      onRemove={handleRemove}
      onStateChange={handleStateChange}
      errorMessage={errorMessage}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  variant: 'default',
  label: 'Add your promo code',
  infoMessage: 'This will allow you to skip some steps',
  icon: true,
  placeholder: 'Enter promo code',
};

export const Open = Template.bind({});
Open.args = {
  ...Default.args,
  variant: 'open',
};

export const Filled = Template.bind({});
Filled.args = {
  ...Default.args,
  variant: 'open',
  value: 'PROMO123',
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  variant: 'error',
  value: 'INVALID',
  errorMessage: 'Invalid promo code. Please try again.',
};

export const Success = Template.bind({});
Success.args = {
  ...Default.args,
  variant: 'success',
  value: 'VALID123',
};

export default componentMeta;
