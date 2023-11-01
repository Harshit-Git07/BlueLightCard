import { act, fireEvent, render, screen } from '@testing-library/react';
import { VideoProps } from '@/page-components/VideoFrame/types';
import VideoFrame from '@/page-components/VideoFrame/VideoFrame';

describe('VideoFrame component', () => {
  let props: VideoProps;

  beforeEach(() => {
    props = {
      videoSrc: '',
    };
  });

  describe('rendering', () => {
    it('should mount component without error', () => {
      render(<VideoFrame {...props} />);
    });
  });

  describe('player controls', () => {
    it('should render pause button on clicking play', async () => {
      render(<VideoFrame {...props} />);
      await act(async () => fireEvent.play(screen.getByLabelText('Player')));
      expect(
        screen.getByRole('button', { name: 'Player button' }).querySelector('.fa-pause')
      ).toBeTruthy();
    });

    it('should invoke play function on clicking play', async () => {
      window.HTMLVideoElement.prototype.play = async () => {};
      const mockPlayFn = jest.spyOn(window.HTMLVideoElement.prototype, 'play');
      render(<VideoFrame {...props} />);
      await act(async () => fireEvent.loadedData(screen.getByLabelText('Player')));
      await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Player button' })));
      expect(mockPlayFn).toHaveBeenCalled();
    });
  });
});
