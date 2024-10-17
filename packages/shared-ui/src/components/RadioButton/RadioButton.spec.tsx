import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RadioButton from './index';
import { userEvent } from '@storybook/testing-library';

describe('RadioButton component', () => {
  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<RadioButton />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeTruthy();
      expect(radio).toBeEnabled();
      expect(radio).not.toBeChecked();
    });
  });

  describe('basic props', () => {
    it('should have the correct id and name', () => {
      render(
        <RadioButton id={'batman'} name={'dc-character'}>
          The Dark Knight
        </RadioButton>,
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('id', 'batman');
      expect(radio).toHaveAttribute('name', 'dc-character');
    });

    it('should have the correct label content', () => {
      render(
        <RadioButton id={'batman'} name={'dc-character'}>
          The Dark Knight
        </RadioButton>,
      );
      const label = screen.getByRole('radio').closest('label');
      expect(label).toHaveTextContent('The Dark Knight');
    });

    it('should show as disabled', () => {
      render(
        <RadioButton id={'robin'} name={'dc-character'} disabled>
          The Dark Knight
        </RadioButton>,
      );
      const radio = screen.getByRole('radio');
      expect(radio).toBeDisabled();
    });

    it('should show as selected', () => {
      render(
        <RadioButton id={'robin'} name={'dc-character'} checked>
          The Dark Knight
        </RadioButton>,
      );
      const radio = screen.getByRole('radio');
      expect(radio).toBeChecked();
    });

    it('should show as disabled and selected', () => {
      render(
        <RadioButton id={'robin'} name={'dc-character'} checked disabled>
          The Dark Knight
        </RadioButton>,
      );
      const radio = screen.getByRole('radio');
      expect(radio).toBeChecked();
      expect(radio).toBeDisabled();
    });
  });

  describe('variants', () => {
    it('should render withBorder', () => {
      render(
        <RadioButton id={'a'} name={'abc'} withBorder>
          Shows a border
        </RadioButton>,
      );
      const label = screen.getByRole('radio').closest('label');
      expect(label).toHaveClass('border');
      expect(label).toHaveClass('rounded');
      expect(label).toHaveClass('px-4');
      expect(label).toHaveClass('py-2');
      expect(label).toHaveClass('my-2');
    });
  });

  describe('interactions', () => {
    it('should call a callback when changed/clicked', async () => {
      const spy = jest.fn();
      render(
        <RadioButton id={'a'} name={'abc'} onChange={spy}>
          simple
        </RadioButton>,
      );
      const input = screen.getByRole('radio');
      await userEvent.click(input);
      expect(spy).toHaveBeenCalledWith(expect.any(Object), 'a');
    });
  });

  describe('child types', () => {
    it('should render with default typography classes when the child content is a string', () => {
      render(
        <RadioButton id={'a'} name={'abc'}>
          simple
        </RadioButton>,
      );

      const content = screen.getByTestId('label-content');
      expect(content).toHaveClass('font-typography-body');
      expect(content).toHaveClass('font-typography-body-weight');
      expect(content).toHaveClass('text-typography-body');
      expect(content).toHaveClass('leading-typography-body');
    });
  });
});
