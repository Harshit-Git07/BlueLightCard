import { render, screen } from '@testing-library/react';
import PopularBrandsSlider from '..';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@/modules/popularbrands/brands');

describe('Popular Brands', () => {
  it("should render 'Popular Brands' Carousel name", () => {
    whenPopularBrandsSliderIsRendered();

    const popularBrandsTitle = screen.queryByText('Popular brands');
    expect(popularBrandsTitle).toBeInTheDocument();
  });
  const whenPopularBrandsSliderIsRendered = () => {
    render(<PopularBrandsSlider />);
  };
});
