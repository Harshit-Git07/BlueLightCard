# Form Component

Documentation on usage of the Form component

## Usage

Here is an example on how to use the Form component

```tsx
import Form from '@/components/Form/Form';

const schema = [
  {
    label: 'First name',
    controlId: 'firstNameFieldControl',
    required: true,
    message: 'Provide your first name',
    fieldComponent: InputTextField,
  },
  {
    label: 'Last name',
    controlId: 'lastNameFieldControl',
    required: true,
    message: 'Provide your last name',
    fieldComponent: InputTextField,
  },
  {
    label: 'Date of Birth',
    controlId: 'dobFieldControl',
    required: true,
    message: 'Provide your date of birth',
    fieldComponent: InputDOBField,
    validation: yup
      .date()
      .typeError('Date of birth must be in DD/MM/YYYY format')
      .transform((value, originalValue) => {
        if (dayjs(originalValue, 'DD/MM/YYYY').isValid()) {
          return dayjs(originalValue, 'DD/MM/YYYY').toDate();
        }
        return originalValue;
      })
      .max(new Date())
      .required('Date of birth is required'),
  },
  {
    label: 'Password',
    controlId: 'passwordFieldControl',
    required: true,
    password: true,
    passwordCriteria: [
      { validationType: 'min', message: '8 characters minimum' },
      { validationType: 'matches', message: 'One uppercase character' },
      { validationType: 'matches', message: 'One lowercase character' },
    ],
    validation: yup
      .string()
      .min(8, '8 characters minimum')
      .matches(/[a-z]/g, 'One lowercase character')
      .matches(/[A-Z]/g, 'One uppercase character')
      .required('Password is required'),
    fieldComponent: InputTextField,
    fieldComponentProps: {
      type: 'password',
    },
  },
  {
    label: 'Email',
    controlId: 'emailFieldControl',
    required: true,
    message: 'Provide a valid email address',
    validation: yup
      .string()
      .email('Please provide a valid email address')
      .required('Email address is required'),
    fieldComponent: InputTextField,
    fieldComponentProps: {
      type: 'email',
    } as InputTextFieldProps,
  }
];

<Form fields={schema} onSubmit={(formData) => {}} />
```