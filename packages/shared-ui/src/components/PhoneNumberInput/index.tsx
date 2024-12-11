import { FC, useId } from 'react';
import FieldLabel from '../FieldLabel';
import PhoneNumberInputElements from './PhoneNumberInputElements';

type Props = {
  id?: string;
  disabled?: boolean;
  showErrors?: boolean;
  label?: string;
  helpText?: string;
  messageText?: string;
  isSelectable?: boolean;
  onChange?: (phoneNumber: string) => void;
  value?: string;
};

const PhoneNumberInputDataManager: FC<Props> = ({
  id,
  disabled,
  showErrors = false,
  label = '',
  helpText = '',
  messageText,
  isSelectable = false,
  onChange,
  value = '',
}) => {
  const randomId = useId();
  const elementId = id ?? randomId;

  const wrapperClasses = 'w-full flex flex-col';

  return (
    <div className={wrapperClasses}>
      <FieldLabel
        htmlFor={elementId}
        label={disabled ? '' : label}
        tooltip={disabled ? '' : helpText}
      />
      <PhoneNumberInputElements
        id={elementId}
        value={value}
        disabled={disabled}
        showErrors={showErrors}
        messageText={messageText}
        isSelectable={isSelectable}
        onChange={onChange}
      />
    </div>
  );
};

export default PhoneNumberInputDataManager;
