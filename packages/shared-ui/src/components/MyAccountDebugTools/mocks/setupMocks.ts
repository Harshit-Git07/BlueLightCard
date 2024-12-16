import { mockMemberProfileGetResponse, mockMemberProfileResponse } from './mockMemberProfileGet';
import { IPlatformAdapter, V5RequestOptions, V5Response } from '../../../adapters';
import { mockMemberApplicationPost } from './mockMemberApplicationPost';
import { mockMemberApplicationPut } from './mockMemberApplicationPut';
import { mockMemberApplicationUploadDocument } from './mockMemberApplicationUploadDocument';
import { mockS3PreSignedUpload } from './mockS3PreSignedUpload';
import { mockClientSecret } from './mockClientSecret';
import { mockOrganisationGet } from './mockOrganisationGet';

const matchProfile = /members\/[^/]+\/profile$/i;
const matchApplication = /members\/[^/]+\/applications(\/[^/]+)?$/i;
const matchApplicationUpload = /members\/[^/]+\/applications\/[^/]+\/uploadDocument/i;
const matchS3PreSigned = /s3uploads/i;
const matchClientSecret = /eu\/orders\/checkout/i;
const matchOrgs = /orgs\/[^/]+/i;

const originals: { invokeV5Api?: IPlatformAdapter['invokeV5Api']; counter: number } = {
  invokeV5Api: undefined,
  counter: 0,
};

export const setupMocks = (adapter: IPlatformAdapter, inOrOut: boolean) => {
  if (!originals.invokeV5Api) originals.invokeV5Api = adapter.invokeV5Api;

  mockMemberProfileResponse.cards[0].purchaseDate = inOrOut
    ? new Date().toJSON()
    : '2023-11-27T08:55:46.030Z';
  mockMemberProfileResponse.applications = [];

  adapter.invokeV5Api = async (path: string, options: V5RequestOptions): Promise<V5Response> => {
    originals.counter++;
    const { method } = options;
    console.log(`#${originals.counter} REQ`, { method, path, options });

    const handler = async () => {
      if (matchProfile.test(path)) return mockMemberProfileGetResponse();

      if (matchApplication.test(path) && method === 'POST')
        return mockMemberApplicationPost(options);

      if (matchApplication.test(path) && method === 'PUT') return mockMemberApplicationPut(options);

      if (matchApplicationUpload.test(path)) return mockMemberApplicationUploadDocument();

      if (matchS3PreSigned.test(path)) return mockS3PreSignedUpload(path);

      if (matchClientSecret.test(path)) return mockClientSecret();

      if (matchOrgs.test(path)) return mockOrganisationGet();

      return {
        status: 0,
        data: '',
      };
    };

    const { status, data } = await handler();
    console.log(`#${originals.counter} RES`, { status, data });
    if (!status && originals.invokeV5Api) {
      console.log('USE ORIGINAL');
      return originals.invokeV5Api(path, options);
    }
    return {
      status,
      data: JSON.stringify(data),
    };
  };
};
