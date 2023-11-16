import BlackFridayOfferSection from '@/offers/components/landing/black-friday/BlackFridayOfferSection';
import blackFridayLandingPageConfig from '@/data/landing/blackFridayPageConfig';
import renderer from 'react-test-renderer';
import { BlackFridayOfferSectionProps } from '@/offers/components/landing/black-friday/types';
import { ThemeVariant } from '@/types/theme';

describe('BlackFridayOfferSection', () => {
  it('should match snapshot', () => {
    const { offerSections } = blackFridayLandingPageConfig;

    const blackFridayOfferSections = offerSections.map(
      ({ id, title, subtitle, offers }: BlackFridayOfferSectionProps, index: number) => (
        <BlackFridayOfferSection
          key={index}
          id={id}
          title={title}
          subtitle={subtitle}
          offers={offers}
          variant={index % 2 ? ThemeVariant.Secondary : undefined}
          shopAllCtaLink="/shop-all"
        />
      )
    );

    const component = renderer.create(<>{blackFridayOfferSections}</>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
