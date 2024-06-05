import Card from '@/components/Card/Card';
import { CardProps } from '@/components/Card/types';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const fallBackImage =
  '/_next/image?url=https%3A%2F%2Fcdn.bluelightcard.co.uk%2Fmisc%2FLogo_coming_soon.jpg&w=3840&q=75';

describe('Card component', () => {
  let props: CardProps;

  beforeEach(() => {
    props = {
      onClick: jest.fn(),
      title: 'Card title',
      text: 'Card description',
    };
  });

  describe('Smoke test', () => {
    it('should render component without error', () => {
      render(<Card {...props} />);
    });
  });

  describe('Component callbacks', () => {
    it('should invoke onClick when user clicks on the card', async () => {
      render(<Card {...props} />);

      const cardButton = screen.getByRole('button');

      await act(async () => {
        await userEvent.click(cardButton);
      });
      expect(props.onClick).toHaveBeenCalled();
    });
  });

  describe('Test image on the component', () => {
    it('renders the image when imageSrc is provided', () => {
      render(<Card imageSrc={fallBackImage} imageAlt="image-test" />);
      const cardImage = screen.getByAltText('image-test');
      expect(cardImage).toBeInTheDocument();
    });

    it('does not render the image when imageSrc is not provided', () => {
      render(<Card />);
      const cardImage = screen.queryByAltText('');
      expect(cardImage).not.toBeInTheDocument();
    });
  });
});
