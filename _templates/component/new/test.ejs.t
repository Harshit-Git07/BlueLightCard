---
to: <%= out %>/<%= name %>.spec.tsx
---
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import <%= name %>, { Props } from './';

describe('<%= name %> component', () => {
  const props: Props = {};
  
  beforeEach(() => {
    // make sure to reset the props between test runs
    props = {};
  });
  
  // smoke test
  it('should render component without error', () => {
    const { baseElement } = render(<<%= name %> {...args} />);
    expect(baseElement).toBeTruthy();
  });

  // further tests can be written from here...
});
