// [TODO] fix import issues around pdfjs-dist - TypeError: Promise.withResolvers is not a function at node_modules/pdfjs-dist/build/pdf.mjs:5764:35
// import { getDocument } from 'pdfjs-dist/webpack.mjs';

import { ValidationResult } from '../types';

// [TODO] remove this when the pdfjs-dist - issues are fixed
const getDocument = ({ data }: { data: ArrayBuffer }) => ({ promise: Promise.resolve(data) });

const pdfFileIsPasswordProtected = async (file: File): Promise<boolean> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    await getDocument({ data: arrayBuffer }).promise;
    return false;
  } catch (error: any) {
    console.log(error);
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
