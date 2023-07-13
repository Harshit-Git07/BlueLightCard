/* eslint-disable jsx-a11y/alt-text */
import Image from '@/components/Image/Image';
import { ImageProps } from '@/components/Image/types';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

describe('Image component', () => {
  let props: ImageProps;

  beforeEach(() => {
    props = {
      src: 'https://placehold.co/600x400',
      alt: 'Test image',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Image {...props} />);

      const image = screen.getByRole('img');

      expect(image).toBeTruthy();
    });
  });

  describe('snapshot Test', () => {
    it('renders an image', () => {
      const component = renderer.create(<Image {...props} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
