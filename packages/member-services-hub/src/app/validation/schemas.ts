import { z } from 'zod';

export const VALIDATION_ENUM = {
  MINIMUM_OF_3: 'min3',
  PASSWORD: 'password',
};

export default function getSchema(schemaType: string) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-])[a-zA-Z0-9\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-]{8,98}$/;

  const zodDefaultSchema = z.string();
  const zodMin3Schema = z.string().min(3, { message: 'Must contain at least 3 characters' });
  const zodPasswordSchema = z.string().regex(passwordRegex, {
    message: 'Must contain a lower, upper, number, valid symbol, and at least 8 characters',
  });

  switch (schemaType) {
    case VALIDATION_ENUM.MINIMUM_OF_3:
      return zodMin3Schema;
    case VALIDATION_ENUM.PASSWORD:
      return zodPasswordSchema;
    default:
      return zodDefaultSchema;
  }
}
