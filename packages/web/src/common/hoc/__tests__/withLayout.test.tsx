import { render } from '@testing-library/react';
import withLayout from '../withLayout';

describe('withLayout HOC test', () => {
  it('should return a NextPageWithLayout with a new getLayout function', () => {
    const Page = () => <h1>Hello World</h1>;

    const PageWithLayout = withLayout(Page);

    expect(PageWithLayout.getLayout).toBeDefined();
  });

  it('should render the content', () => {
    // Test link 8-10 of withLayout.tsx
    const Element = <h1 data-testid="test-element">Hello World</h1>;
    const Page = () => Element;

    const PageWithLayout = withLayout(Page);

    const { container } = render(<PageWithLayout />);

    const element = container.querySelector('[data-testid="test-element"]');
    expect(element).toBeDefined();
  });
});
