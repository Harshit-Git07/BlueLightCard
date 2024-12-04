import { SES } from '@aws-sdk/client-ses';
import { EmailService } from '../emailService';
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { logger } from '../../middleware';
import { emailChangeRequestBody } from '@blc-mono/members/libs/emailTemplates/emailChangeRequest';

jest.mock('@aws-sdk/client-ses');
jest.mock('@blc-mono/core/utils/getEnv');
jest.mock('../../middleware');
jest.mock('@blc-mono/members/libs/emailTemplates/emailChangeRequest');

describe('EmailService', () => {
  let emailService: EmailService;
  let sendEmailMock: jest.Mock;
  const expectedParams = {
    Source: 'test@example.com',
    Destination: {
      ToAddresses: ['new@example.com'],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: emailChangeRequestBody({ subject: 'Change Email Request' }),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Change Email Request',
      },
    },
  };

  beforeEach(() => {
    (getEnvOrDefault as jest.Mock).mockReturnValue('test@example.com');
    sendEmailMock = jest.fn();
    (SES as jest.Mock).mockImplementation(() => ({
      sendEmail: sendEmailMock,
    }));
    emailService = new EmailService();
  });

  describe('sendEmailChangeRequest', () => {
    it('should log an error and throw if sending email fails', async () => {
      const error = new Error('Failed to send email');
      sendEmailMock.mockRejectedValue(error);

      await expect(emailService.sendEmailChangeRequest('new@example.com')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith({
        message: 'Failed to send email',
        error,
      });
    });

    it('should send an email with the correct parameters', async () => {
      sendEmailMock.mockResolvedValue({});

      await emailService.sendEmailChangeRequest('new@example.com');

      expect(sendEmailMock).toHaveBeenCalledWith(expectedParams);
    });
  });
});
