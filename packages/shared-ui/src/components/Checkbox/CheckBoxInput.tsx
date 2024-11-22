import { ChangeEvent, FC } from 'react';
import { conditionalStrings } from '../../utils/conditionalStrings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';

export type CheckBoxInputProps = {
  id?: string;
  name?: string;
  value?: string;
  isDisabled?: boolean;
  isChecked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const CheckBoxInput: FC<CheckBoxInputProps> = ({
  id,
  name,
  value,
  isDisabled = false,
  isChecked = false,
  onChange,
}) => {
  const inputCss = conditionalStrings({
    'absolute appearance-none h-4 w-4 min-w-4 min-h-4 rounded': true,
    'border border-colour-onSurface dark:border-colour-onSurface-dark': !isDisabled && !isChecked,
    'border border-colour-onSurface-disabled dark:border-colour-onSurface-disabled-dark':
      isDisabled && !isChecked,
    'bg-colour-primary-disabled dark:bg-colour-primary-disabled-dark': isDisabled && isChecked,
    'bg-colour-primary dark:bg-colour-primary-dark': !isDisabled && isChecked,
  });

  return (
    <span className={'inline-flex relative h-4 w-4 items-center justify-center'}>
      <input
        id={id}
        name={name}
        value={value}
        type="checkbox"
        checked={isChecked}
        disabled={isDisabled}
        onChange={onChange}
        className={inputCss}
      />
      {isChecked ? (
        <div className="relative z-10 text-colour-onPrimary dark:text-colour-onPrimary-dark pointer-events-none">
          <FontAwesomeIcon size={'sm'} icon={faCheck} />
        </div>
      ) : null}
    </span>
  );
};

export default CheckBoxInput;
