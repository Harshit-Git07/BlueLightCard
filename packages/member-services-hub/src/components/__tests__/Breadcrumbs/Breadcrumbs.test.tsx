import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { BreadcrumbsProps } from '@/components/Breadcrumbs/types';

describe('Breadcrumbs component', () => {
  let props: BreadcrumbsProps;

  beforeEach(() => {
    props = {
      trail: [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Electronics', href: '/products/electronics' },
        { name: 'Laptops', href: '/products/electronics/laptops' },
      ],
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Breadcrumbs {...props} data-testid="breadcrumbs" />);

      const breadcrumbs = screen.getByTestId('breadcrumbs');

      expect(breadcrumbs).toBeTruthy();
    });
  });

  describe('rendering trail', () => {
    it('should render all breadcrumb items', () => {
      render(<Breadcrumbs {...props} data-testid="breadcrumbs" />);

      props.trail.forEach((item) => {
        const breadcrumbItem = screen.getByText(item.name);
        expect(breadcrumbItem).toBeInTheDocument();
      });
    });

    it('should render the last breadcrumb item as a span', () => {
      render(<Breadcrumbs {...props} data-testid="breadcrumbs" />);

      const lastItem = props.trail[props.trail.length - 1];
      const lastBreadcrumb = screen.getByText(lastItem.name);

      expect(lastBreadcrumb.tagName).toBe('SPAN');
    });

    it('should render all other breadcrumb items as links', () => {
      render(<Breadcrumbs {...props} data-testid="breadcrumbs" />);

      props.trail.slice(0, -1).forEach((item) => {
        const link = screen.getByText(item.name);
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', item.href);
      });
    });
  });
});
