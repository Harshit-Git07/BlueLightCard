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

  describe('sendEmailSignup', () => {
    it('should log an error and throw if sending email fails', async () => {
      const error = new Error('Failed to send email');
      sendEmailMock.mockRejectedValue(error);

      await expect(emailService.sendEmailSignup('new@example.com')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith({
        message: 'Failed to send email',
        error,
      });
    });

    it('should send an email with the correct parameters', async () => {
      sendEmailMock.mockResolvedValue({});

      await emailService.sendEmailSignup('new@example.com');

      expectedParams.Message.Subject.Data = 'Welcome to Blue Light Card';
      expectedParams.Message.Body.Html.Data = 'signup-email body';

      expect(sendEmailMock).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('sendEmailTrustedDomain', () => {
    it('should log an error and throw if sending email fails', async () => {
      const error = new Error('Failed to send email');
      sendEmailMock.mockRejectedValue(error);

      await expect(emailService.sendEmailTrustedDomain('new@example.com')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith({
        message: 'Failed to send email',
        error,
      });
    });

    it('should send an email with the correct parameters', async () => {
      sendEmailMock.mockResolvedValue({});

      await emailService.sendEmailTrustedDomain('new@example.com');

      expectedParams.Message.Subject.Data = 'Trusted Domain Verification Request';
      expectedParams.Message.Body.Html.Data = 'trusted-domain body';

      expect(sendEmailMock).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('sendEmailPromoPayment', () => {
    it('should log an error and throw if sending email fails', async () => {
      const error = new Error('Failed to send email');
      sendEmailMock.mockRejectedValue(error);

      await expect(emailService.sendEmailPromoPayment('new@example.com')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith({
        message: 'Failed to send email',
        error,
      });
    });

    it('should send an email with the correct parameters', async () => {
      sendEmailMock.mockResolvedValue({});

      await emailService.sendEmailPromoPayment('new@example.com');

      expectedParams.Message.Subject.Data = 'Promo Code Payment Accepted';
      expectedParams.Message.Body.Html.Data = 'promo-code-payment body';

      expect(sendEmailMock).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('sendEmailPaymentMade', () => {
    it('should log an error and throw if sending email fails', async () => {
      const error = new Error('Failed to send email');
      sendEmailMock.mockRejectedValue(error);

      await expect(emailService.sendEmailPaymentMade('new@example.com')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith({
        message: 'Failed to send email',
        error,
      });
    });

    it('should send an email with the correct parameters', async () => {
      sendEmailMock.mockResolvedValue({});

      await emailService.sendEmailPaymentMade('new@example.com');

      expectedParams.Message.Subject.Data = 'Payment Made';
      expectedParams.Message.Body.Html.Data = 'payment-made body';

      expect(sendEmailMock).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('sendEmailMembershipLive', () => {
    it('should log an error and throw if sending email fails', async () => {
      const error = new Error('Failed to send email');
      sendEmailMock.mockRejectedValue(error);

      await expect(emailService.sendEmailMembershipLive('new@example.com')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith({
        message: 'Failed to send email',
        error,
      });
    });

    it('should send an email with the correct parameters', async () => {
      sendEmailMock.mockResolvedValue({});

      await emailService.sendEmailMembershipLive('new@example.com');

      expectedParams.Message.Subject.Data = 'Membership Live';
      expectedParams.Message.Body.Html.Data = 'membership-live body';

      expect(sendEmailMock).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('sendEmailCardCreated', () => {
    it('should log an error and throw if sending email fails', async () => {
      const error = new Error('Failed to send email');
      sendEmailMock.mockRejectedValue(error);

      await expect(emailService.sendEmailCardCreated('new@example.com')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith({
        message: 'Failed to send email',
        error,
      });
    });

    it('should send an email with the correct parameters', async () => {
      sendEmailMock.mockResolvedValue({});

      await emailService.sendEmailCardCreated('new@example.com');

      expectedParams.Message.Subject.Data = 'Card Created';
      expectedParams.Message.Body.Html.Data = 'card-created body';

      expect(sendEmailMock).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('sendEmailCardPosted', () => {
    it('should log an error and throw if sending email fails', async () => {
      const error = new Error('Failed to send email');
      sendEmailMock.mockRejectedValue(error);

      await expect(emailService.sendEmailCardPosted('new@example.com')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith({
        message: 'Failed to send email',
        error,
      });
    });

    it('should send an email with the correct parameters', async () => {
      sendEmailMock.mockResolvedValue({});

      await emailService.sendEmailCardPosted('new@example.com');

      expectedParams.Message.Subject.Data = 'Card Posted';
      expectedParams.Message.Body.Html.Data = 'card-posted body';

      expect(sendEmailMock).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('sendEmailRenewal', () => {
    it('should log an error and throw if sending email fails', async () => {
      const error = new Error('Failed to send email');
      sendEmailMock.mockRejectedValue(error);

      await expect(emailService.sendEmailRenewal('new@example.com')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith({
        message: 'Failed to send email',
        error,
      });
    });

    it('should send an email with the correct parameters', async () => {
      sendEmailMock.mockResolvedValue({});

      await emailService.sendEmailRenewal('new@example.com');

      expectedParams.Message.Subject.Data = 'Renewal Notice/Completion';
      expectedParams.Message.Body.Html.Data = 'renewal-notice body';

      expect(sendEmailMock).toHaveBeenCalledWith(expectedParams);
    });
  });
});
