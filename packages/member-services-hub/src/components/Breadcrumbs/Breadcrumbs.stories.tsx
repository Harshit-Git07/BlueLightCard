import { Meta, StoryFn } from '@storybook/react';
import Breadcrumbs from './Breadcrumbs';
import { BreadcrumbsProps } from './types';

const componentMeta: Meta<typeof Breadcrumbs> = {
  title: 'member-services-hub/Breadcrumbs Component',
  component: Breadcrumbs,
};

const Template: StoryFn<typeof Breadcrumbs> = (args) => <Breadcrumbs {...args} />;

export const Default = Template.bind({});

Default.args = {
  trail: [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Electronics', href: '/products/electronics' },
    { name: 'Laptops', href: '/products/electronics/laptops' },
  ],
};

export default componentMeta;
