import CardCarousel from '@/offers/components/CardCarousel/CardCarousel';
import renderer from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react';

const offerData = [
  {
    offername: 'test',
    companyname: 'test',
    imageUrl: 'test.com',
    href: 'test.com',
  },
  {
    offername: 'test',
    companyname: 'test',
    imageUrl: 'test.com',
    href: 'test.com',
  },
  {
    offername: 'test',
    companyname: 'test',
    imageUrl: 'test.com',
    href: 'test.com',
  },
  {
    offername: 'test',
    companyname: 'test',
    imageUrl: 'test.com',
    href: 'test.com',
  },
  {
    offername: 'test',
    companyname: 'test',
    imageUrl: 'test.com',
    href: 'test.com',
  },
];

describe('CardCarousel', () => {
  it('should render with 3 elements visbile', () => {
    const component = renderer.create(
      <CardCarousel title="test" itemsToShow={3} offers={offerData} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with 1 element visbile', () => {
    const component = renderer.create(
      <CardCarousel title="test" itemsToShow={1} offers={offerData} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with small cards visbile', () => {
    const component = renderer.create(
      <CardCarousel title="test" itemsToShow={3} useSmallCards offers={offerData} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with a loading spinner when offers is empty', () => {
    const component = renderer.create(<CardCarousel title="test" itemsToShow={3} offers={[]} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

it('should call onCarouselInteracted when interacted with', () => {
  const onCarouselInteractedMock = jest.fn();

  const { getByTestId } = render(
    <CardCarousel
      title="test"
      itemsToShow={3}
      offers={offerData}
      onCarouselInteracted={onCarouselInteractedMock}
    />
  );

  const carouselElement = getByTestId('carousel');

  // Simulate interaction
  fireEvent.scroll(carouselElement);
  expect(onCarouselInteractedMock).toHaveBeenCalledTimes(1);
});
it('should apply placeholder height when carousel is not visible', () => {
  const component = renderer.create(<CardCarousel title="test" itemsToShow={3} offers={[]} />);

  const carouselInstance = component.root.findByType('div');
  expect(carouselInstance.props.className).toContain('h-[400px]');
});

jest.mock('@/hooks/useIsVisible', () => jest.fn());

it('should remove placeholder height when carousel becomes visible', () => {
  const useIsVisible = require('@/hooks/useIsVisible');
  useIsVisible.mockReturnValue(true);

  const { getByTestId } = render(<CardCarousel title="test" itemsToShow={3} offers={[]} />);

  const carouselElement = getByTestId('carousel');
  expect(carouselElement.className).not.toContain('h-[400px]');
});
