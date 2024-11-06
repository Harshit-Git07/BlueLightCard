import { ValidationResult } from '../types';

export const validateFileList = (
  files: Array<File>,
  maxFiles: number,
  expectedFilesToUpload: number,
): ValidationResult => {
  if (files.length > maxFiles) {
    return {
      type: 'error',
      message: `Only ${expectedFilesToUpload} file${expectedFilesToUpload === 1 ? '' : 's'} can be uploaded`,
    };
  }
  return { type: 'success' };
};
