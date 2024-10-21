import React, { useState } from 'react';
import Table from '../Table/Table';
import { TableProps, TableHeader } from '../Table/types';
import { NoteData, NotesTableProps } from '../Notes/types';
import Button from '../Button/Button';
import { ThemeVariant } from '@/app/common/types/theme';
import SelectorInput from '../SelectorInput/SelectorInput';

export default function NotesTable({ notes, setNotes }: NotesTableProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState<NoteData | null>(null);

  const categoryOptions = [
    { optionName: 'User traits' },
    { optionName: 'Card actions' },
    { optionName: 'General behaviour info' },
  ];

  const headers: TableHeader[] = [
    {
      key: 'comment',
      name: 'Comment',
    },
    {
      key: 'category',
      name: 'Category',
    },
    {
      key: 'cardNumber',
      name: 'Associated Card Number',
    },
    {
      key: 'createdBy',
      name: 'Created by',
    },
    {
      key: 'createdDate',
      name: 'Created Date',
    },
    {
      key: 'source',
      name: 'Source',
    },
  ];

  const handleCheckToggle = (rowId: string) => {
    setNotes((prevNotes) => {
      const checkedCount = prevNotes.filter((note) => note.checked).length;
      return prevNotes.map((note) =>
        note.id === rowId
          ? {
              ...note,
              checked: !note.checked && checkedCount < 5 ? true : false,
            }
          : note
      );
    });
  };

  const handleDelete = (rowId: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== rowId));
  };

  const handleAction = (action: string, rowId: string) => {
    if (action === 'edit') {
      setEditingNoteId(rowId);
      setEditedNote(notes.find((note) => note.id === rowId) || null);
    } else if (action === 'delete') {
      handleDelete(rowId);
    }
  };

  const handleSave = () => {
    if (editedNote) {
      setNotes((prevNotes) => prevNotes.map((note) => (note.id === editedNote.id ? editedNote : note)));
      setEditingNoteId(null);
      setEditedNote(null);
    }
  };

  const handleCancel = () => {
    setEditingNoteId(null);
    setEditedNote(null);
  };

  const dropdownItems = [
    {
      label: 'Edit',
      action: 'edit',
    },
    {
      label: 'Delete',
      action: 'delete',
    },
  ];

  const renderCell = (header: TableHeader, row: NoteData) => {
    const isEditing = editingNoteId === row.id;
    const editableFields = ['comment', 'category', 'source'];

    if (isEditing) {
      if (header.key === 'category') {
        return (
          <SelectorInput
            options={categoryOptions}
            placeholder="Select a category"
            onChange={(selectedCategory) => {
              if (editedNote) {
                setEditedNote({
                  ...editedNote,
                  category: selectedCategory,
                });
              }
            }}
            label={''}
          />
        );
      } else if (editableFields.includes(header.key)) {
        return (
          <input
            type="text"
            value={(editedNote?.[header.key as keyof NoteData] as string) || ''}
            className="w-full px-2 py-1 text-base text-body-color dark:text-black bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
            onChange={(e) => {
              if (editedNote) {
                setEditedNote({
                  ...editedNote,
                  [header.key]: e.target.value,
                });
              }
            }}
          />
        );
      }
    }
    return (
      <div className="w-full px-2 py-1 text-base text-body-color dark:text-black border-b border-transparent">
        {row[header.key]}
      </div>
    );
  };

  const sortedNotes = [...notes].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  const tableProps: TableProps<NoteData> = {
    headers,
    data: sortedNotes,
    showCheckbox: true,
    highlightCheckedRows: false,
    showActions: true,
    onRowSelect: handleCheckToggle,
    onAction: handleAction,
    checkboxPosition: 6,
    checkboxHeader: {
      key: 'checkbox',
      name: 'Pinned',
    },
    dropdownItems,
    renderCell: renderCell,
  };

  return (
    <div>
      <Table<NoteData> {...tableProps} />
      {editingNoteId && (
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant={ThemeVariant.Primary} onClick={handleSave} id={'saveEditBtn'}>
            Save
          </Button>
          <Button variant={ThemeVariant.Secondary} onClick={handleCancel} id={'cancelEditBtn'}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
