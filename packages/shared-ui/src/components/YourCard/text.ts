import { BRAND } from '../../types';

export const getBrandStrapline = (brand: string) => {
  const years = brand === BRAND.DDS_UK ? 5 : 2;
  const cardName = brand === BRAND.DDS_UK ? 'Defence Discount Service card' : 'Blue light Card';
  const currencySymbol = brand === BRAND.BLC_AU ? '$' : '£';
  return `Access every exclusive offer for the next ${years} years. Get your ${cardName} for ${currencySymbol}4.99.`;
};
