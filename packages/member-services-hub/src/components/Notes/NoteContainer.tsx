'use client';
import React, { useState, useEffect } from 'react';
import AddNoteForm from './AddNoteForm';
import NotesTable from './NoteTable';
import { NoteData } from './types';

interface NotesContainerProps {
  initialNotes?: NoteData[];
}

export default function NotesContainer({ initialNotes = [] }: NotesContainerProps) {
  const [notes, setNotes] = useState<NoteData[]>(initialNotes);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return date.toLocaleString('en-UK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  const handleAddNote = (newNote: { comment: string; category: string; isPinned: boolean }) => {
    const currentDate = new Date().toISOString();
    const newNoteData: NoteData = {
      id: (notes.length + 1).toString(),
      comment: newNote.comment,
      category: newNote.category,
      cardNumber: Math.floor(1000 + Math.random() * 9000).toString(),
      createdBy: 'Admin User 1',
      createdDate: formatDate(currentDate),
      source: 'hub',
      checked: newNote.isPinned,
    };

    setNotes((prevNotes) => {
      let updatedNotes = [newNoteData, ...prevNotes];
      if (newNote.isPinned) {
        const pinnedNotes = updatedNotes.filter((note) => note.checked);
        if (pinnedNotes.length > 5) {
          updatedNotes = updatedNotes.map((note, index) =>
            note.checked && index === updatedNotes.lastIndexOf(pinnedNotes[5])
              ? {
                  ...note,
                  checked: false,
                }
              : note
          );
        }
      }

      return updatedNotes;
    });
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <NotesTable notes={notes} setNotes={setNotes} />
      <AddNoteForm onAddNote={handleAddNote} />
    </div>
  );
}
