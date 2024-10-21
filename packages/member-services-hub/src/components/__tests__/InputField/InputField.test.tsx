import InputField from '../../InputField/InputField';
import { InputFieldProps } from '../../InputField/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { faUser } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VALIDATION_ENUM } from '@/app/_zodSchemas/validationEnum';

describe('Input field component', () => {
  let props: InputFieldProps;

  beforeEach(() => {
    props = {
      label: 'Input field - validation',
      placeholder: 'placeholder text',
      disabled: false,
      width: '250px',
      icon: <FontAwesomeIcon icon={faUser} />,
      validationType: VALIDATION_ENUM.PASSWORD,
      validationSuccessMessage: 'Password Valid',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<InputField {...props} />);
      const label = screen.getByTestId('input-label');

      expect(label).toBeTruthy();
    });
  });
});
