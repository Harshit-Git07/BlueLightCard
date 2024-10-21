import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import NotesTable from '../../Notes/NoteTable';
import '@testing-library/jest-dom';

// Mock data
const mockNotes = [
  {
    id: '1',
    comment: 'Test comment 1',
    category: 'User traits',
    cardNumber: '1234',
    createdBy: 'John Doe',
    createdDate: '2023-09-01',
    source: 'Manual',
    checked: false,
  },
  {
    id: '2',
    comment: 'Test comment 2',
    category: 'Card actions',
    cardNumber: '5678',
    createdBy: 'Jane Smith',
    createdDate: '2023-09-02',
    source: 'Automated',
    checked: true,
  },
];

const mockSetNotes = jest.fn();

describe('NotesTable Component', () => {
  beforeEach(() => {
    render(<NotesTable notes={mockNotes} setNotes={mockSetNotes} />);
  });

  const getActionsButton = () => {
    const rows = screen.getAllByRole('row');
    const lastCell = within(rows[1]).getAllByRole('cell').slice(-1)[0];
    return within(lastCell).getByRole('button');
  };

  it('should render the NotesTable component', () => {
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should display the correct number of rows', () => {
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(mockNotes.length + 1);
  });

  it('should display the correct headers', () => {
    const headers = ['Comment', 'Category', 'Associated Card Number', 'Created by', 'Created Date', 'Source', 'Pinned'];
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('should allow toggling the checkbox', () => {
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it('should open dropdown when Actions button is clicked', () => {
    const actionsButton = getActionsButton();
    fireEvent.click(actionsButton);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('should display correct dropdown items', () => {
    const actionsButton = getActionsButton();
    fireEvent.click(actionsButton);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should open edit mode when clicking the edit action', () => {
    const actionsButton = getActionsButton();
    fireEvent.click(actionsButton);
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should allow editing note fields', () => {
    const actionsButton = getActionsButton();
    fireEvent.click(actionsButton);
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const commentInput = screen.getByText('Test comment 1');

    fireEvent.input(commentInput, { target: { textContent: 'Updated comment' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockSetNotes).toHaveBeenCalled();
  });

  it('should cancel editing when clicking the cancel button', () => {
    const actionsButton = getActionsButton();
    fireEvent.click(actionsButton);
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('should delete a note when clicking the delete action', () => {
    const actionsButton = getActionsButton();
    fireEvent.click(actionsButton);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it('should sort notes by created date in descending order', () => {
    const rows = screen.getAllByRole('row');
    const firstRowDate = within(rows[1]).getByText('2023-09-02');
    const secondRowDate = within(rows[2]).getByText('2023-09-01');
    expect(firstRowDate).toBeInTheDocument();
    expect(secondRowDate).toBeInTheDocument();
  });

  it('should limit the number of pinned notes to 5', () => {
    const manyNotes = [
      ...mockNotes,
      ...Array(4).fill({
        ...mockNotes[0],
        id: '3',
        checked: true,
      }),
    ];
    render(<NotesTable notes={manyNotes} setNotes={mockSetNotes} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(mockSetNotes).toHaveBeenCalled();
    expect(mockSetNotes.mock.calls[0][0](manyNotes)[0].checked).toBe(false);
  });
});
