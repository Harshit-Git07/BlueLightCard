import imageUrlBuilder from '@sanity/image-url';
import client from './client';
import { ImageUrlBuilder } from 'next-sanity-image';

const builder = imageUrlBuilder(client);

/**
 * Configures the baseUrl to either the local instance of storybook or the original sanity cdn
 * @param builderInstance
 */
export function withConfiguredUrl(builderInstance: ImageUrlBuilder) {
  return builderInstance.withOptions({
    baseUrl:
      process.env.NEXT_PUBLIC_SANITY_DATASET_NAME === 'storybook'
        ? window.location.origin
        : builderInstance.options.baseUrl,
  });
}

export function urlFor(image: Sanity.Image) {
  return withConfiguredUrl(builder.image(image));
}
