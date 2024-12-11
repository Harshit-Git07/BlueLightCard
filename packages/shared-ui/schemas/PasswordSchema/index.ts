import { z } from 'zod';

type PasswordRule = {
  type: 'regex' | 'min';
  value: RegExp | number;
  label: string;
};

export const passwordRules: PasswordRule[] = [
  { label: 'One uppercase character', type: 'regex', value: /[A-Z]/ },
  { label: 'One lowercase character', type: 'regex', value: /[a-z]/ },
  {
    label: 'One special character from ~ # @ $ % & ! * _ ? ^ -',
    type: 'regex',
    // Disallows non-specified special characters.
    value: /^(?=.*[~#@$%&!*_?^-])[A-Za-z0-9~#@$%&!*_?^-]+$/,
  },
  { label: 'One number', type: 'regex', value: /\d/ },
  { label: 'Ten characters minimum', type: 'min', value: 10 },
  {
    label: 'No more than two repeated characters in a row',
    type: 'regex',
    value: /^(?!.*?(.)\1\1).+$/,
  },
];

const buildPasswordSchema = (passwordRules: PasswordRule[]) => {
  let schema = z.string();

  passwordRules.forEach((rule) => {
    if (rule.type === 'regex') {
      schema = schema.regex(rule.value as RegExp, rule.label);
    } else if (rule.type === 'min') {
      schema = schema.min(rule.value as number, rule.label);
    }
  });

  return schema;
};

export const passwordSchema = buildPasswordSchema(passwordRules);
