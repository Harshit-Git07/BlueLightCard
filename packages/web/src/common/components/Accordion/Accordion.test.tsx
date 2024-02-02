import Accordion from '@/components/Accordion/Accordion';
import { AccordionProps } from '@/components/Accordion/types';
import renderer from 'react-test-renderer';

describe('Accordion component', () => {
  let props: AccordionProps;

  it('should render an accordion', () => {
    const props = {
      title: 'Terms and Conditions',
      content: 'This is an accordion message.',
    };

    const component = renderer.create(<Accordion {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render an accordion with bold text', () => {
    const props = {
      title: 'Terms and Conditions',
      content: 'This is an **accordion** message.',
    };

    const component = renderer.create(<Accordion {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render an accordion with italic text', () => {
    const props = {
      title: 'Terms and Conditions',
      content: 'This is an *accordion* message.',
    };

    const component = renderer.create(<Accordion {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render an accordion with strong text', () => {
    const props = {
      title: 'Terms and Conditions',
      content: 'This is an __accordion__ message.',
    };

    const component = renderer.create(<Accordion {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render an accordion with new lines text', () => {
    const props = {
      title: 'Terms and Conditions',
      content: 'This is an \naccordion\n message.',
    };

    const component = renderer.create(<Accordion {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render an accordion with strike through text', () => {
    const props = {
      title: 'Terms and Conditions',
      content: '~~This is an accordion message.~~',
    };

    const component = renderer.create(<Accordion {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
