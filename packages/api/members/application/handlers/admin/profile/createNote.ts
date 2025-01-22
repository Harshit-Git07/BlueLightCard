import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import {
  CreateNoteModel,
  CreateNoteModelResponse,
} from '@blc-mono/shared/models/members/noteModel';

const service = new ProfileService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<CreateNoteModelResponse> => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const note = CreateNoteModel.parse(JSON.parse(event.body));
  const noteId = await service.createNote(memberId, note);
  return CreateNoteModelResponse.parse({ noteId });
};

export const handler = middleware(unwrappedHandler);
