import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotesContainer from '../../../components/Notes/NoteContainer';
import { NoteData, AddNoteFormProps, NotesTableProps } from '../../../components/Notes/types';

jest.mock('../../../components/Notes/AddNoteForm', () => ({ onAddNote }: AddNoteFormProps) => (
  <div data-testid="add-note-form">
    <button
      onClick={() =>
        onAddNote({
          comment: 'New note',
          category: 'General',
          isPinned: false,
        })
      }
    >
      Add Note
    </button>
  </div>
));

jest.mock('../../../components/Notes/NoteTable', () => ({ notes, setNotes }: NotesTableProps) => (
  <div data-testid="notes-table">
    {notes.map((note: NoteData) => (
      <div key={note.id} data-testid="note-row">
        {note.comment}
      </div>
    ))}
  </div>
));

describe('NotesContainer Component', () => {
  const mockInitialNotes: NoteData[] = [
    {
      id: '1',
      comment: 'Test comment 1',
      category: 'User traits',
      cardNumber: '1234',
      createdBy: 'John Doe',
      createdDate: '2023-09-01',
      source: 'hub',
      checked: false,
    },
    {
      id: '2',
      comment: 'Test comment 2',
      category: 'Card actions',
      cardNumber: '5678',
      createdBy: 'Jane Smith',
      createdDate: '2023-09-02',
      source: 'Zen',
      checked: true,
    },
  ];

  it('renders NotesContainer with initial notes', () => {
    render(<NotesContainer initialNotes={mockInitialNotes} />);
    expect(screen.getByTestId('notes-table')).toBeInTheDocument();
    expect(screen.getByTestId('add-note-form')).toBeInTheDocument();
    expect(screen.getAllByTestId('note-row')).toHaveLength(2);
  });

  it('adds a new note when AddNoteForm triggers onAddNote', () => {
    render(<NotesContainer initialNotes={mockInitialNotes} />);
    const addNoteButton = screen.getByText('Add Note');
    fireEvent.click(addNoteButton);
    expect(screen.getAllByTestId('note-row')).toHaveLength(3);
    expect(screen.getByText('New note')).toBeInTheDocument();
  });

  it('updates notes when initialNotes prop changes', () => {
    const { rerender } = render(<NotesContainer initialNotes={mockInitialNotes} />);
    expect(screen.getAllByTestId('note-row')).toHaveLength(2);

    const updatedNotes: NoteData[] = [
      ...mockInitialNotes,
      {
        id: '3',
        comment: 'Test comment 3',
        category: 'General',
        cardNumber: '9012',
        createdBy: 'Alice Johnson',
        createdDate: '2023-09-03',
        source: 'Manual',
        checked: false,
      },
    ];

    rerender(<NotesContainer initialNotes={updatedNotes} />);
    expect(screen.getAllByTestId('note-row')).toHaveLength(3);
    expect(screen.getByText('Test comment 3')).toBeInTheDocument();
  });

  it('limits pinned notes to 5', () => {
    const manyPinnedNotes: NoteData[] = Array(6)
      .fill(null)
      .map((_, index) => ({
        id: (index + 1).toString(),
        comment: `Pinned note ${index + 1}`,
        category: 'General',
        cardNumber: '1234',
        createdBy: 'Test User',
        createdDate: '2023-09-01',
        source: 'Manual',
        checked: true,
      }));

    render(<NotesContainer initialNotes={manyPinnedNotes} />);
    const addNoteButton = screen.getByText('Add Note');
    fireEvent.click(addNoteButton);

    const noteRows = screen.getAllByTestId('note-row');
    expect(noteRows).toHaveLength(7);

    // Verify that the new note is at the top
    expect(within(noteRows[0]).getByText('New note')).toBeInTheDocument();

    // Verify that the last pinned note is unpinned
    expect(within(noteRows[6]).getByText('Pinned note 6')).toBeInTheDocument();
  });
});
