import Form from '@/components/Form/Form';
import { FormOptions } from '@/components/Form/types';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FC, forwardRef } from 'react';

describe('Form component', () => {
  let props: FormOptions;
  let TextFieldComponent: FC<any>;
  beforeEach(() => {
    // eslint-disable-next-line react/display-name
    TextFieldComponent = () => <></>;
    props = {
      onSubmit() {},
      fields: [
        {
          label: 'firstName',
          controlId: 'name',
          // eslint-disable-next-line react/display-name
          fieldComponent: forwardRef<unknown, any>((props, ref) => (
            <TextFieldComponent {...props} _ref={ref} />
          )),
        },
      ],
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Form {...props} />);
    });
  });
});
