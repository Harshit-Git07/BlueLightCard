import { KeyboardEvent } from 'react';

interface HookOptions {
  validationSchema: {
    [constraintKey: string]: any; // unable to locate generic yup schema type
  };
}

interface HookReturnType<CIE> {
  captureInput: CaptureInputSign<CIE>;
}

type CaptureInputSign<E> = (event: KeyboardEvent<E>, constraintKey: string) => void;

/**
 * Custom React hook
 *
 * Provides a keystroke constraint on input fields to make sure a user does not type beyond specified bounds
 *
 * For example: DOB day field, prevent user from attempting to type more than 31 days
 */
const useKeyConstraint: <E>(options: HookOptions) => HookReturnType<E> = ({
  validationSchema,
}: HookOptions) => {
  const captureInput: CaptureInputSign<any> = (event, constraintKey) => {
    const key = event.key;
    const currentInputValue = event.currentTarget.value;

    if (key.length > 1) {
      return;
    }

    const schema = validationSchema[constraintKey];
    const potentialValue = currentInputValue + key;

    if (!schema.isValidSync(potentialValue)) {
      event.preventDefault();
    }
  };

  return { captureInput };
};

export default useKeyConstraint;
