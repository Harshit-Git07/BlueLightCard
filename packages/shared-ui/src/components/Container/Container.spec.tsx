import { render } from '@testing-library/react';
import Container, { Props } from './';

describe('Button', () => {
  let props: Props;

  it('should render the Container component without error', () => {
    render(<Container {...props}></Container>);
  });
});
