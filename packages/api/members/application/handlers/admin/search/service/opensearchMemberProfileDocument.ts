import { MemberDocumentModel } from '@blc-mono/members/application/models/memberDocument';

export type OpenSearchBulkUpdateCommand = UpdateCommand | UpdateBody;

type UpdateCommand = {
  update: {
    _id: string;
  };
};

type UpdateBody = {
  doc: MemberDocumentModel;
  doc_as_upsert: boolean;
};

export const mapMemberDocumentToOpenSearchUpdateBody = (
  memberDocument: MemberDocumentModel,
): UpdateBody => ({
  doc: {
    memberId: memberDocument.memberId,
    firstName: memberDocument.firstName,
    lastName: memberDocument.lastName,
    email: memberDocument.email,
    signupDate: memberDocument.signupDate,
    organisationId: memberDocument.organisationId,
    organisationName: memberDocument.organisationName,
    employerId: memberDocument.employerId,
    employerName: memberDocument.employerName,
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
