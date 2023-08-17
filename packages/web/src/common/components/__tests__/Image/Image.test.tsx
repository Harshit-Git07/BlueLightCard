import Image from '@/components/Image/Image';
import { ImageProps } from '@/components/Image/types';
import { render } from '@testing-library/react';

describe('Image component', () => {
  let props: ImageProps;

  beforeEach(() => {
    props = {
      src: '',
      alt: 'Test alt',
    };
  });

  afterEach(() => {
    delete process.env.STORYBOOK_ENV;
  });

  describe('image loader', () => {
    it('should resolve image src to relative path if storybook env set to true', () => {
      process.env.STORYBOOK_ENV = 'true';
      props.src = '/assets/card_test_img.jpg';

      const { baseElement } = render(<Image {...props} alt={props.alt} />);
      const imageSrc = baseElement.querySelector(`img[src*="${props.src}"]`);

      expect(imageSrc).toBeTruthy();
    });
    it('should resolve image src to nextjs path if storybook env set to false', () => {
      props.src = '/assets/card_test_img.jpg';

      const { baseElement } = render(<Image {...props} alt={props.alt} />);
      const imageSrc = baseElement.querySelector(`img[src*="_next/static${props.src}"]`);

      expect(imageSrc).toBeTruthy();
    });
    it('should resolve image src to absolute url', () => {
      props.src = 'https://cdn.bluelightcard.co.uk/assets/card_test_img.jpg';

      const { baseElement } = render(<Image {...props} alt={props.alt} />);
      const imageSrc = baseElement.querySelector(`img[src^="${props.src}"]`);

      expect(imageSrc).toBeTruthy();
    });
  });
});
