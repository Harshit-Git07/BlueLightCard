import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { EmailModel } from '@blc-mono/shared/models/members/emailModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { isEmailTemplate } from '@blc-mono/members/application/types/emailTypes';
import { emailService } from '@blc-mono/members/application/services/email/emailService';

const unwrappedHandler = async (event: APIGatewayProxyEvent) => {
  if (!event.body) {
    throw new ValidationError('Body is required');
  }
  const { emailType, payload }: EmailModel = JSON.parse(event.body);

  if (!isEmailTemplate(emailType)) {
    throw new ValidationError('Email Type not found in body');
  }

  if (!payload) {
    throw new ValidationError('Payload not found in body');
  }
  return await emailService().sendEmail(emailType, payload);
};

export const handler = middleware(unwrappedHandler);
