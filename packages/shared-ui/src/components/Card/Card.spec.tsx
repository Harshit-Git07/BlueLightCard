import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './';
import { CardProps } from './types';

describe('Card component', () => {
  const setupCard = (overrideProps = {}) => {
    const defaultProps: CardProps = {
      initialCardState: 'default',
      cardTitle: 'Test Card',
      description: 'This is a test card description',
      buttonTitle: 'Click Me',
      imageAlt: 'Test Image',
      imageSrc: 'test-image.jpg',
      showImage: true,
      showDescription: true,
      showButton: true,
      onClick: jest.fn(),
      ariaLabel: 'Test Card',
    };

    const mergedProps = { ...defaultProps, ...overrideProps };
    const result = render(<Card {...mergedProps} />);

    return {
      ...result,
      props: mergedProps,
      cardElement: () => screen.getByText('Test Card').closest('.group'),
      cardInnerDiv: () => screen.getByText('Test Card').closest('.group')?.querySelector('div'),
      button: () => screen.queryByText('Click Me'),
      image: () => screen.queryByAltText('Test Image'),
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component without error', () => {
    const props = {};

    const { baseElement } = setupCard(props);

    expect(baseElement).toBeTruthy();
  });

  it('should render card title and description', () => {
    const props = {};

    setupCard(props);

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test card description')).toBeInTheDocument();
  });

  it('should render image when showImage is true', () => {
    const props = { showImage: true };

    const { image } = setupCard(props);

    expect(image()).toBeInTheDocument();
  });

  it('should not render image when showImage is false', () => {
    const props = { showImage: false };

    const { image } = setupCard(props);

    expect(image()).not.toBeInTheDocument();
  });

  it('should render button when showButton is true', () => {
    const props = { showButton: true };

    const { button } = setupCard(props);

    expect(button()).toBeInTheDocument();
  });

  it('should not render button when showButton is false', () => {
    const props = { showButton: false };

    const { button } = setupCard(props);

    expect(button()).not.toBeInTheDocument();
  });

  it('should call onClick when button is clicked', () => {
    const mockOnClick = jest.fn();
    const { button } = setupCard({ onClick: mockOnClick });

    fireEvent.click(button()!);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should change state to hover on mouse enter', () => {
    const { cardElement, cardInnerDiv } = setupCard();

    fireEvent.mouseEnter(cardElement()!);

    expect(cardInnerDiv()).toHaveClass(
      'border-colour-primary-hover',
      'dark:border-colour-primary-hover-dark',
    );
  });

  it('should change state to default on mouse leave', () => {
    const { cardElement, cardInnerDiv } = setupCard();

    fireEvent.mouseEnter(cardElement()!);
    fireEvent.mouseLeave(cardElement()!);

    expect(cardInnerDiv()).toHaveClass(
      'border-colour-onSurface-outline',
      'dark:border-colour-onSurface-outline-dark',
    );
  });

  it('should change state to selected on button click', () => {
    const { button, cardInnerDiv } = setupCard();

    fireEvent.click(button()!);

    expect(cardInnerDiv()).toHaveClass('border-colour-primary', 'dark:border-colour-primary-dark');
  });

  it('should maintain selected state on hover', () => {
    const { button, cardElement, cardInnerDiv } = setupCard();

    fireEvent.click(button()!);
    fireEvent.mouseEnter(cardElement()!);

    expect(cardInnerDiv()).toHaveClass('border-colour-primary', 'dark:border-colour-primary-dark');
  });
});
