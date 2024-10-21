import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddNoteForm from '../../Notes/AddNoteForm';

jest.mock(
  '../../TextArea/TextArea',
  () =>
    ({
      label,
      placeholder,
      onChange,
      value,
    }: {
      label: string;
      placeholder: string;
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
      value: string;
    }) =>
      <textarea data-testid="textarea" placeholder={placeholder} onChange={onChange} value={value} />
);
jest.mock(
  '../../Checkbox/Checkbox',
  () =>
    ({ label, onChange }: { label: string; onChange: (checked: boolean) => void }) =>
      (
        <div data-testid="checkbox" onClick={() => onChange(true)}>
          {label}
        </div>
      )
);

jest.mock(
  '../../SelectorInput/SelectorInput',
  () =>
    ({ label, onChange }: { label: string; onChange: (selectedCategory: string) => void }) =>
      (
        <div data-testid="selector-input" onClick={() => onChange('General behaviour info')}>
          {label}
        </div>
      )
);

jest.mock(
  '../../Button/Button',
  () =>
    ({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) =>
      (
        <button data-testid="button" onClick={onClick} disabled={disabled}>
          {children}
        </button>
      )
);

describe('AddNoteForm Component', () => {
  it('should render AddNoteForm component', () => {
    render(<AddNoteForm onAddNote={jest.fn()} />);
    expect(screen.getByTestId('textarea')).toBeTruthy();
    expect(screen.getByTestId('checkbox')).toBeTruthy();
    expect(screen.getByTestId('selector-input')).toBeTruthy();
    expect(screen.getByTestId('button')).toBeTruthy();
  });

  it('should call onAddNote with correct data when Save Note is clicked', () => {
    const mockOnAddNote = jest.fn();
    render(<AddNoteForm onAddNote={mockOnAddNote} />);

    fireEvent.change(screen.getByTestId('textarea'), { target: { value: 'Test Note' } });
    fireEvent.click(screen.getByTestId('selector-input'));
    fireEvent.click(screen.getByTestId('checkbox'));
    fireEvent.click(screen.getByTestId('button'));

    expect(mockOnAddNote).toHaveBeenCalledWith({
      comment: 'Test Note',
      category: 'General behaviour info',
      isPinned: true,
    });
  });

  it('should reset form fields after saving note', () => {
    render(<AddNoteForm onAddNote={jest.fn()} />);

    fireEvent.change(screen.getByTestId('textarea'), { target: { value: 'Test Note' } });
    fireEvent.click(screen.getByTestId('selector-input'));
    fireEvent.click(screen.getByTestId('checkbox'));
    fireEvent.click(screen.getByTestId('button'));

    console.log(screen.getByTestId('textarea'));
    expect(screen.getByTestId('textarea')).toHaveValue('');
    expect(screen.getByTestId('checkbox')).toHaveTextContent('Pin the note to the top');
  });

  it('should disable Save Note button when note or category is empty', () => {
    render(<AddNoteForm onAddNote={jest.fn()} />);

    expect(screen.getByTestId('button')).toBeDisabled();

    fireEvent.change(screen.getByTestId('textarea'), { target: { value: 'Test Note' } });
    expect(screen.getByTestId('button')).toBeDisabled();

    fireEvent.click(screen.getByTestId('selector-input'));
    expect(screen.getByTestId('button')).not.toBeDisabled();
  });
});
