import { FC } from 'react';
import { conditionalStrings } from '../../utils/conditionalStrings';
import { colours, fonts } from '../../tailwind/theme';

export type Props = {
  id?: string;
  message?: string;
  htmlFor: string;
  isValid: boolean | undefined;
  isDisabled: boolean;
};

const ValidationMessage: FC<Props> = ({ id, message, htmlFor, isValid, isDisabled }) => {
  const hasBeenValidated = isValid !== undefined;
  const success = !isDisabled && hasBeenValidated && isValid;
  const error = !isDisabled && hasBeenValidated && !isValid;

  const classes = conditionalStrings({
    [`${fonts.bodySmall} mt-2`]: true,
    [`${colours.textOnSurfaceSubtle} focus:text-colour-primary focus:dark:text-colour-primary-dark`]:
      !hasBeenValidated || isDisabled,
    [`${colours.textSuccess}`]: success,
    [`${colours.textError}`]: error,
  });

  return message ? (
    <div className={classes} aria-hidden={isDisabled}>
      <label htmlFor={htmlFor} id={id} role="alert" aria-live="assertive">
        {message}
      </label>
    </div>
  ) : null;
};

export default ValidationMessage;
