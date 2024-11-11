import * as target from './useFileSelector';
import { renderHook, RenderHookResult } from '@testing-library/react';
import { act } from 'react';
import { UploadStatus } from './types';

const pngFile = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });

type Result = ReturnType<typeof target.useFileSelector>;

describe('on first render', () => {
  let renderResult: RenderHookResult<Result, void>;

  beforeEach(() => {
    renderResult = renderHook(() => {
      return target.useFileSelector();
    });
  });

  it('should default values', () => {
    expect(renderResult.result.current).toEqual({
      selectedFiles: [],
      addFiles: expect.any(Function),
      updateFile: expect.any(Function),
      removeFiles: expect.any(Function),
    });
  });

  describe('when a file is added', () => {
    beforeEach(() => {
      act(() => {
        renderResult.result.current.addFiles([
          {
            id: '1',
            file: pngFile,
            uploadStatus: UploadStatus.Ready,
          },
        ]);
      });
    });

    it('should update the list of files', () => {
      expect(renderResult.result.current.selectedFiles).toEqual([
        {
          id: '1',
          file: pngFile,
          uploadStatus: UploadStatus.Ready,
        },
      ]);
    });

    describe('when a file is updated', () => {
      beforeEach(() => {
        act(() => {
          renderResult.result.current.updateFile('1', {
            id: '2',
            file: pngFile,
            uploadStatus: UploadStatus.Error,
          });
        });
      });

      it('should update the file in the list', () => {
        expect(renderResult.result.current.selectedFiles).toEqual([
          {
            id: '2',
            file: pngFile,
            uploadStatus: UploadStatus.Error,
          },
        ]);
      });
    });

    describe('when a file is deleted', () => {
      beforeEach(() => {
        act(() => {
          renderResult.result.current.removeFiles(['1']);
        });
      });

      it('should update the file in the list', () => {
        expect(renderResult.result.current.selectedFiles).toEqual([]);
      });
    });
  });
});
