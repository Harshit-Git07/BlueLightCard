import { ChangeEvent, FC, useId, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { useCSSConditional } from 'src/hooks/useCSS';

export type Props = {
  name?: string;
  value?: string;
  variant?: 'Default' | 'withBorder';
  isDisabled: boolean;
  checkboxText: string;
  isChecked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox: FC<Props> = ({
  name,
  value,
  variant = 'Default',
  isDisabled,
  checkboxText,
  isChecked = false,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const hasBorder = variant === 'withBorder';

  const borderCss = useCSSConditional({
    'px-4 py-2 rounded border border-1': hasBorder,
  });

  const variantCss = useCSSConditional({
    'border-colour-onSurface-disabled dark:border-colour-onSurface-disabled-dark':
      hasBorder && isDisabled && !isChecked,
    'border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark':
      hasBorder && !isDisabled && !isChecked,
    'border-colour-primary-disabled dark:border-colour-primary-disabled-dark':
      hasBorder && isDisabled && isChecked,
    'border-colour-primary dark:border-colour-primary-dark': hasBorder && !isDisabled && isChecked,
  });

  const labelCss = useCSSConditional({
    'text-colour-primary dark:text-colour-primary-dark': !isDisabled && isChecked,
    'text-colour-onSurface dark:text-colour-onSurface-dark': !isDisabled,
    'text-colour-primary-disabled dark:text-colour-primary-disabled-dark': isDisabled && isChecked,
    'text-colour-onSurface-disabled dark:text-colour-onSurface-disabled-dark': isDisabled,
  });

  const inputCss = useCSSConditional({
    'mt-1 ml-[-2px] appearance-none min-w-4 min-h-4 rounded without-ring': true,
    'border border-colour-onSurface dark:border-colour-onSurface-dark': !isDisabled && !isChecked,
    'border border-colour-onSurface-disabled dark:border-colour-onSurface-disabled-dark':
      isDisabled && !isChecked,
    'bg-colour-primary-disabled dark:bg-colour-primary-disabled-dark': isDisabled && isChecked,
    'bg-colour-primary dark:bg-colour-primary-dark': !isDisabled && isChecked,
  });

  const id = useId();

  return (
    <div
      className={`
        flex items-start relative
          ${borderCss}
          ${variantCss}
      `}
      aria-describedby={id}
    >
      <input
        ref={inputRef}
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
        <div className="absolute text-colour-onPrimary dark:text-colour-onPrimary-dark pointer-events-none">
          <FontAwesomeIcon size="sm" icon={faCheck} />
        </div>
      ) : null}

      <label
        htmlFor={id}
        className={`
            ${labelCss}
            ms-2 font-typography-body font-typography-body-weight text-typography-body leading-typography-body
        `}
      >
        {checkboxText}
      </label>
    </div>
  );
};

export default Checkbox;
