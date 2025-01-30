import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PopularBrandsButtons from '@/components/PopularBrands/PopularBrandsButtons';

const brands = [
  {
    id: 22,
    imageSrc: '/images/image.jpg',
    brandName: 'Gym King',
  },
  {
    id: 23,
    imageSrc: '/images/image.jpg',
    brandName: 'M&S',
  },
  {
    id: 24,
    imageSrc: '/images/image.jpg',
    brandName: 'Asda',
  },
  {
    id: 25,
    imageSrc: '/images/image.jpg',
    brandName: 'Burger King',
  },
  {
    id: 26,
    imageSrc: '/images/image.jpg',
    brandName: 'Toyota',
  },
  {
    id: 27,
    imageSrc: '/images/image.jpg',
    brandName: 'McDonalds',
  },
  {
    id: 28,
    imageSrc: '/images/image.jpg',
    brandName: 'Superdry',
  },
  {
    id: 29,
    imageSrc: '/images/image.jpg',
    brandName: 'Sainsburys',
  },
  {
    id: 30,
    imageSrc: '/images/image.jpg',
    brandName: 'David Lloyd',
  },
];

// Mock the next/image component
jest.mock('next/image', () => {
  return function MockImage(props: any) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  };
});

jest.useFakeTimers(); // Use fake timers for testing

describe('PopularBrandsButtons', () => {
  const mockProps = {
    brands: brands,
    imageWrapperClass: 'imageWrapperClass',
    imageClass: 'imageClass',
  };

  it('renders the component', () => {
    const { container } = render(<PopularBrandsButtons {...mockProps} />);

    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));

    jest.advanceTimersByTime(750);

    expect(container).toMatchSnapshot();
  });

  it('calls onClick when button is clicked', () => {
    const handleClick = jest.fn(); // Create a mock function
    render(
      <PopularBrandsButtons {...mockProps} onButtonClick={() => handleClick('Test message')} />,
    );

    const button = screen.getByLabelText(/Gym King/i);
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1); // Check if the mock function was called once
  });

  it('renders buttons with images', () => {
    const { getByAltText } = render(<PopularBrandsButtons {...mockProps} />);

    brands.forEach((brand) => {
      const image = getByAltText(brand.brandName) as HTMLImageElement;

      expect(image).toBeInTheDocument();
      expect(image.src).toContain('/images/image.jpg');
    });
  });

  it('renders when it has at least 8 items', () => {
    const { container } = render(<PopularBrandsButtons {...mockProps} limit={7} />);
    const buttons = container.querySelectorAll(
      '.imageWrapperClass',
    ) as unknown as HTMLButtonElement[];

    expect(buttons[0]).toBeInTheDocument();

    expect(buttons).toHaveLength(8);
  });
});
