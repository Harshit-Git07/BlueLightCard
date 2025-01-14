import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';
import * as stories from './Hero.stories';

const {
  Default,
  LeftAligned,
  RightAligned,
  CenterAligned,
  TopAligned,
  BottomAligned,
  VerticalCenterAligned,
} = composeStories(stories);

describe('Hero', () => {
  describe.each([
    { Story: Default },
    { Story: LeftAligned },
    { Story: RightAligned },
    { Story: CenterAligned },
    { Story: TopAligned },
    { Story: BottomAligned },
    { Story: VerticalCenterAligned },
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
