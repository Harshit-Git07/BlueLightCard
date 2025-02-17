import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { NoteModel } from '@blc-mono/shared/models/members/noteModel';

const service = new ProfileService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<NoteModel[]> => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  return await service.getNotes(memberId);
};

export const handler = middleware(unwrappedHandler);
