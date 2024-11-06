import { useState } from 'react';
import { FileInfo } from './types';

export const useFileSelector = () => {
  const [selectedFiles, setSelectedFiles] = useState<Array<FileInfo>>([]);

  const addFiles = (filesToAdd: FileInfo[]) =>
    setSelectedFiles((prevState) => [...prevState, ...filesToAdd]);

  const updateFile = (fileId: string, newFile: FileInfo) =>
    setSelectedFiles((prevState) => prevState.map((file) => (file.id === fileId ? newFile : file)));

  const removeFiles = (fileIdsToRemove: string[]) =>
    setSelectedFiles((prevState) => prevState.filter((file) => !fileIdsToRemove.includes(file.id)));

  return {
    selectedFiles,
    addFiles,
    updateFile,
    removeFiles,
  };
};
