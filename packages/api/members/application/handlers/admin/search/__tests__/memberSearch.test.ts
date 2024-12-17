import * as getEnvModule from '@blc-mono/core/utils/getEnv';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import {
  MemberDocumentModel,
  MemberDocumentsSearchModel,
} from '@blc-mono/members/application/models/memberDocument';
import { MembersOpenSearchService } from '../service/membersOpenSearchService';

jest.spyOn(getEnvModule, 'getEnv').mockImplementation((input: string) => input.toLowerCase());

jest.mock('@blc-mono/core/utils/getEnv');
jest.mock('../service/membersOpenSearchService');

describe('memberSearch handler', () => {
  const memberId = uuidv4();
  const searchBody: MemberDocumentsSearchModel = {
    pageIndex: 1,
    firstName: 'John',
    lastName: 'Doe',
  };
  const memberDocument: MemberDocumentModel = {
    memberId,
    firstName: 'John',
    lastName: 'Doe',
  };
  const event = { body: JSON.stringify(searchBody) } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    MembersOpenSearchService.prototype.searchProfiles = jest.fn().mockResolvedValue({
      results: [memberDocument],
      pageNumber: 1,
      totalResults: 1,
    });
  });

  it('should return 400 if request body is missing', async () => {
    const event = { body: undefined } as unknown as APIGatewayProxyEvent;

    const response = await handler(event, context);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing required parameters', async () => {
    const event = { body: JSON.stringify({}) } as unknown as APIGatewayProxyEvent;

    const response = await handler(event, context);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with member document data on successful retrieval', async () => {
    const response = await handler(event, context);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({
      results: [memberDocument],
      pageNumber: 1,
      totalResults: 1,
    });
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../memberSearch')).handler(event, context);
}
