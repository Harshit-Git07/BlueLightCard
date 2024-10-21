import { Meta, StoryFn } from '@storybook/react';
import FilterDrawer from './FilterDrawer';
import { useState } from 'react';
import React from 'react';
import Checkbox from './FilterCheckbox';
import Select from './FilterSelect';
import PersonalDetails from './FilterPersonalDetails';
import CardNumber from './FilterCardNumber';
import DateToFrom from './FilterDateToFrom';
import Button from '../Button/Button';
import { ThemeVariant } from '@/app/common/types/theme';

const componentMeta: Meta<typeof FilterDrawer> = {
  title: 'member-services-hub/FilterDrawer Component',
  component: FilterDrawer,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 600,
      },
    },
  },
};

const Template: StoryFn<typeof FilterDrawer> = (args) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <Button
        id={'drawer-toggle'}
        onClick={() => {
          setIsDrawerOpen(!isDrawerOpen);
        }}
        variant={ThemeVariant.Secondary}
      >
        Show Drawer
      </Button>
      <FilterDrawer
        {...args}
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        data-testid="filter-drawer"
      />
    </>
  );
};

export const Default = Template.bind({});

Default.args = {
  heading: 'Filters',
  component: [
    {
      title: 'User Status',
      content: [
        <Checkbox
          key={'userAwaitingApproval'}
          id={'userAwaitingApproval'}
          label={'Awaiting Approval'}
        />,
        <Checkbox key={'userAwaitingId'} id={'userAwaitingId'} label={'Awaiting ID'} />,
        <Checkbox key={'userBanned'} id={'userBanned'} label={'Banned'} />,
        <Checkbox key={'userAnonymised'} id={'userAnonymised'} label={'Anonymised'} />,
      ],
    },
    {
      title: 'Trust',
      content: [
        <Select
          id={'selectTrust'}
          key={'selectTrust'}
          placeHolder={'Please Select a Trust'}
          values={[
            { label: 'Trust One', value: 'Trust One' },
            { label: 'Trust Two', value: 'Trust Two' },
            { label: 'Trust Three', value: 'Trust Three' },
            { label: 'Trust Four', value: 'Trust Four' },
          ]}
        />,
      ],
    },
    {
      title: 'Service',
      content: [
        <Select
          id={'selectService'}
          key={'selectService'}
          placeHolder={'Please Select a Service'}
          values={[
            { label: 'Service One', value: 'Service One' },
            { label: 'Service Two', value: 'Service Two' },
            { label: 'Service Three', value: 'Service Three' },
            { label: 'Service Four', value: 'Service Four' },
          ]}
        />,
      ],
    },
    {
      title: 'Personal Details',
      content: [<PersonalDetails key={'personalDetails'} />],
    },
    {
      title: 'Card Number',
      content: [<CardNumber key={'cardNumber'} />],
    },
    {
      title: 'Sign Up date',
      content: [<DateToFrom key={'signUpRange'} />],
    },
    {
      title: 'Card Status',
      content: [
        <Checkbox
          key={'cardAwaitingApproval'}
          id={'cardAwaitingApproval'}
          label={'Awaiting Approval'}
        />,
        <Checkbox key={'cardAwaitingId'} id={'cardAwaitingId'} label={'Awaiting ID'} />,
        <Checkbox key={'cardBanned'} id={'cardBanned'} label={'Banned'} />,
        <Checkbox key={'cardAnonymised'} id={'cardAnonymised'} label={'Anonymised'} />,
      ],
    },
  ],
};

export default componentMeta;
