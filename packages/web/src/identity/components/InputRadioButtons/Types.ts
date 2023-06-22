export type InputRadioButtonsProps = {
  inputValues: InputValues[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type InputValues = {
  name: string;
  value: string;
  required?: boolean;
  selectedByDefault?: boolean;
};
