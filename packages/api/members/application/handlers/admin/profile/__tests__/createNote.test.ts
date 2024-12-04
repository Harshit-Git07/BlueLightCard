import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import {
  CreateNoteModel,
  CreateNoteModelResponse,
} from '@blc-mono/members/application/models/noteModel';

jest.mock('@blc-mono/members/application/services/profileService');

describe('createNote handler', () => {
  const memberId = uuidv4();
  const note: CreateNoteModel = {
    text: 'New note content',
  };
  const noteId = uuidv4();
  const event = {
    pathParameters: { memberId },
    body: JSON.stringify(note),
  } as unknown as APIGatewayProxyEvent;
  const context = {} as Context;

  beforeEach(() => {
    ProfileService.prototype.createNote = jest.fn().mockResolvedValue(noteId);
  });

  it('should return 400 if memberId is missing', async () => {
    const event = { pathParameters: {} } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing', async () => {
    const event = { pathParameters: { memberId } } as unknown as APIGatewayProxyEvent;
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(400);
  });

  it('should return 200 with noteId on successful creation', async () => {
    const response = await handler(event, context);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({ noteId });
  });
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return (await import('../createNote')).handler(event, context);
}
