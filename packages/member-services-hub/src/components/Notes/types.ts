import { TableData } from '@/components/Table/types';
import React from 'react';

export interface NotesTableProps {
  notes: NoteData[];
  setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>;
}

export interface NoteData extends TableData {
  id: string;
  comment: string;
  category: string;
  cardNumber: string;
  createdBy: string;
  createdDate: string;
  source: string;
  checked: boolean;
}

export interface AddNoteFormProps {
  onAddNote: (note: { comment: string; category: string; isPinned: boolean }) => void;
}
