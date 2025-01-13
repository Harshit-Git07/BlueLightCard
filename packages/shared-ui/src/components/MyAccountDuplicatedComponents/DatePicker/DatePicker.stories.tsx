import { Meta, StoryFn } from '@storybook/react';
import DatePicker from './';
import { FormEvent, useState } from 'react';
import { z } from 'zod';
import Button from '../../Button-V2';

const componentMeta: Meta<typeof DatePicker> = {
  title: 'MY_ACCOUNT_DUPLICATE/DatePicker',
  component: DatePicker,
  parameters: {
    status: 'done',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/n2NzB4G3OTR74o3dQ4BOwm/My-Account-%26-Sign-up-Component-library?node-id=47-13809&node-type=canvas&m=dev',
    },
  },
};

const DefaultTemplate: StoryFn<typeof DatePicker> = (args) => (
  <div className="h-[300px]">
    <DatePicker {...args} />
    <p>Other Content</p>
  </div>
);
const baseProps = {
  label: 'Date of Birth',
  description: 'Please enter your date of birth',
  helpText: 'Must be over 18 years old',
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  ...baseProps,
  onChange: (date) => console.log(date),
};

export const Disabled = DefaultTemplate.bind({});
Disabled.args = {
  ...baseProps,
  isDisabled: true,
  onChange: (date) => console.log(date),
};

export const Filled = DefaultTemplate.bind({});
Filled.args = {
  ...baseProps,
  value: new Date('1995-09-02'),
  onChange: (date) => console.log(date),
};

export const ErrorStory = DefaultTemplate.bind({});
ErrorStory.args = {
  ...baseProps,
  value: new Date(),
  validationMessage: 'Must Be Over 18 Years Old',
  onChange: (date) => console.log(date),
};

const exampleValidation = z.object({
  dob: z
    .date({ required_error: 'Date of birth is required' })
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), {
      message: 'You must be over 18 years old',
    }),
});

type FormData = z.infer<typeof exampleValidation>;

export const ExampleUsage = () => {
  const [formData, setFormData] = useState<Partial<FormData>>({ dob: undefined });
  const [error, setError] = useState<{ dob?: string[] }>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = exampleValidation.safeParse(formData);

    if (result.success) {
      setError({});
    } else {
      setError(result.error.formErrors.fieldErrors);
    }
  };

  return (
    <div>
      <form className="h-[300px]" onSubmit={handleSubmit}>
        <DatePicker
          label="Date of Birth"
          description="Please enter your date of birth"
          tooltip="Must be over 18 years old"
          value={formData.dob}
          onChange={(date) => setFormData({ ...formData, dob: date })}
          validationMessage={error?.dob ? error.dob[0] : undefined}
        />
        <Button type="submit" className="mt-2">
          Submit
        </Button>
      </form>

      <pre>onChange param {JSON.stringify(formData.dob, null, 2)}</pre>
    </div>
  );
};

export default componentMeta;
