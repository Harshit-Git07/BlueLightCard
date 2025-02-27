import * as getEnvModule from '@blc-mono/core/utils/getEnv';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { MemberDocumentModel } from '@blc-mono/shared/models/members/memberDocument';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { MembersOpenSearchService } from '@blc-mono/members/application/handlers/admin/search/service/membersOpenSearchService';

jest.spyOn(getEnvModule, 'getEnv').mockImplementation((input: string) => input.toLowerCase());

jest.mock('@blc-mono/core/utils/getEnv');
jest.mock('@blc-mono/members/application/handlers/admin/search/service/membersOpenSearchService');

describe('memberSearch handler', () => {
  const memberId = uuidv4();
  const memberDocument: MemberDocumentModel = {
    memberId,
    firstName: 'John',
    lastName: 'Doe',
  };

  const queryParams = { pageIndex: 1, firstName: 'John', lastName: 'Doe' };

  const event = {
    queryStringParameters: queryParams,
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    MembersOpenSearchService.prototype.searchProfiles = jest.fn().mockResolvedValue({
      results: [memberDocument],
      pageNumber: 1,
      totalResults: 1,
    });
  });

  it('should return 200 with member document data on successful retrieval', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({
      results: [memberDocument],
      pageNumber: 1,
      totalResults: 1,
    });
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../memberSearch')).handler(event, emptyContextStub);
}
