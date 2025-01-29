import { useMutation } from '@tanstack/react-query';
import { usePlatformAdapter } from '../adapters';
import { jsonOrNull } from '../utils/jsonUtils';
import { V5_API_URL } from '../constants';
import { DocumentUploadLocation } from '@blc-mono/shared/models/members/documentUpload';

const useMemberApplicationUploadDocumentPost = (memberId: string, applicationId: string) => {
  const adapter = usePlatformAdapter();
  return useMutation({
    mutationFn: async (): Promise<any> => {
      try {
        const { status, data } = await adapter.invokeV5Api(
          V5_API_URL.DocumentUpload(memberId, applicationId),
          {
            method: 'POST',
          },
        );
        return {
          status,
          data: jsonOrNull<DocumentUploadLocation>(data),
        };
      } catch (e) {
        return {
          status: 500,
          data: { error: 'Unknown error occurred' },
        };
      }
    },
  });
};

export default useMemberApplicationUploadDocumentPost;
