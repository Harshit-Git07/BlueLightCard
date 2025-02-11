import { EventBridgeEvent, StreamRecord } from 'aws-lambda';
import { eventBusMiddleware, logger } from '../../middleware';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { ProfileRepository } from '@blc-mono/members/application/repositories/profileRepository';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { EmailService } from '@blc-mono/members/application/services/emailService';

export const unwrappedHandler = async (
  event: EventBridgeEvent<string, StreamRecord>,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_EMAIL) !== 'true') {
    logger.info({ message: 'Email events disabled, skipping...' });
    return;
  }

  const emailService = new EmailService();
  const profileRepository = new ProfileRepository();

  const newImage = event.detail['NewImage'];
  if (!newImage) {
    throw new Error('Required "NewImage" is not found in event');
  }

  const memberUuid = newImage['memberId']['S'];
  if (!memberUuid) {
    throw new Error('Required "memberId" is not found in event');
  }

  const profile = await profileRepository.getProfile(memberUuid);

  switch (event['detail-type']) {
    case MemberEvent.EMAIL_SIGNUP: {
      await emailService.sendEmail('activation_email', {
        email: profile.email,
        subject: 'Welcome to Blue Light Card',
        content: {
          F_Name: profile.firstName,
        },
      });
      break;
    }
    case MemberEvent.EMAIL_TRUSTED_DOMAIN: {
      const trustedDomainEmail = newImage['trustedDomainEmail']['S'];
      if (!trustedDomainEmail) {
        throw new Error('Required "trustedDomainEmail" is not found in event');
      }

      await emailService.sendEmail('trusted_domain_work_email', {
        email: trustedDomainEmail,
        subject: 'Trusted Domain Verification Request',
        content: {
          F_Name: profile.firstName,
        },
      });
      break;
    }
    case MemberEvent.EMAIL_GENIE_CHECKS:
      // TODO: define what this actually means
      break;
    case MemberEvent.EMAIL_PROMO_PAYMENT: {
      await emailService.sendEmail('promo_payment', {
        email: profile.email,
        subject: 'Promo Code Payment Accepted',
        content: {
          F_Name: profile.firstName,
        },
      });
      break;
    }
    case MemberEvent.EMAIL_PAYMENT_MADE: {
      await emailService.sendEmail('payment_made', {
        email: profile.email,
        subject: 'Payment Made',
        content: {
          F_Name: profile.firstName,
        },
      });
      break;
    }
    case MemberEvent.EMAIL_MEMBERSHIP_LIVE: {
      // TODO: Figure out what email this should send https://bluelightcard.atlassian.net/browse/MM-538
      // await emailService.sendEmail('TODO: Unknown', {
      //   email: profile.email,
      //   subject: 'Membership Live',
      //   content: {
      //     F_Name: profile.firstName,
      //   },
      // });
      break;
    }
    case MemberEvent.EMAIL_CARD_CREATED: {
      // TODO: Figure out what email this should send https://bluelightcard.atlassian.net/browse/MM-538
      // await emailService.sendEmail('TODO: Unknown', {
      //   email: profile.email,
      //   subject: 'Card Created',
      //   content: {
      //     F_Name: profile.firstName,
      //   },
      // });
      break;
    }
    case MemberEvent.EMAIL_CARD_POSTED: {
      await emailService.sendEmail('card_posted', {
        email: profile.email,
        subject: 'Card Posted',
        content: {
          F_Name: profile.firstName,
        },
      });
      break;
    }
    case MemberEvent.EMAIL_RENEWAL: {
      // TODO: Figure out what email this should send https://bluelightcard.atlassian.net/browse/MM-538
      // await emailService.sendEmail('TODO: Unknown', {
      //   email: profile.email,
      //   subject: 'Renewal Notice/Completion',
      //   content: {
      //     F_Name: profile.firstName,
      //   },
      // });
      break;
    }
  }
};

export const handler = eventBusMiddleware(unwrappedHandler);
