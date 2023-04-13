import PillButtons from '@/components/PillButtons/PillButtons';
import { PillButtonProps } from '@/components/PillButtons/types';
import { render } from '@testing-library/react';

describe('PillButtons component', () => {
  let props: PillButtonProps;

  beforeEach(() => {
    props = { pills: [] };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<PillButtons {...props} />);
    });
  });
});
