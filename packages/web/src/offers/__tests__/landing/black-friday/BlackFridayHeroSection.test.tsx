import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';

import BlackFridayHeroSection from '@/offers/components/landing/black-friday/BlackFridayHeroSection';
import blackFridayLandingPageConfig from '@/data/landing/blackFridayPageConfig';

describe('BlackFridayHeroSection', () => {
  it('should match snapshot', () => {
    const { heroSection } = blackFridayLandingPageConfig;
    const component = renderer.create(<BlackFridayHeroSection {...heroSection} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render paragraphs when empty", () => {
    const { heroSection } = blackFridayLandingPageConfig;
    const { paragraphs } = heroSection;
    render(<BlackFridayHeroSection {...heroSection} paragraphs={[]} />);

    for (const paragraph of paragraphs) {
      expect(screen.queryByText(paragraph)).toBeNull();
    }
  });
});
