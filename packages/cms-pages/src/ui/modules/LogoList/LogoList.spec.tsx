import { composeStories } from '@storybook/react';
import * as stories from './LogoList.stories';
import { render } from '@testing-library/react';

jest.mock('../../../../../shared-ui/src/components/SwiperCarousel/index', () => {
  return {
    __esModule: true,
    default: () => {
      return <div></div>;
    },
  };
});

const { Default } = composeStories(stories);
describe('LogoList', () => {
  describe.each([{ Story: Default }])('$Story.storyName', ({ Story }) => {
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
