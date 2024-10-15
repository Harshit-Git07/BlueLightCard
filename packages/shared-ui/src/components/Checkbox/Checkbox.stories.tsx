import { Meta, StoryFn } from '@storybook/react';
import Checkbox, { Props } from '../Checkbox';
import { ChangeEvent, useEffect, useState } from 'react';

type CheckboxWrapperProp = {
  name?: string;
  value?: string;
  variant?: 'Default' | 'withBorder';
  isDisabled: boolean;
  checkboxText: string;
  isChecked?: boolean;
};

const CheckboxWrapper = ({
  name,
  value,
  variant,
  isDisabled,
  checkboxText,
  isChecked = false,
}: CheckboxWrapperProp) => {
  const [checked, setChecked] = useState<boolean>();

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Checkbox
      name={name}
      value={value}
      variant={variant}
      isDisabled={isDisabled}
      checkboxText={checkboxText}
      isChecked={checked}
      onChange={handleChange}
    />
  );
};

export default {
  title: 'Component System/Checkbox',
  component: Checkbox,
} as Meta;

const Template: StoryFn<Props> = (args) => {
  return (
    <div className="flex">
      <CheckboxWrapper {...args} />
    </div>
  );
};

export const AllStatesAndVariants: StoryFn<typeof CheckboxWrapper> = (args) => {
  return (
    <table cellPadding={20} className={'text-colour-onSurface dark:text-colour-onSurface-dark'}>
      <tr>
        <th></th>
        <th>Disabled</th>
        <th>Unselected</th>
        <th>Selected</th>
      </tr>
      <tr>
        <th rowSpan={2}>Default</th>
        <td>Yes</td>
        <td>
          <Checkbox
            variant="Default"
            isDisabled={true}
            isChecked={false}
            checkboxText="Checkbox text"
          />
        </td>
        <td>
          <Checkbox
            variant="Default"
            isDisabled={true}
            isChecked={true}
            checkboxText="Checkbox text"
          />
        </td>
      </tr>
      <tr>
        <td>No</td>
        <td>
          <Checkbox
            variant="Default"
            isDisabled={false}
            isChecked={false}
            checkboxText="Checkbox text"
          />
        </td>
        <td>
          <Checkbox
            variant="Default"
            isDisabled={false}
            isChecked={true}
            checkboxText="Checkbox text"
          />
        </td>
      </tr>
      <tr>
        <th rowSpan={2}>withBorder</th>
        <td>Yes</td>
        <td>
          <Checkbox
            variant="withBorder"
            isDisabled={true}
            isChecked={false}
            checkboxText="Checkbox text"
          />
        </td>
        <td>
          <Checkbox
            variant="withBorder"
            isDisabled={true}
            isChecked={true}
            checkboxText="Checkbox text"
          />
        </td>
      </tr>
      <tr>
        <td>No</td>
        <td>
          <Checkbox
            variant="withBorder"
            isDisabled={false}
            isChecked={false}
            checkboxText="Checkbox text"
          />
        </td>
        <td>
          <Checkbox
            variant="withBorder"
            isDisabled={false}
            isChecked={true}
            checkboxText="Checkbox text"
          />
        </td>
      </tr>
    </table>
  );
};

export const Default = Template.bind({});
Default.args = {
  variant: 'Default',
  isDisabled: false,
  checkboxText: 'Checkbox text',
  isChecked: false,
};

export const DefaultChecked = Template.bind({});
DefaultChecked.args = {
  variant: 'Default',
  isDisabled: false,
  checkboxText: 'Checkbox text',
  isChecked: true,
};

export const DefaultDisabled = Template.bind({});
DefaultDisabled.args = {
  variant: 'Default',
  isDisabled: true,
  checkboxText: 'Checkbox text',
  isChecked: false,
};

export const DefaultDisabledChecked = Template.bind({});
DefaultDisabledChecked.args = {
  variant: 'Default',
  isDisabled: true,
  checkboxText: 'Checkbox text',
  isChecked: true,
};

export const WithBorder = Template.bind({});
WithBorder.args = {
  variant: 'withBorder',
  isDisabled: false,
  checkboxText: 'Checkbox text',
  isChecked: false,
};

export const WithBorderChecked = Template.bind({});
WithBorderChecked.args = {
  variant: 'withBorder',
  isDisabled: false,
  checkboxText: 'Checkbox text',
  isChecked: true,
};

export const WithBorderDisabled = Template.bind({});
WithBorderDisabled.args = {
  variant: 'withBorder',
  isDisabled: true,
  checkboxText: 'Checkbox text',
  isChecked: false,
};

export const WithBorderDisabledChecked = Template.bind({});
WithBorderDisabledChecked.args = {
  variant: 'withBorder',
  isDisabled: true,
  checkboxText: 'Checkbox text',
  isChecked: true,
};
