import InfoCard from '@/components/InfoCard/InfoCard';
import { InfoCardProps } from '@/components/InfoCard/types';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

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
