import { DynamoDBRecord } from 'aws-lambda/trigger/dynamodb-stream';
import { MemberDocumentModel } from '@blc-mono/members/application/models/memberDocument';
import { ProfileModel } from '@blc-mono/members/application/models/profileModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { ApplicationModel } from '@blc-mono/members/application/models/applicationModel';
import { CardModel } from '@blc-mono/members/application/models/cardModel';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { logger } from '@blc-mono/members/application/middleware';
import { isAfter } from 'date-fns';

export const getDocumentFromProfileRecord = (
  record: DynamoDBRecord,
): {
  memberDocument: MemberDocumentModel | undefined;
  employerIdChanged: boolean;
  organisationIdChanged: boolean;
  profileEmployerName?: string;
} => {
  const { oldImage: oldProfile, newImage: newProfile } = unmarshallStreamImages<ProfileModel>(
    record.dynamodb,
  );

  if (record.eventName !== 'INSERT' && record.eventName !== 'MODIFY') {
    logger.info(
      `Profile record event name is not INSERT or MODIFY: ${record.eventName}. Not processing record.`,
    );
    return {
      memberDocument: undefined,
      employerIdChanged: false,
      organisationIdChanged: false,
    };
  }

  if (!newProfile) {
    throw new ValidationError(
      `New profile image not found in stream record: ${record.dynamodb?.Keys?.pk.S}`,
    );
  }

  return {
    memberDocument: {
      memberId: newProfile.memberId,
      firstName: newProfile.firstName,
      lastName: newProfile.lastName,
      email: newProfile.email,
      signupDate: newProfile.signupDate,
      organisationId: newProfile.organisationId,
      employerId: newProfile.employerId,
      userStatus: newProfile.status,
    },
    employerIdChanged:
      isNewer(newProfile.ingestionLastTriggered, oldProfile?.ingestionLastTriggered) ||
      hasChanged(newProfile.employerId, oldProfile?.employerId),
    organisationIdChanged:
      isNewer(newProfile.ingestionLastTriggered, oldProfile?.ingestionLastTriggered) ||
      hasChanged(newProfile.organisationId, oldProfile?.organisationId),
    profileEmployerName: newProfile.employerName,
  };
};

const isNewer = (newValue: string | undefined, oldValue: string | undefined): boolean => {
  return (
    newValue !== undefined &&
    (oldValue === undefined || isAfter(new Date(newValue), new Date(oldValue)))
  );
};

const hasChanged = (newValue: string | undefined, oldValue: string | undefined): boolean => {
  return newValue !== oldValue;
};

export const getDocumentFromApplicationRecord = (
  record: DynamoDBRecord,
): MemberDocumentModel | undefined => {
  const { oldImage: oldApplication, newImage: newApplication } =
    unmarshallStreamImages<ApplicationModel>(record.dynamodb);

  if (record.eventName === 'REMOVE') {
    if (!oldApplication) {
      throw new ValidationError(
        `Old application not found in stream record: ${record.dynamodb?.Keys?.pk.S}`,
      );
    }
    return {
      memberId: oldApplication.memberId,
      applicationId: '',
    };
  }

  if (record.eventName !== 'INSERT' && record.eventName !== 'MODIFY') {
    logger.info(
      `Application record event name is not INSERT or MODIFY: ${record.eventName}. Not processing record.`,
    );
    return;
  }

  if (!newApplication) {
    throw new ValidationError(
      `New application image not found in stream record: ${record.dynamodb?.Keys?.pk.S}`,
    );
  }

  return {
    memberId: newApplication.memberId,
    applicationId: newApplication.applicationId,
    startDate: newApplication.startDate,
    eligibilityStatus: newApplication.eligibilityStatus,
  };
};

export const getDocumentFromCardRecord = (
  record: DynamoDBRecord,
): MemberDocumentModel | undefined => {
  const { newImage: newCard } = unmarshallStreamImages<CardModel>(record.dynamodb);

  if (record.eventName !== 'INSERT' && record.eventName !== 'MODIFY') {
    logger.info(
      `Card record event name is not INSERT or MODIFY: ${record.eventName}. Not processing record.`,
    );
    return;
  }

  if (!newCard) {
    throw new ValidationError(
      `New card image not found in stream record: ${record.dynamodb?.Keys?.pk.S}`,
    );
  }

  return {
    memberId: newCard.memberId,
    cardNumber: newCard.cardNumber,
    expiryDate: newCard.expiryDate,
    cardStatus: newCard.cardStatus,
    paymentStatus: newCard.paymentStatus,
  };
};
