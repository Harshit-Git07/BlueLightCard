import FieldGroup from "@/components/FieldGroup/FieldGroup";
import { FieldGroupProps } from "@/components/FieldGroup/types";
import { render } from '@testing-library/react';

describe('FieldGroup component', () => {
  let props: FieldGroupProps;

  beforeEach(() => {
    props = {
      labelText: 'Field Group',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
        render(<FieldGroup {...props} />);
    });
  });
});
