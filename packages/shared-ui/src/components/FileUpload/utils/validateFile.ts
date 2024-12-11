import { ValidationResult } from '../types';
import { getDocument } from 'pdfjs-dist/webpack.mjs';

const pdfFileIsPasswordProtected = async (file: File): Promise<boolean> => {
  const arrayBuffer = await file.arrayBuffer();
  try {
    await getDocument({ data: arrayBuffer }).promise;
    return false;
  } catch (error: any) {
    return error?.name === 'PasswordException';
  }
};

const fileHasInvalidType = (file: File, allowedFileTypes: string[]) =>
  !allowedFileTypes.includes(file.type);
const fileHasInvalidSize = (file: File, maxFileSize: number) => file.size > maxFileSize;
const fileIsPasswordProtected = async (file: File) =>
  file.type === 'application/pdf' && (await pdfFileIsPasswordProtected(file));

export const validateFile = async (
  file: File,
  allowedFileTypes: string[],
  maxFileSize: number,
  validatePasswordProtectedPdfs: boolean,
): Promise<ValidationResult> => {
  if (fileHasInvalidType(file, allowedFileTypes)) {
    return {
      type: 'error',
      message: 'Invalid File Type',
    };
  }
  if (fileHasInvalidSize(file, maxFileSize)) {
    return {
      type: 'error',
      message: 'File too big',
    };
  }
  if (validatePasswordProtectedPdfs && (await fileIsPasswordProtected(file))) {
    return {
      type: 'error',
      message: "Can't upload password protected file",
    };
  }
  return { type: 'success' };
};
