import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import '@testing-library/jest-dom';
import ResponsiveOfferCard, { Props } from '.';

describe('ResponsiveOfferCard component', () => {
  const args: Props = {
    id: '123',
    companyId: '4016',
    companyName: 'Samsung',
    type: 'online',
    name: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
    image: '/assets/forest.jpeg',
  };
  it('Should render offer card component without error', () => {
    render(<ResponsiveOfferCard {...args} />);
  });

  it('Should render component with an image', () => {
    render(<ResponsiveOfferCard {...args} />);
    const image = screen.getByRole('img');
    expect(image).toBeTruthy();
  });

  it('Should render component with an offer type tag ', () => {
    render(<ResponsiveOfferCard {...args} />);
    const offerTypeTag = screen.getByText(/online/i);

    expect(offerTypeTag).toBeTruthy();
  });

  it('Should render component with an offer name', () => {
    render(<ResponsiveOfferCard {...args} />);
    const offerName = screen.getByText(
      /Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet/i,
    );

    expect(offerName).toBeTruthy();
  });

  it('Should render component with vertical variant', () => {
    render(<ResponsiveOfferCard {...args} variant="vertical" />);
    const offerCard = screen.getByTestId('offer-card-123');
    expect(offerCard).toHaveClass('w-full h-full relative overflow-hidden cursor-pointer');
    expect(offerCard).not.toHaveClass('py-3 flow-root');
  });

  it('Should render component with horizontal variant', () => {
    render(<ResponsiveOfferCard {...args} variant="horizontal" />);
    const offerCard = screen.getByTestId('offer-card-123');
    expect(offerCard).toHaveClass('py-3 flow-root');
  });

  it('Should be focusable by pressing Tab', async () => {
    render(<ResponsiveOfferCard {...args} />);

    const offerCard = screen.getByTestId('offer-card-123');
    await userEvent.keyboard('{Tab}');

    expect(offerCard).toHaveFocus();
  });

  it('Should trigger click event by pressing Enter', async () => {
    const onClick = jest.fn();
    render(<ResponsiveOfferCard {...args} onClick={onClick} />);

    const offerCard = screen.getByTestId('offer-card-123');
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Enter}');

    expect(offerCard).toHaveFocus();
    expect(onClick).toHaveBeenCalled();
  });

  it('Should have no accessibility violations', async () => {
    const { container } = render(<ResponsiveOfferCard {...args} />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
