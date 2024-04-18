import Accordion from './';
import { default as MarkdownToJsx } from 'markdown-to-jsx';
import renderer from 'react-test-renderer';

describe('Accordion component', () => {
  it('should render an accordion with simple text', () => {
    const props = {
      title: 'Simple accordion message',
    };

    const component = renderer.create(
      <Accordion {...props}>This is a simple accordion message.</Accordion>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render an accordion with Markdown bold text', () => {
    const props = {
      title: 'Terms and Conditions',
    };

    const component = renderer.create(
      <Accordion {...props}>
        <MarkdownToJsx>{'This is an **accordion** message.'}</MarkdownToJsx>
      </Accordion>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
