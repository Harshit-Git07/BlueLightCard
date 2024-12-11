import { useMutation } from '@tanstack/react-query';
import { usePlatformAdapter } from '../adapters';
import { jsonOrNull } from '../utils/jsonUtils';

export interface MemberApplicationUploadDocumentResponse {
  preSignedUrl: string;
}

const useMemberApplicationUploadDocumentPost = (memberId: string, applicationId: string) => {
  const adapter = usePlatformAdapter();
  return useMutation({
    mutationFn: async (): Promise<any> => {
      try {
        const { status, data } = await adapter.invokeV5Api(
          `/members/${memberId}/applications/${applicationId}/uploadDocument`,
          {
            method: 'POST',
          },
        );
        return {
          status,
          data: jsonOrNull<MemberApplicationUploadDocumentResponse>(data),
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
