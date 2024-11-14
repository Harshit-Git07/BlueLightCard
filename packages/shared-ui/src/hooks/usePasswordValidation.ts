import { useMemo } from 'react';
import { passwordRules, passwordSchema } from '../schemas/PasswordSchema';

export function usePasswordValidation() {
  const validationRequirements = useMemo(
    () =>
      passwordRules.reduce(
        (acc, rule) => {
          acc[rule.label] = undefined;
          return acc;
        },
        {} as Record<string, boolean | undefined>,
      ),
    [passwordRules],
  );

  const getValidatedPasswordRequirements = (input: string): Record<string, boolean | undefined> => {
    const validation = passwordSchema.safeParse(input);

    let errors: string[] = [];
    if (!validation.success) {
      errors = validation.error.errors.map((error) => error.message);
    }

    let validatedRequirements = validationRequirements;
    Object.entries(validatedRequirements).forEach(([passwordRequirement]) => {
      const isValid = !errors.includes(passwordRequirement);
      validatedRequirements = { ...validatedRequirements, [passwordRequirement]: isValid };
    });

    return validatedRequirements;
  };

  const validatePassword = (input: string): boolean => {
    const validation = passwordSchema.safeParse(input);
    return validation.success;
  };

  return { getValidatedPasswordRequirements, validatePassword };
}
