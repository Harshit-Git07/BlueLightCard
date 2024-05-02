import { render, screen } from '@testing-library/react';
import ListItem from '@/components/ListItem/ListItem';
import { ListItemProps } from '@/components/ListItem/types';
import '@testing-library/jest-dom';

// Next js encodes the images like this, so I mocked the value here.
const fallBackImage =
  '/_next/image?url=https%3A%2F%2Fcdn.bluelightcard.co.uk%2Fmisc%2FLogo_coming_soon.jpg&w=3840&q=75';

const imageFromApi = '/_next/image?url=%2Fassets%2Fforest.jpeg&w=3840&q=75';

describe('Render the component with imageSrc', () => {
  const props: ListItemProps = {
    title: '15% Discount',
    text: 'Hard Rock Café',
    imageSrc: '/assets/forest.jpeg',
    imageAlt: 'alt-test',
  };
  it('should render component without error', () => {
    render(<ListItem {...props} />);
  });

  it('should use imageSrc when provided', () => {
    render(<ListItem {...props} />);
    const image = screen.getByAltText('alt-test');
    expect(image).toHaveAttribute('src', imageFromApi);
  });
});

describe('Render the component without imageSrc', () => {
  const props: ListItemProps = {
    title: '15% Discount',
    text: 'Hard Rock Café',
    imageSrc: '',
    imageAlt: 'alt-test',
  };
  it('should use fallbackImage when imageSrc is empty', () => {
    render(<ListItem {...props} />);

    const image = screen.getByAltText('alt-test');
    expect(image).toBeVisible();
    expect(image).toHaveAttribute('src', fallBackImage);
  });
});
