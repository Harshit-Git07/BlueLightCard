import HorizontalCard from '@/components/HorizontalCard/HorizontalCard';
import { fireEvent, render, screen } from '@testing-library/react';

describe('HorizontalCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <HorizontalCard
        img={'https://placehold.co/600x400'}
        title={'test title'}
        description={'test description'}
        link={'www.google.com'}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});

describe('HorizontalCard', () => {
  describe('HorizontalCard component', () => {
    it('the list length should match the array length passed through it', () => {
      const items = [
        {
          img: 'https://placehold.co/600x400',
          title: 'Shop1',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
          link: 'www.google.com',
        },
        {
          img: 'https://placehold.co/600x400',
          title: 'Shop2',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
          link: 'www.google.com',
        },
        {
          img: 'https://placehold.co/600x400',
          title: 'Shop3',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
          link: 'www.google.com',
        },
      ];

      const { getAllByTestId } = render(
        <div>
          {items.map((item, index) => (
            <HorizontalCard
              key={index}
              img={item.img}
              title={item.title}
              description={item.description}
              link={item.link}
              data-testid={`horizontalCard${index}`}
            />
          ))}
        </div>
      );

      const renderedItems = getAllByTestId(/horizontalCard/);
      expect(renderedItems.length).toBe(items.length);
    });
  });

  it('should navigate to the specified link when clicked', () => {
    const item = {
      img: 'https://placehold.co/600x400',
      title: 'Shop name goes here',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
      link: 'www.google.com',
    };

    render(
      <HorizontalCard
        img={item.img}
        title={item.title}
        description={item.description}
        link={item.link}
      />
    );

    const linkElement = screen.getByTestId('horizontalCard');

    expect(linkElement).toBeTruthy();

    fireEvent.click(linkElement);
  });
});
