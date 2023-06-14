
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoCard from '../../InfoCard/InfoCard';
import { InfoCardProps } from '../../InfoCard/Types';

describe('InfoCard Component', () => {
  let props: InfoCardProps;

  beforeEach(() => {
    props = { title: 'Card Title', text: 'This is the card text' };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<InfoCard {...props} />);
    });
  });
});