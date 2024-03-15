import Markdown from '@/components/Markdown/Markdown';
import { MarkdownProps } from '@/components/Markdown/types';
import renderer from 'react-test-renderer';

describe('Markdown component', () => {
  let props: MarkdownProps;

  it('should render Markdown content', () => {
    const props = {
      content: 'These are the terms and conditions for the above offer.',
    };

    const component = renderer.create(<Markdown {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Markdown with bold text', () => {
    const props = {
      content: 'These are **bold** terms and conditions for the above offer.',
    };

    const component = renderer.create(<Markdown {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Markdown with italic text', () => {
    const props = {
      content: 'These are *italic* terms and conditions for the above offer.',
    };

    const component = renderer.create(<Markdown {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Markdown with strong text', () => {
    const props = {
      content: 'These are __strong__ terms and conditions for the above offer.',
    };

    const component = renderer.create(<Markdown {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Markdown with new lines text', () => {
    const props = {
      content: 'These are \n terms and conditions \n on a new line \n for the above offer.',
    };

    const component = renderer.create(<Markdown {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render Markdown with strike through text', () => {
    const props = {
      content: '~~These are terms and conditions on a new line for the above offer.~~',
    };

    const component = renderer.create(<Markdown {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
