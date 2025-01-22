import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { UpdateNoteModel } from '@blc-mono/shared/models/members/noteModel';

const service = new ProfileService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  const { memberId, noteId } = event.pathParameters || {};
  if (!memberId || !noteId) {
    throw new ValidationError('Member ID and Note ID are required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const note = UpdateNoteModel.parse(JSON.parse(event.body));
  await service.updateNote(memberId, noteId, note);
};

export const handler = middleware(unwrappedHandler);
