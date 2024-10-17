import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RadioButtonGroup from './index';
import { userEvent } from '@storybook/testing-library';

const testItems = () => [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banana' },
  { id: 'c', label: 'Cherry' },
];

describe('RadioButtonGroup component', () => {
  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<RadioButtonGroup name={'testgroup'} items={testItems()} />);
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });
  });

  describe('Rendering of items', () => {
    it('should render all simple item properties', () => {
      render(<RadioButtonGroup name={'testgroup'} items={testItems()} />);
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
      expect(radios[0]).toHaveAttribute('id', 'a');
      expect(radios[0]).toHaveAttribute('name', 'testgroup');
      expect(radios[0]).toBeEnabled();
      expect(radios[0]).not.toBeChecked();

      expect(radios[1]).toHaveAttribute('id', 'b');
      expect(radios[1]).toHaveAttribute('name', 'testgroup');
      expect(radios[1]).toBeEnabled();
      expect(radios[1]).not.toBeChecked();

      expect(radios[2]).toHaveAttribute('id', 'c');
      expect(radios[2]).toHaveAttribute('name', 'testgroup');
      expect(radios[2]).toBeEnabled();
      expect(radios[2]).not.toBeChecked();
    });

    it('should render item labels', () => {
      render(<RadioButtonGroup name={'testgroup'} items={testItems()} />);
      const radios = screen.getAllByRole('radio');
      expect(radios[0].closest('label')).toHaveTextContent('Apple');
      expect(radios[1].closest('label')).toHaveTextContent('Banana');
      expect(radios[2].closest('label')).toHaveTextContent('Cherry');
    });

    it('should render items with borders', () => {
      render(<RadioButtonGroup name={'testgroup'} items={testItems()} withBorder />);
      const radios = screen.getAllByRole('radio');
      expect(radios[0].closest('label')).toHaveClass('border');
      expect(radios[1].closest('label')).toHaveClass('border');
      expect(radios[2].closest('label')).toHaveClass('border');
    });

    it('should preselect a radio item', () => {
      render(<RadioButtonGroup name={'testgroup'} items={testItems()} value={'b'} />);
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
      expect(radios[2]).not.toBeChecked();
    });
  });

  describe('Interactions', () => {
    it('should call the supplied callback', async () => {
      const spy = jest.fn();
      render(<RadioButtonGroup name={'testgroup'} items={testItems()} onChange={spy} />);
      const b = screen.getByLabelText('Banana');
      await userEvent.click(b);
      expect(spy).toHaveBeenCalledWith(expect.any(Object), 'b');
    });
  });
});
