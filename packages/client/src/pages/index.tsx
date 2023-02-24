import { NextPage } from 'next';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import CreateAccountLayout from '@/layouts/CreateAccountLayout/CreateAccountLayout';
import InputTextField from '@/components/InputTextField/InputTextField';
import { InputTextFieldProps } from '@/components/InputTextField/types';
import Form from '@/components/Form/Form';

export const getStaticProps = getI18nStaticProps;

const fields: any = [
  [
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
  ],
  {
    label: 'Email',
    controlId: 'emailFieldControl',
    required: true,
    message: 'Provide a valid email address',
    validation: yup
      .string()
      .email('Email address is a required field')
      .required('Email address is required'),
    fieldComponent: InputTextField,
    fieldComponentProps: {
      type: 'email',
    } as InputTextFieldProps,
  },
];

const Home: NextPage<any> = () => {
  const { t } = useTranslation('common');
  return (
    <main>
      <h1>{t('heading')}</h1>
      <Button variant="primary">Primary Button</Button>
      <CreateAccountLayout>
        <Form fields={fields} onSubmit={() => console.info('Submitted')} />
      </CreateAccountLayout>
    </main>
  );
};

export default Home;
