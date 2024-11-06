export enum UploadStatus {
  Ready = 'ready',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

interface FileInfoBase {
  id: string;
  uploadStatus: UploadStatus;
  file: File;
}

interface FileInfoWaiting extends FileInfoBase {
  uploadStatus: UploadStatus.Ready | UploadStatus.Loading;
}

interface FileInfoUploadSuccess extends FileInfoBase {
  uploadStatus: UploadStatus.Success;
  code?: number;
}

interface FileInfoUploadError extends FileInfoBase {
  uploadStatus: UploadStatus.Error;
  code?: number;
  errorMessage?: string;
}

export type FileInfo = FileInfoWaiting | FileInfoUploadSuccess | FileInfoUploadError;

export type ValidationResult =
  | {
      type: 'success';
    }
  | {
      type: 'error';
      message: string;
    };
