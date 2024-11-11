import { useCallback, useState } from 'react';
import { FileInfo } from './types';

interface FileSelector {
  selectedFiles: FileInfo[];
  addFiles: AddFiles;
  updateFile: UpdateFiles;
  removeFiles: RemoveFiles;
}

type AddFiles = (filesToAdd: FileInfo[]) => void;
type UpdateFiles = (fileId: string, newFile: FileInfo) => void;
type RemoveFiles = (fileIdsToRemove: string[]) => void;

export function useFileSelector(): FileSelector {
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);

  const addFiles: AddFiles = useCallback((filesToAdd) => {
    setSelectedFiles((files) => [...files, ...filesToAdd]);
  }, []);

  const updateFile: UpdateFiles = useCallback((fileId, updatedFile) => {
    setSelectedFiles((files) => {
      return files.map((file) => {
        return file.id === fileId ? updatedFile : file;
      });
    });
  }, []);

  const removeFiles: RemoveFiles = useCallback((fileIdsToRemove) => {
    setSelectedFiles((files) => {
      return files.filter((file) => !fileIdsToRemove.includes(file.id));
    });
  }, []);

  return {
    selectedFiles,
    addFiles,
    updateFile,
    removeFiles,
  };
}
