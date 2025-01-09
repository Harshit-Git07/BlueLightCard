import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';
import * as stories from './CreativeModule.stories';

const { Default, CenterAligned, RightAligned, MultipleColumns } = composeStories(stories);

describe('Creative Module', () => {
  describe.each([
    { Story: Default },
    { Story: CenterAligned },
    { Story: RightAligned },
    { Story: MultipleColumns },
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
