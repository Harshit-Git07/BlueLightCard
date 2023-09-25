import CardCarousel from '@/offers/components/CardCarousel/CardCarousel';
import renderer from 'react-test-renderer';

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
