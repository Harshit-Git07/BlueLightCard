import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';
import * as stories from './AccordionList.stories';

const { Default, Horizontal, Vertical } = composeStories(stories);

describe('Accordion List', () => {
  describe.each([{ Story: Default }, { Story: Horizontal }, { Story: Vertical }])(
    '$Story.storyName',
    ({ Story }) => {
      it('should pass smoke test', () => {
        const result = render(<Story />);
        expect(result).toBeTruthy();
      });

      it('should match snapshot', () => {
        const result = render(<Story />);
        expect(result.container).toMatchSnapshot();
      });
    },
  );
});
