import Image from '@/components/Image/Image';
import { ImageProps } from '@/components/Image/types';
import { CDN_URL } from '@/global-vars';
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
      props.src = `${CDN_URL}/assets/card_test_img.jpg`;

      const GENERATED_CDN_IMAGE_OPTIMISED_URL = `${CDN_URL}/cdn-cgi/image/width=3840,quality=75,format=auto/${props.src}`;

      const { baseElement } = render(<Image {...props} alt={props.alt} />);
      const imageSrc = baseElement.querySelector(
        `img[src^="${GENERATED_CDN_IMAGE_OPTIMISED_URL}"]`
      );

      expect(imageSrc).toBeTruthy();
    });
  });
});
