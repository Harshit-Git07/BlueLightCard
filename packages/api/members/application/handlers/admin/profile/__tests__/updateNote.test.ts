import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { UpdateNoteModel } from '@blc-mono/members/application/models/noteModel';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/profileService');

describe('updateNote handler', () => {
  const memberId = uuidv4();
  const noteId = uuidv4();
  const note: UpdateNoteModel = {
    text: 'Updated note content',
  };
  const event = {
    pathParameters: { memberId, noteId },
    body: JSON.stringify(note),
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ProfileService.prototype.updateNote = jest.fn().mockResolvedValue(undefined);
  });

  it('should return 400 if memberId or noteId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing', async () => {
    const event = { pathParameters: { memberId, noteId } } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful update', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(204);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../updateNote')).handler(event, emptyContextStub);
}
