import { Meta, StoryFn } from '@storybook/react';
import TextArea from './TextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard } from '@fortawesome/pro-regular-svg-icons';
import { VALIDATION_ENUM } from '@/app/_zodSchemas/validationEnum';

const componentMeta: Meta<typeof TextArea> = {
  title: 'member-services-hub/TextArea',
  component: TextArea,
};

const Template: StoryFn<typeof TextArea> = (args) => <TextArea {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: 'Label',
};

export const TextAreaMin3Validation = Template.bind({});

TextAreaMin3Validation.args = {
  label: 'Label',
  disabled: false,
  placeholder: 'placeholder text...',
  icon: <FontAwesomeIcon icon={faIdCard} />,
  width: '100%',
  validationType: VALIDATION_ENUM.MINIMUM_OF_3,
  validationSuccessMessage: 'Input Valid',
};

export default componentMeta;
