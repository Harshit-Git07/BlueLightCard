import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';
import { EmailModel } from '@blc-mono/members/application/models/emailModel';
import { EmailService } from '@blc-mono/members/application/services/emailService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new EmailService();

const unwrappedHandler = async (event: APIGatewayProxyEvent) => {
  if (!event.body) {
    throw new ValidationError('Body is required');
  }
  const { emailType, payload }: EmailModel = JSON.parse(event.body);

  if (!emailType) {
    throw new ValidationError('Email Type not found in body');
  }

  if (!payload) {
    throw new ValidationError('Payload not found in body');
  }
  return await service.sendEmail(emailType, payload);
};

export const handler = middleware(unwrappedHandler);
