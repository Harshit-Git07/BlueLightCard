import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as yup from 'yup';
import '@testing-library/jest-dom';
import { FC, forwardRef } from 'react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { FormField, FormProps } from '@/components/Form/types';
import Form from '@/components/Form/Form';

describe('Form component', () => {
  let props: FormProps;
  let user: UserEvent;
  let fieldsSchemaMock: Array<FormField | FormField[]>;

  const TextFieldComponent: FC = ({ id, required, value, _ref, onChange }: any) => (
    <input
      id={id}
      required={required}
      type="text"
      defaultValue={value}
      ref={_ref}
      onChange={onChange}
    />
  );

  const SelectFieldComponent: FC = ({ id, required, value, _ref, onChange }: any) => (
    <select id={id} required={required} ref={_ref} defaultValue={value} onChange={onChange}>
      <option value="">Please select a value</option>
      <option value="option-1">Option 1</option>
      <option value="option-2">Option 2</option>
    </select>
  );

  beforeEach(() => {
    fieldsSchemaMock = [];
    props = {
      onSubmit() {},
      fields: fieldsSchemaMock,
    };
    user = userEvent.setup();
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Form {...props} />);
    });
  });

  describe('form rendering', () => {
    it('should render form with text fields along with labels', () => {
      props.fields = [
        {
          label: 'Name',
          controlId: 'nameFieldControl',
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => <TextFieldComponent {...props} _ref={ref} />),
          fieldComponentProps: {
            id: 'nameFieldControl',
          },
        },
        {
          label: 'Address',
          controlId: 'addressFieldControl',
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => <TextFieldComponent {...props} _ref={ref} />),
          fieldComponentProps: {
            id: 'addressFieldControl',
          },
        },
        {
          label: 'Select',
          controlId: 'selectFieldControl',
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => (
            <SelectFieldComponent {...props} _ref={ref} />
          )),
          fieldComponentProps: {
            id: 'selectFieldControl',
          },
        },
      ];
      render(<Form {...props} />);

      const nameField = screen.getByLabelText('Name');
      const addressField = screen.getByLabelText('Address');
      const selectField = screen.getByLabelText('Select');
      const submitButton = screen.getByRole('button', { name: /Submit/i });

      expect(nameField).toBeTruthy();
      expect(addressField).toBeTruthy();
      expect(selectField).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });
  });

  describe('form submit', () => {
    it('should submit valid form and invoke submit handler', async () => {
      const onSubmitHandlerMock = jest.fn();
      props.onSubmit = onSubmitHandlerMock;
      props.fields = [
        {
          label: 'Name',
          controlId: 'nameFieldControl',
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => <TextFieldComponent {...props} _ref={ref} />),
          fieldComponentProps: {
            id: 'nameFieldControl',
          },
        },
        {
          label: 'Address',
          controlId: 'addressFieldControl',
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => <TextFieldComponent {...props} _ref={ref} />),
          fieldComponentProps: {
            id: 'addressFieldControl',
          },
        },
      ];
      render(<Form {...props} />);

      await user.click(screen.getByRole('button', { name: /Submit/i }));

      expect(onSubmitHandlerMock).toHaveBeenCalled();
    });

    it('should NOT successfully submit form when invalid', async () => {
      const onSubmitHandlerMock = jest.fn();
      props.onSubmit = onSubmitHandlerMock;
      props.fields = [
        {
          label: 'Name',
          controlId: 'nameFieldControl',
          required: true,
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => <TextFieldComponent {...props} _ref={ref} />),
          fieldComponentProps: {
            id: 'nameFieldControl',
          },
        },
        {
          label: 'Address',
          controlId: 'addressFieldControl',
          required: true,
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => <TextFieldComponent {...props} _ref={ref} />),
          fieldComponentProps: {
            id: 'addressFieldControl',
          },
        },
      ];
      render(<Form {...props} />);

      await user.click(screen.getByRole('button', { name: /Submit/i }));

      expect(onSubmitHandlerMock).not.toHaveBeenCalled();
    });

    it('should successfully submit form when valid with form data', async () => {
      const onSubmitHandlerMock = jest.fn();
      props.onSubmit = onSubmitHandlerMock;
      props.fields = [
        {
          label: 'Name',
          controlId: 'nameFieldControl',
          required: true,
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => <TextFieldComponent {...props} _ref={ref} />),
          fieldComponentProps: {
            id: 'nameFieldControl',
            value: 'Hello',
          },
        },
        {
          label: 'Address',
          controlId: 'addressFieldControl',
          required: true,
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => <TextFieldComponent {...props} _ref={ref} />),
          fieldComponentProps: {
            id: 'addressFieldControl',
            value: 'Address 123',
          },
        },
        {
          label: 'Select',
          controlId: 'selectFieldControl',
          required: true,
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => (
            <SelectFieldComponent {...props} _ref={ref} />
          )),
          fieldComponentProps: {
            id: 'selectFieldControl',
            value: 'option-2',
          },
        },
      ];
      render(<Form {...props} />);

      await user.click(screen.getByRole('button', { name: /Submit/i }));

      expect(onSubmitHandlerMock.mock.calls[0][0]).toStrictEqual({
        nameFieldControl: 'Hello',
        addressFieldControl: 'Address 123',
        selectFieldControl: 'option-2',
      });
    });
  });

  describe('form validation', () => {
    it('should fail validation based on validation rules', async () => {
      const onSubmitHandlerMock = jest.fn();
      props.onSubmit = onSubmitHandlerMock;
      props.fields = [
        {
          label: 'Name',
          controlId: 'nameFieldControl',
          required: true,
          validation: yup.string().max(5, 'Name field value too long').required(),
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => <TextFieldComponent {...props} _ref={ref} />),
          fieldComponentProps: {
            id: 'nameFieldControl',
          },
        },
        {
          label: 'Address',
          controlId: 'addressFieldControl',
          required: true,
          validation: yup.string().min(5, 'Address field value too short').required(),
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef((props, ref) => <TextFieldComponent {...props} _ref={ref} />),
          fieldComponentProps: {
            id: 'addressFieldControl',
          },
        },
      ];
      render(<Form {...props} />);

      await user.type(screen.getByRole('textbox', { name: /Name/i }), 'Helloooo');
      await user.type(screen.getByRole('textbox', { name: /Address/i }), 'Addr');
      await user.click(screen.getByRole('button', { name: /Submit/i }));

      expect(onSubmitHandlerMock).not.toHaveBeenCalled();
      expect(screen.getAllByRole('alert')).toHaveLength(2);
      expect(screen.getByText('Name field value too long')).toBeTruthy();
      expect(screen.getByText('Address field value too short')).toBeTruthy();
    });
  });
});
