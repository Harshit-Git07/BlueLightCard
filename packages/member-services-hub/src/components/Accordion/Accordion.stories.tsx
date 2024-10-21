import { Meta, StoryFn } from '@storybook/react';
import Accordion from './Accordion';
import AccordionChildInput from './AccordionChildInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faMessageText } from '@fortawesome/pro-regular-svg-icons';
import AccordionChildText from './AccordionChildText';

const componentMeta: Meta<typeof Accordion> = {
  title: 'member-services-hub/Accordion',
  component: Accordion,
};

const Template: StoryFn<typeof Accordion> = (args) => <Accordion {...args} />;

export const Default = Template.bind({});

Default.args = {
  header: 'Undefined accordion',
};
const childInputProps = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phoneNumber: 'Phone number',
};

export const IconAndFieldsAccordion = Template.bind({});

IconAndFieldsAccordion.args = {
  header: 'Personal Details',
  childComponent: <AccordionChildInput fields={childInputProps} />,
  icon: <FontAwesomeIcon icon={faIdCard} />,
};

export const TextAccordion = Template.bind({});

TextAccordion.args = {
  header: 'A text Accordion',
  childComponent: <AccordionChildText text="hello this is text" />,
  icon: <FontAwesomeIcon icon={faMessageText} />,
};

export default componentMeta;
