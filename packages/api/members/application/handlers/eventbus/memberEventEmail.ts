import { EventBridgeEvent, StreamRecord } from 'aws-lambda';
import { eventBusMiddleware } from '../../middleware';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { EmailService } from '@blc-mono/members/application/email/emailService';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { ProfileRepository } from '@blc-mono/members/application/repositories/profileRepository';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export const unwrappedHandler = async (
  event: EventBridgeEvent<string, StreamRecord>,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_EMAIL) !== 'true') {
    return;
  }

  const emailClient: EmailService = new EmailService();
  const profileRepository: ProfileRepository = new ProfileRepository();

  const newImage = event.detail['NewImage'];
  if (!newImage) {
    throw new Error('Required "NewImage" is not found in event');
  }

  const memberUuid = newImage['memberId']['S'];
  if (!memberUuid) {
    throw new Error('Required "memberId" is not found in event');
  }

  switch (event['detail-type']) {
    case MemberEvent.EMAIL_SIGNUP:
      profileRepository.getProfile(memberUuid).then((profile) => {
        emailClient.sendEmailSignup(profile.email);
      });
      break;
    case MemberEvent.EMAIL_TRUSTED_DOMAIN: {
      const trustedDomainEmail = newImage['trustedDomainEmail']['S'];
      if (!trustedDomainEmail) {
        throw new Error('Required "trustedDomainEmail" is not found in event');
      }

      await emailClient.sendEmailTrustedDomain(trustedDomainEmail);
      break;
    }
    case MemberEvent.EMAIL_GENIE_CHECKS:
      // TODO: define what this actually means
      break;
    case MemberEvent.EMAIL_PROMO_PAYMENT: {
      const profile = await profileRepository.getProfile(memberUuid);
      await emailClient.sendEmailPromoPayment(profile.email);
      break;
    }
    case MemberEvent.EMAIL_PAYMENT_MADE: {
      const profile = await profileRepository.getProfile(memberUuid);
      await emailClient.sendEmailPaymentMade(profile.email);
      break;
    }
    case MemberEvent.EMAIL_MEMBERSHIP_LIVE: {
      const profile = await profileRepository.getProfile(memberUuid);
      await emailClient.sendEmailMembershipLive(profile.email);
      break;
    }
    case MemberEvent.EMAIL_CARD_CREATED: {
      const profile = await profileRepository.getProfile(memberUuid);
      await emailClient.sendEmailCardCreated(profile.email);
      break;
    }
    case MemberEvent.EMAIL_CARD_POSTED: {
      const profile = await profileRepository.getProfile(memberUuid);
      await emailClient.sendEmailCardPosted(profile.email);
      break;
    }
    case MemberEvent.EMAIL_RENEWAL: {
      const profile = await profileRepository.getProfile(memberUuid);
      await emailClient.sendEmailRenewal(profile.email);
      break;
    }
  }
};

export const handler = eventBusMiddleware(unwrappedHandler);
