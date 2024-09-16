import Accordion from './';
import { default as MarkdownToJsx } from 'markdown-to-jsx';
import renderer from 'react-test-renderer';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { PlatformVariant } from 'src/types';

describe('Accordion component', () => {
  const mockPlatformAdapter = useMockPlatformAdapter(200, {}, PlatformVariant.Web);
  it('should render an accordion with simple text', () => {
    const props = {
      title: 'Simple accordion message',
    };

    const component = renderer.create(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <Accordion {...props}>This is a simple accordion message.</Accordion>,
      </PlatformAdapterProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render an accordion with Markdown bold text', () => {
    const props = {
      title: 'Terms and Conditions',
    };

    const component = renderer.create(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <Accordion {...props}>
          <MarkdownToJsx>{'This is an **accordion** message.'}</MarkdownToJsx>
        </Accordion>
      </PlatformAdapterProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
