import ListPanel from '@/components/ListPanel/ListPanel';
import { ListPanelProps } from '@/components/ListPanel/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('ListPanel component', () => {
  let props: ListPanelProps;

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      visible: true,
    };
  });

  describe('Smoke test', () => {
    it('should render component without error', () => {
      render(<ListPanel {...props} />);
    });
  });

  describe('Component callbacks', () => {
    it('should invoke onClick when user clicks ListPanel "Close" button', async () => {
      render(<ListPanel {...props} />);

      const ListPanelButton = screen.getByRole('button');

      await userEvent.click(ListPanelButton);

      expect(props.onClose).toHaveBeenCalled();
    });
  });
});
