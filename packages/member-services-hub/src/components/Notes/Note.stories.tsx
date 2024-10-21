import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import NotesContainer from '../Notes/NoteContainer';
import { NoteData } from '@/components/Notes/types';

const componentMeta: Meta<typeof NotesContainer> = {
  title: 'member-services-hub/NotesContainer',
  component: NotesContainer,
  argTypes: {
    initialNotes: {
      control: 'object',
      description: 'Initial notes to populate the container',
    },
  },
};

const Template: StoryFn<typeof NotesContainer> = (args) => <NotesContainer {...args} />;

const sampleNotes: NoteData[] = [
  {
    id: '1',
    comment: 'This is a sample note',
    category: 'User traits',
    cardNumber: '1234',
    createdBy: 'Admin User 1',
    createdDate: '01 Jan 2024, 09:00 AM',
    source: 'hub',
    checked: true,
  },
  {
    id: '2',
    comment: 'Another sample note',
    category: 'Card actions',
    cardNumber: '5678',
    createdBy: 'Admin User 2',
    createdDate: '02 Jan 2024, 10:30 AM',
    source: 'hub',
    checked: true,
  },
  {
    id: '3',
    comment: 'Third sample note',
    category: 'General behaviour info',
    cardNumber: '9012',
    createdBy: 'Admin User 3',
    createdDate: '03 Jan 2024, 11:45 AM',
    source: 'hub',
    checked: true,
  },
  {
    id: '4',
    comment: 'Fourth sample note',
    category: 'User traits',
    cardNumber: '3456',
    createdBy: 'Admin User 1',
    createdDate: '04 Jan 2024, 02:15 PM',
    source: 'hub',
    checked: false,
  },
  {
    id: '5',
    comment: 'Fifth sample note',
    category: 'Card actions',
    cardNumber: '7890',
    createdBy: 'Admin User 2',
    createdDate: '05 Jan 2024, 03:30 PM',
    source: 'hub',
    checked: false,
  },
  {
    id: '6',
    comment: 'Sixth sample note',
    category: 'General behaviour info',
    cardNumber: '2345',
    createdBy: 'Admin User 3',
    createdDate: '06 Jan 2024, 04:45 PM',
    source: 'hub',
    checked: false,
  },
];

const maxPinnedNotes: NoteData[] = [
  {
    id: '1',
    comment: 'Pinned note 1',
    category: 'User traits',
    cardNumber: '1111',
    createdBy: 'Admin User 1',
    createdDate: '01 Jan 2024, 09:00 AM',
    source: 'hub',
    checked: true,
  },
  {
    id: '2',
    comment: 'Pinned note 2',
    category: 'Card actions',
    cardNumber: '2222',
    createdBy: 'Admin User 2',
    createdDate: '02 Jan 2024, 10:30 AM',
    source: 'hub',
    checked: true,
  },
  {
    id: '3',
    comment: 'Pinned note 3',
    category: 'General behaviour info',
    cardNumber: '3333',
    createdBy: 'Admin User 3',
    createdDate: '03 Jan 2024, 11:45 AM',
    source: 'hub',
    checked: true,
  },
  {
    id: '4',
    comment: 'Pinned note 4',
    category: 'User traits',
    cardNumber: '4444',
    createdBy: 'Admin User 1',
    createdDate: '04 Jan 2024, 02:15 PM',
    source: 'hub',
    checked: true,
  },
  {
    id: '5',
    comment: 'Pinned note 5',
    category: 'Card actions',
    cardNumber: '5555',
    createdBy: 'Admin User 2',
    createdDate: '05 Jan 2024, 03:30 PM',
    source: 'hub',
    checked: true,
  },
  {
    id: '6',
    comment: 'Unpinned note',
    category: 'General behaviour info',
    cardNumber: '6666',
    createdBy: 'Admin User 3',
    createdDate: '06 Jan 2024, 04:45 PM',
    source: 'hub',
    checked: false,
  },
];

export const Default = Template.bind({});
Default.args = {
  initialNotes: sampleNotes,
};

export const WithNoNotes = Template.bind({});
WithNoNotes.args = {
  initialNotes: [],
};

export const WithMaxPinnedNotes = Template.bind({});
WithMaxPinnedNotes.args = {
  initialNotes: maxPinnedNotes,
};

WithMaxPinnedNotes.parameters = {
  docs: {
    description: {
      story: 'This story demonstrates the behavior when the maximum number of pinned notes (5) is reached.',
    },
  },
};

export default componentMeta;
