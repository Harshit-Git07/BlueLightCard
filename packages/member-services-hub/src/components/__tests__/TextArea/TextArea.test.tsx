import TextArea from '../../TextArea/TextArea';
import { TextAreaProps } from '../../TextArea/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/pro-regular-svg-icons';
import { VALIDATION_ENUM } from '@/app/validation/schemas';

describe('Text area component', () => {
  let props: TextAreaProps;

  beforeEach(() => {
    props = {
      label: 'Text area label',
      placeholder: 'placeholder text',
      disabled: false,
      width: '250px',
      icon: <FontAwesomeIcon icon={faUser} />,
      value: '',
      onChange: () => jest.fn(),
      validationType: VALIDATION_ENUM.MINIMUM_OF_3,
      validationSuccessMessage: 'Input Valid',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<TextArea {...props} />);
      const label = screen.getByTestId('text-area-label');

      expect(label).toBeTruthy();
    });
  });
});
