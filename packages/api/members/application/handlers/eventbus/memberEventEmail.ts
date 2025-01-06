import { Context, EventBridgeEvent, StreamRecord } from 'aws-lambda';
import { eventBusMiddleware, logger } from '../../middleware';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { EmailService } from '@blc-mono/members/application/email/emailService';
import { MemberEvent } from '@blc-mono/members/application/models/enums/MemberEvent';
import { ProfileRepository } from '@blc-mono/members/application/repositories/profileRepository';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export const unwrappedHandler = async (
  event: EventBridgeEvent<any, any>,
  context: Context,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_EMAIL) !== 'true') {
    return;
  }

  const emailClient: EmailService = new EmailService();
  const profileRepository: ProfileRepository = new ProfileRepository();
  const memberUuid = event.detail['NewImage']['memberId']['S'];

  switch (event['detail-type']) {
    case MemberEvent.EMAIL_SIGNUP:
      profileRepository.getProfile(memberUuid).then((profile) => {
        emailClient.sendEmailSignup(profile.email);
      });
      break;
    case MemberEvent.EMAIL_TRUSTED_DOMAIN:
      const trustedDomainEmail = event.detail['NewImage']['trustedDomainEmail']['S'];
      await emailClient.sendEmailTrustedDomain(trustedDomainEmail);
      break;
    case MemberEvent.EMAIL_GENIE_CHECKS:
      // TODO - define what this actually means
      break;
    case MemberEvent.EMAIL_PROMO_PAYMENT:
      profileRepository.getProfile(memberUuid).then((profile) => {
        emailClient.sendEmailPromoPayment(profile.email);
      });
      break;
    case MemberEvent.EMAIL_PAYMENT_MADE:
      profileRepository.getProfile(memberUuid).then((profile) => {
        emailClient.sendEmailPaymentMade(profile.email);
      });
      break;
    case MemberEvent.EMAIL_MEMBERSHIP_LIVE:
      profileRepository.getProfile(memberUuid).then((profile) => {
        emailClient.sendEmailMembershipLive(profile.email);
      });
      break;
    case MemberEvent.EMAIL_CARD_CREATED:
      profileRepository.getProfile(memberUuid).then((profile) => {
        emailClient.sendEmailCardCreated(profile.email);
      });
      break;
    case MemberEvent.EMAIL_CARD_POSTED:
      profileRepository.getProfile(memberUuid).then((profile) => {
        emailClient.sendEmailCardPosted(profile.email);
      });
      break;
    case MemberEvent.EMAIL_RENEWAL:
      profileRepository.getProfile(memberUuid).then((profile) => {
        emailClient.sendEmailRenewal(profile.email);
      });
      break;
  }
};

export const handler = eventBusMiddleware(unwrappedHandler);
