import { MemberDocumentModel } from '@blc-mono/members/application/models/memberDocument';

export type OpenSearchBulkUpdateCommand = UpdateCommand | UpdateBody;

type UpdateCommand = {
  update: {
    _id: string;
  };
};

type UpdateBody = {
  doc: MemberProfileBody;
  doc_as_upsert: boolean;
};

type MemberProfileBody = {
  memberId: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  signupDate?: string;
  organisationId?: string;
  employerId?: string;
  userStatus?: string;
  applicationId?: string;
  startDate?: string;
  eligibilityStatus?: string;
  paymentStatus?: string;
  cardNumber?: string;
  expiryDate?: string;
  cardStatus?: string;
};

export const mapMemberDocumentToOpenSearchUpdateBody = (
  memberDocument: MemberDocumentModel,
): UpdateBody => ({
  doc: {
    memberId: memberDocument.memberId,
    firstName: memberDocument.firstName,
    lastName: memberDocument.lastName,
    emailAddress: memberDocument.emailAddress,
    signupDate: memberDocument.signupDate,
    organisationId: memberDocument.organisationId,
    employerId: memberDocument.employerId,
    userStatus: memberDocument.userStatus,
    applicationId: memberDocument.applicationId,
    startDate: memberDocument.startDate,
    eligibilityStatus: memberDocument.eligibilityStatus,
    paymentStatus: memberDocument.paymentStatus,
    cardNumber: memberDocument.cardNumber,
    expiryDate: memberDocument.expiryDate,
    cardStatus: memberDocument.cardStatus,
  },
  doc_as_upsert: true,
});

export const createMemberProfileOpenSearchDocuments = (
  items: MemberDocumentModel[],
): OpenSearchBulkUpdateCommand[] => {
  const result: OpenSearchBulkUpdateCommand[] = [];
  items.forEach((item) => {
    result.push({ update: { _id: item.memberId } });
    result.push(mapMemberDocumentToOpenSearchUpdateBody(item));
  });

  return result;
};
