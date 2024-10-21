export type TextAreaProps = {
  label: string;
  disabled?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  width?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  validationType?: string;
  validationSuccessMessage?: string;
};
