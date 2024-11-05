import { ColourVariant } from '@/app/common/types/theme';
import { render, screen } from '@testing-library/react';
import { BadgeProps } from '@/components/Badge/types';
import Badge from '@/components/Badge/Badge';

describe('Badge component', () => {
  let props: BadgeProps;

  beforeEach(() => {
    props = {
      text: 'Danger',
      type: ColourVariant.Danger,
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Badge {...props} data-testid="danger-badge" />);

      const badge = screen.getByTestId('danger-badge');

      expect(badge).toBeTruthy();
    });
  });
});
