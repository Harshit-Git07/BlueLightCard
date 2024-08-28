import '@testing-library/jest-dom';
import { render, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../PillGroup.stories';

const { Default } = composeStories(stories);

describe('PillGroup', () => {
  it('should render BrowseCategories component without error', () => {
    render(<Default />);
  });

  it('should render BrowseCategories component with a title', () => {
    const { container } = render(<Default title="Title" />);
    const title = within(container).getByText(/title/i);
    expect(title).toBeVisible();
  });

  it('should render BrowseCategories component with pills', () => {
    const { container } = render(<Default />);
    const button = within(container).getAllByRole('button');
    expect(button).toHaveLength(15);
  });

  it('is keyboard accessible', async () => {
    const onSelectedPill = jest.fn();

    const { container } = render(<Default onSelectedPill={onSelectedPill} />);

    // the next pill can be tabbed to
    await userEvent.keyboard('{Tab}');
    const categoryTwo = within(container).getByText('Food and drink');
    expect(categoryTwo).toHaveFocus();

    // the next pill can be navigated to with arrow right
    await userEvent.keyboard('{ArrowRight}');
    const categoryThree = within(container).getByText('Electrical');
    expect(categoryThree).toHaveFocus();

    // the previous pill can be navigated to with arrow left
    await userEvent.keyboard('{ArrowLeft}');
    expect(categoryTwo).toHaveFocus();

    // the next pill can be navigated to with arrow down
    await userEvent.keyboard('{ArrowDown}');
    expect(categoryThree).toHaveFocus();

    // the previous pill can be navigated to with arrow up
    await userEvent.keyboard('{ArrowUp}');
    expect(categoryTwo).toHaveFocus();

    // focus resets to the start if navigated past the last pill
    const categoryOne = within(container).getByText('Beauty and Fragrance');
    for (let i = 1; i < 15; i++) {
      await userEvent.keyboard('{ArrowRight}');
    }
    expect(categoryOne).toHaveFocus();
  });
});
