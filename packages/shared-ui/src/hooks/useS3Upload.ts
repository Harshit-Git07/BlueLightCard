import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface S3UploadOptions {
  preSignedUrl: string;
  file: File;
}

// This is out here to enable it to be easily replaced for test purposes
export const s3UploadConf = {
  action: async (options: S3UploadOptions) => {
    const { preSignedUrl, file } = options;
    const formData = new FormData();
    formData.append('file', file);
    const { status, data } = await axios.put(preSignedUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { status, data };
  },
};

const useS3Upload = () => {
  return useMutation({
    mutationFn: async (options: S3UploadOptions) => {
      try {
        const { status, data } = await s3UploadConf.action(options);
        return { status, data };
      } catch (e) {
        return {
          status: 500,
          data: { error: 'Unknown error occurred' },
        };
      }
    },
  });
};

export default useS3Upload;
