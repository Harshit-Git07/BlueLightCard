import { renderHook } from '@testing-library/react';
import * as mediaQueries from '../useMediaQuery';

const { useMediaQuery, useMobileMediaQuery } = mediaQueries;

let eventHandler = jest.fn();

const withMatchMediaMock = (matchValue: boolean = false) => {
  const addEventListener = jest.fn().mockImplementation((_, handler) => {
    eventHandler = handler;
  });
  const removeEventListener = jest.fn();

  const matchMediaMock = jest.fn().mockReturnValue({
    matches: matchValue,
    addEventListener,
    removeEventListener,
  });

  window.matchMedia = matchMediaMock;

  return { matchMediaMock, addEventListener, removeEventListener, eventHandler };
};

describe('useMediaQuery', () => {
  describe('when the hook mounts', () => {
    it('returns false if window.matchMedia is not available (e.g. SSR)', () => {
      const matchMediaSpy = jest.spyOn(window, 'matchMedia');
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
      });

      const match = renderHook(() => useMediaQuery('(max-width: 700px)'));

      expect(match.result.current).toEqual(false);
      expect(matchMediaSpy).not.toHaveBeenCalled();
    });

    it('calls match media', () => {
      const { matchMediaMock } = withMatchMediaMock();
      renderHook(() => useMediaQuery('(max-width: 700px)'));

      expect(matchMediaMock).toHaveBeenCalled();
    });

    it('adds a media change event listener', () => {
      const { addEventListener } = withMatchMediaMock(false);

      renderHook(() => useMediaQuery('(max-width: 700px)'));

      expect(addEventListener).toHaveBeenCalled();
    });

    it('returns matched result', () => {
      withMatchMediaMock(true);
      const match = renderHook(() => useMediaQuery('(max-width: 700px)'));

      expect(match.result.current).toEqual(true);
    });
  });

  describe('when the hook unmounts', () => {
    it('removes a media change event listener', () => {
      const { removeEventListener } = withMatchMediaMock(false);

      const match = renderHook(() => useMediaQuery('(max-width: 700px)'));
      match.unmount();

      expect(removeEventListener).toHaveBeenCalled();
    });
  });
});

describe('useMobileMediaQuery', () => {
  it('calls useMediaQuery with a mobile query', () => {
    const useMediaQuerySpy = jest.spyOn(mediaQueries, 'useMediaQuery');
    renderHook(() => useMobileMediaQuery());

    expect(useMediaQuerySpy).toHaveBeenCalledWith('(max-width: 500px)');
  });
});
