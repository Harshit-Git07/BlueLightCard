import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';
import * as stories from './RichtextModule.stories';

const { Normal, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Blockquote } =
  composeStories(stories);

describe('Richtext Module', () => {
  describe.each([
    { Story: Normal },
    { Story: Heading1 },
    { Story: Heading2 },
    { Story: Heading3 },
    { Story: Heading4 },
    { Story: Heading5 },
    { Story: Heading6 },
    { Story: Blockquote },
  ])('$Story.storyName', ({ Story }) => {
    it('should pass smoke test', () => {
      const result = render(<Story />);
      expect(result).toBeTruthy();
    });

    it('should match snapshot', () => {
      const result = render(<Story />);
      expect(result.container).toMatchSnapshot();
    });
  });
});
