import CantEditButton from '@/components/CantEditButton/CantEditButton';
import { CantEditButtonProps } from '@/components/CantEditButton/types';
import { faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { render, screen } from '@testing-library/react';

describe('CantEditButton component', () => {
  let props: CantEditButtonProps;

  beforeEach(() => {
    props = {
      icon: faChevronUp,
      onClick: jest.fn(),
      open: true,
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<CantEditButton {...props} />);

      const button = screen.getByRole('button');

      expect(button).toBeTruthy();
    });
  });

  describe('behaviour test', () => {
    it('should call onClick when button is clicked', () => {
      render(<CantEditButton {...props} />);

      const button = screen.getByRole('button');

      button.click();

      expect(props.onClick).toHaveBeenCalled();
    });
  });
});
