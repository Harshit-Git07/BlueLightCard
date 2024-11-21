import { useFileSelector } from '../../../FileUpload/useFileSelector';
import { FileInfo, UploadStatus } from '../../../FileUpload/types';

const between1And3Seconds = () => (Math.random() * 2 + 1) * 1000;
const useSimulatedFileSelector = () => {
  const { selectedFiles, addFiles, updateFile, removeFiles } = useFileSelector();

  const simulateFileUpload = (file: FileInfo) =>
    setTimeout(
      () =>
        Math.random() < 0.9
          ? updateFile(file.id, {
              ...file,
              uploadStatus: UploadStatus.Success,
              code: 200,
            })
          : updateFile(file.id, {
              ...file,
              uploadStatus: UploadStatus.Error,
              code: 400,
              errorMessage: 'testError',
            }),
      between1And3Seconds(),
    );

  const simulatedUpdateFile = (fileId: string, file: FileInfo) => {
    updateFile(fileId, file);
    simulateFileUpload(file);
  };

  return { selectedFiles, addFiles, updateFile: simulatedUpdateFile, removeFiles };
};

export default useSimulatedFileSelector;
