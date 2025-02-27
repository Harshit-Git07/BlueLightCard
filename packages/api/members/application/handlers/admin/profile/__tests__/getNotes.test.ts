import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { NoteModel } from '@blc-mono/shared/models/members/noteModel';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/profileService');

describe('getNotes handler', () => {
  const memberId = uuidv4();
  const notes: NoteModel[] = [
    { noteId: uuidv4(), text: 'Note 1' },
    { noteId: uuidv4(), text: 'Note 2' },
  ];
  const event = { pathParameters: { memberId } } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ProfileService.prototype.getNotes = jest.fn().mockResolvedValue(notes);
  });

  it('should return 400 if memberId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with notes data on successful retrieval', async () => {
    const response = await handler(event);

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(notes);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../getNotes')).handler(event, emptyContextStub);
}
