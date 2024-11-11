import { fireEvent, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';
import * as stories from './ErrorState.stories';

const { Default, Customised } = composeStories(stories);

describe('ErrorState component', () => {
  it('should render component without error', () => {
    const { baseElement } = render(<Default />);

    expect(baseElement).toBeTruthy();
  });

  describe('broken offer image', () => {
    it('should render', () => {
      render(<Default />);

      const brokenOfferImage = screen.getByLabelText('Image of a broken offer tag');

      expect(brokenOfferImage).toBeInTheDocument();
    });
  });

  describe('error message', () => {
    it('should render the default message text', () => {
      render(<Default />);

      const errorMessage = screen.getByText('Oops! Something went wrong.');

      expect(errorMessage).toBeInTheDocument();
    });

    it('should render the given message text', () => {
      render(<Customised />);

      const errorMessage = screen.getByText('An unexpected error has occurred.');

      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('try again button', () => {
    it('should render the default button text', () => {
      render(<Default />);

      const tryAgainButton = screen.getByText('Please try again');

      expect(tryAgainButton).toBeInTheDocument();
    });

    it('should render the given button text', () => {
      render(<Customised />);

      const tryAgainButton = screen.getByText('Go back');

      expect(tryAgainButton).toBeInTheDocument();
    });

    describe('when clicked', () => {
      it('should call the default callback', () => {
        const reload = jest.fn();
        Object.defineProperty(window, 'location', {
          configurable: true,
          enumerable: true,
          value: {
            reload,
          },
        });

        render(<Default />);
        const tryAgainButton = screen.getByText('Please try again');

        fireEvent.click(tryAgainButton);

        expect(reload).toHaveBeenCalled();
      });

      it('should call the given callback', () => {
        const onButtonClick = jest.fn();
        render(<Customised onButtonClick={onButtonClick} />);
        const tryAgainButton = screen.getByText('Go back');

        fireEvent.click(tryAgainButton);

        expect(onButtonClick).toHaveBeenCalled();
      });
    });
  });
});
