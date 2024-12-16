import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PopularBrands from '@/components/PopularBrands/PopularBrands';

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

describe('PopularBrands', () => {
  const mockProps = {
    rounded: false,
    title: 'Popular brands test',
    brands: brands,
    text: 'Some of your favourite brands',
    onBrandItemClick: jest.fn(),
    onInteracted: jest.fn(),
  };

  it('renders the component', () => {
    const { container } = render(<PopularBrands {...mockProps} />);

    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));

    jest.advanceTimersByTime(750);

    expect(screen.getByText('Popular brands test')).toBeInTheDocument();
    expect(screen.getByText('Some of your favourite brands')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('is rounded', () => {
    const { container } = render(<PopularBrands {...mockProps} rounded={true} />);
    const button = container.querySelectorAll('.popular-brands') as unknown as HTMLButtonElement[];

    const image = within(button[0]).getByAltText('Gym King');

    expect(image).toBeInTheDocument();
  });

  it('renders buttons with images', () => {
    const { getByAltText } = render(<PopularBrands {...mockProps} />);

    brands.forEach((brand) => {
      const image = getByAltText(brand.brandName) as HTMLImageElement;

      expect(image).toBeInTheDocument();
      expect(image.src).toContain('/images/image.jpg');
    });
  });

  it('calls the onBrandItemClick function when clicked', async () => {
    const { container } = render(<PopularBrands {...mockProps} />);
    const button = container.querySelectorAll('.popular-brands') as unknown as HTMLButtonElement[];

    fireEvent.click(button[0]);

    expect(mockProps.onBrandItemClick).toHaveBeenCalled();
  });

  it('renders when it has at least 8 items', () => {
    const { container } = render(<PopularBrands {...mockProps} />);
    const buttons = container.querySelectorAll('.popular-brands') as unknown as HTMLButtonElement[];

    expect(buttons[0]).toBeInTheDocument();

    expect(buttons).toHaveLength(9);
  });
});
