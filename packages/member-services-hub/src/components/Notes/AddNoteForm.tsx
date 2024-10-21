import React, { useState } from 'react';
import Checkbox from '../Checkbox/Checkbox';
import SelectorInput from '../SelectorInput/SelectorInput';
import TextArea from '../TextArea/TextArea';
import Button from '../Button/Button';
import { ThemeVariant } from '@/app/common/types/theme';
import { AddNoteFormProps } from './types';

const AddNoteForm: React.FC<AddNoteFormProps> = ({ onAddNote }) => {
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const categoryOptions = [
    { optionName: 'User traits' },
    { optionName: 'Card actions' },
    { optionName: 'General behaviour info' },
  ];

  const handleSaveNote = () => {
    if (note && category) {
      onAddNote({
        comment: note,
        category,
        isPinned,
      });
      setNote('');
      setCategory('');
      setIsPinned(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <TextArea
          label="Note"
          placeholder="Write your note here..."
          width="100%"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
          value={note}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2 pr-2">
          <SelectorInput
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
            width="100%"
            onChange={(selectedCategory) => setCategory(selectedCategory)}
          />
        </div>

        <div className="w-1/2 pl-2">
          <Checkbox
            label="Pin the note to the top"
            style="checkbox"
            prechecked={isPinned}
            onChange={(checked) => setIsPinned(checked)}
          />
          <p className="text-sm text-gray-500 mt-1">The note section only supports a max of 5 pinned notes</p>
        </div>
      </div>

      <Button variant={ThemeVariant.Primary} onClick={handleSaveNote} disabled={!note || !category} id={'saveBtn'}>
        Save Note
      </Button>
    </div>
  );
};

export default AddNoteForm;
