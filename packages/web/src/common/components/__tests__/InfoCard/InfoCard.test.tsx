import InfoCard from '@/components/InfoCard/InfoCard';
import { InfoCardProps } from '@/components/InfoCard/types';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import userEvent from '@testing-library/user-event';

jest.mock(
  '@/components/Image/Image',
  () =>
    function Image() {
      return <div></div>;
    }
);

describe('InfoCard Component', () => {
  let props: InfoCardProps;
  let user: UserEvent;

  beforeEach(() => {
    props = { id: 'test', title: 'Card Title', text: 'This is the card text', ariaLabel: 'test' };
    user = userEvent.setup();
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<InfoCard {...props} />);
    });
  });

  describe('rendering', () => {
    it('should render title and text', () => {
      props.title = 'Title';
      props.text = 'This is text';
      render(<InfoCard {...props} />);

      expect(screen.getByText(/title/i)).toBeTruthy();
      expect(screen.getByText(/this is text/i)).toBeTruthy();
    });
  });

  describe('event handling', () => {
    it('should invoke onClick callback on click event', async () => {
      const onClickMockFn = jest.fn();
      props.onClick = onClickMockFn;
      const element = render(<InfoCard {...props} />);

      await act(() => user.click(screen.getByRole('button')));

      expect(onClickMockFn).toHaveBeenCalled();
    });
  });
});
