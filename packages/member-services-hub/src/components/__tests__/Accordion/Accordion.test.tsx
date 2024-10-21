import { render, screen } from '@testing-library/react';
import { AccordionProps } from '@/components/Accordion/types';
import Accordion from '@/components/Accordion/Accordion';
import AccordionChildInput from '@/components/Accordion/AccordionChildInput';

describe('Accordion component', () => {
  let props: AccordionProps;
  let fields = {
    firstName: 'Daniel',
    lastName: 'Cook',
    email: 'tehcooky@hotmail.com',
    phoneNumber: '07814486595',
  };

  beforeEach(() => {
    props = {
      header: 'unit test',
      childComponent: <AccordionChildInput fields={fields} />,
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Accordion {...props} />);

      const header = screen.getByTestId('h4-header');

      expect(header).toBeTruthy();
    });
  });
});
