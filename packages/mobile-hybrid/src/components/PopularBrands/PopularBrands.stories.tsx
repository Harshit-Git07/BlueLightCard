import { Meta, StoryFn } from '@storybook/react';
import PopularBrands from './PopularBrands';
import brands from '@/modules/popularbrands/brands';

const componentMeta: Meta<typeof PopularBrands> = {
  title: 'PopularBrands',
  component: PopularBrands,
};

const DefaultTemplate: StoryFn<typeof PopularBrands> = (args) => <PopularBrands {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  title: 'Popular Brands',
  brands,
};

export default componentMeta;
