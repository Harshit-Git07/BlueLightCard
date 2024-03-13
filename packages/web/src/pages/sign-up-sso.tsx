import { NextPage } from 'next';
import Navigation from '@/components/NavigationLegacy/Navigation';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';
import requireAuth from '@/hoc/requireAuth';
import Footer from '../identity/components/Footer/Footer';
import Form from '@/components/Form/Form';
import InputTextField from '@/components/InputTextField/InputTextField';
import Heading from '@/components/Heading/Heading';
import React from 'react';
import * as yup from 'yup';
import { InputTextFieldProps } from '@/components/InputTextField/types';
import dayjs from 'dayjs';
import { FormField } from '@/components/Form/types';
import InputCheckboxField from '@/components/InputCheckboxField/InputCheckboxField';
import { InputCheckboxFieldProps } from '@/components/InputCheckboxField/types';
import InputDOBField from '@/components/InputDOBField/InputDOBField';

const SsoSignUpPage: NextPage = () => {
  const onSubmit = () => {
    // TODO: implement submit logic
  };

  const schema: FormField[] = [
    {
      label: 'First name',
      controlId: 'firstNameFieldControl',
      required: true,
      validation: yup.string().required('Please enter your first name'),
      fieldComponent: InputTextField,
    },
    {
      label: 'Last name',
      controlId: 'lastNameFieldControl',
      required: true,
      validation: yup.string().required('Please enter your last name'),
      fieldComponent: InputTextField,
    },
    {
      label: 'Email',
      controlId: 'emailFieldControl',
      required: true,
      validation: yup
        .string()
        .email('Please provide a valid email address')
        .required('Email address is required'),
      fieldComponent: InputTextField,
      fieldComponentProps: {
        type: 'email',
      } as InputTextFieldProps,
    },
    {
      label: 'Password',
      controlId: 'passwordFieldControl',
      required: true,
      password: true,
      passwordCriteria: [
        { validationType: 'matches', message: 'One uppercase character' },
        { validationType: 'matches', message: 'One lowercase character' },
        {
          validationType: 'matches',
          message: 'One special character from ~ # @ $ % & ! * _ ? ^ -',
        },
        { validationType: 'matches', message: 'One number' },
        { validationType: 'min', message: 'Ten characters minimum' },
        { validationType: 'matches', message: 'No more than two repeated characters in a row' },
      ],
      validation: yup
        .string()
        .required('Password is required')
        .min(10, 'Ten characters minimum')
        .matches(/[A-Z]/g, 'One uppercase character')
        .matches(/[a-z]/g, 'One lowercase character')
        .matches(/[~#@$%&!*_?^-]/, 'One special character from ~ # @ $ % & ! * _ ? ^ -')
        .matches(/[0-9]/, 'One number')
        .matches(/^(?!.*(.)\1\1)/, 'No more than two repeated characters in a row'),
      fieldComponent: InputTextField,
      fieldComponentProps: {
        type: 'password',
      } as InputTextFieldProps,
    },
    {
      label: 'Postal address',
      controlId: 'postalAddressFieldControl',
      required: true,
      validation: yup.string().required('Please your put in your address'),
      fieldComponent: InputTextField,
    },
    {
      label: 'Date of Birth',
      controlId: 'dobFieldControl',
      required: true,
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
      label: 'Phone number',
      controlId: 'phoneNumberFieldControl',
      required: true,
      validation: yup
        .number()
        .typeError('Please enter only numbers')
        .required('Please enter your phone number'),
      fieldComponent: InputTextField,
    },
    {
      label: '',
      controlId: 't&cFieldControl',
      required: true,
      fieldComponent: InputCheckboxField,
      fieldComponentProps: {
        label: (
          <>
            I agree to the <a href="/terms_and_conditions.php">Terms and Conditions</a>
          </>
        ),
      } as InputCheckboxFieldProps,
    },
    {
      label: '',
      controlId: 'emailNewslettersFieldControl',
      fieldComponent: InputCheckboxField,
      fieldComponentProps: {
        label: 'Email newsletters',
      } as InputCheckboxFieldProps,
    },
    {
      label: '',
      controlId: 'smsMarketingFieldControl',
      fieldComponent: InputCheckboxField,
      fieldComponentProps: {
        label: 'SMS marketing',
      } as InputCheckboxFieldProps,
    },
  ];

  return (
    <>
      <main>
        <div className="flex mx-auto max-w-2xl sm:max-w-full">
          <div className="w-full px-5 py-16 flex flex-col gap-4">
            <Heading headingLevel={'h1'} className="text-center">
              Create Account
            </Heading>
            <Form fields={schema} onSubmit={onSubmit} />
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps = getI18nStaticProps;

const layoutProps = {
  seo: {
    title: 'identity.seo.title',
    description: 'identity.seo.description',
  },
  translationNamespace: 'blc.common',
  headerOverride: <Navigation navItems={[]} showFlag={false} />,
  footerOverride: (
    <Footer
      navItems={[
        { text: 'Terms & Conditions', link: '/terms_and_conditions.php' },
        { text: 'Privacy Policy', link: '/privacy-notice.php' },
        { text: 'Cookie Policy', link: '/cookies_policy.php' },
        { text: "FAQ's", link: '/contactblc.php' },
      ]}
      mobileBreakpoint={768}
    />
  ),
};

export default withAuthProviderLayout(requireAuth(SsoSignUpPage), layoutProps);
