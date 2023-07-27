export type InputRadioButtonsProps = {
  id: string;
  inputValues: InputValues[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type InputValues = {
  name: string;
  value: string;
  required?: boolean;
  selectedByDefault?: boolean;
};
