import { EventBridgeEvent, StreamRecord } from 'aws-lambda';
import { eventBusMiddleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { getMemberApiUrlFromParameterStore } from '@blc-mono/members/application/providers/ParameterStore';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';
import { profileService } from '@blc-mono/members/application/services/profileService';
import { emailService } from '@blc-mono/members/application/services/email/emailService';
import { logger } from '@blc-mono/members/application/utils/logging/Logger';

export const unwrappedHandler = async (
  event: EventBridgeEvent<string, StreamRecord>,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_EMAIL) !== 'true') {
    logger.info({ message: 'Email events disabled, skipping...' });
    return;
  }

  const newImage = event.detail['NewImage'];
  if (!newImage) {
    throw new Error('Required "NewImage" is not found in event');
  }

  const memberUuid = newImage['memberId']['S'];
  if (!memberUuid) {
    throw new Error('Required "memberId" is not found in event');
  }

  const eventType = event['detail-type'];
  logger.info({ message: `Processing event: '${eventType}'` });

  switch (eventType) {
    case MemberEvent.EMAIL_SIGNUP: {
      const profile = await profileService().getProfile(memberUuid);

      await emailService().sendEmail('activation_email', {
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

      const memberApiUrl = getMemberApiUrlFromParameterStore();
      if (!memberApiUrl) {
        throw new Error(
          'The member API endpoint is not configured properly on the parameter store',
        );
      }

      const profile = await profileService().getProfile(memberUuid);
      await emailService().sendTrustedDomainEmail(profile, memberApiUrl);
      break;
    }
    case MemberEvent.EMAIL_GENIE_CHECKS:
      // TODO: define what this actually means
      break;
    case MemberEvent.EMAIL_PROMO_PAYMENT: {
      const profile = await profileService().getProfile(memberUuid);

      await emailService().sendEmail('promo_payment', {
        email: profile.email,
        subject: 'Promo Code Payment Accepted',
        content: {
          F_Name: profile.firstName,
        },
      });
      break;
    }
    case MemberEvent.EMAIL_PAYMENT_MADE: {
      const profile = await profileService().getProfile(memberUuid);

      await emailService().sendEmail('payment_made', {
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
      const profile = await profileService().getProfile(memberUuid);

      await emailService().sendEmail('card_posted', {
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
