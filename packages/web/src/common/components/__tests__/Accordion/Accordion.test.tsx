import Accordion from '@/components/Accordion/Accordion';
import { AccordionProps } from '@/components/Accordion/types';
import Markdown from '@/components/Markdown/Markdown';
import renderer from 'react-test-renderer';

describe('Accordion component', () => {
  it('should render an accordion with simple text', () => {
    const props: AccordionProps = {
      title: 'Simple accordion message',
    };

    const component = renderer.create(
      <Accordion {...props}>This is a simple accordion message.</Accordion>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render an accordion with Markdown bold text', () => {
    const props: AccordionProps = {
      title: 'Terms and Conditions',
    };

    const component = renderer.create(
      <Accordion {...props}>
        <Markdown content={'This is an **accordion** message.'} />
      </Accordion>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
