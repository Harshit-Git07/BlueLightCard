export const idVerificationText = {
  intro: {
    default: 'Verify your eligibility with a valid ID or email.',
    withSupporting: 'Verify your eligibility with your work contract and one supporting document.',
  },
  title: 'Request new card',
  docsWillBeDeleted: 'Any documents uploaded will be deleted from our servers.',
};
/*
export const getVerificationMethods = (isDoubleId: boolean) => {
  if (isDoubleId) {
    return {
      methods: [
        IdVerificationMethod.PAYSLIP,
        IdVerificationMethod.NHS_SMART_CARD,
        IdVerificationMethod.WORK_ID_CARD,
      ],
      mandatory: IdVerificationMethod.WORK_CONTRACT,
    };
  }

  return {
    methods: [
      IdVerificationMethod.WORK_EMAIL,
      IdVerificationMethod.PAYSLIP,
      IdVerificationMethod.NHS_SMART_CARD,
      IdVerificationMethod.WORK_ID_CARD,
    ],
    mandatory: null,
  };
};

export const verificationMethods: Record<IdVerificationMethod, IdVerificationDetail> = {
  [IdVerificationMethod.WORK_EMAIL]: {
    title: 'Work Email',
    description: 'Provide your work email to be verified',
    detail: 'Must show XXXXXXX\nMust show your full name',
    tag: {
      infoMessage: 'Fast',
      iconLeft: faCircleBolt,
      state: 'Success',
    },
  },
  [IdVerificationMethod.NHS_SMART_CARD]: {
    title: 'NHS Smart Card',
    description: 'Upload a picture of your NHS Smart Card',
    detail: 'Must show XXXXXXX\nMust show your full name',
  },
  [IdVerificationMethod.PAYSLIP]: {
    title: 'Payslip',
    description: 'Upload a picture of your payslip',
    detail: 'Must show XXXXXXX\nMust show your full name',
  },
  [IdVerificationMethod.WORK_ID_CARD]: {
    title: 'Work ID Card',
    description: 'Upload a picture of your Work ID Card',
    detail: 'Must show NHS/HSC\nMust show your full name',
  },
  [IdVerificationMethod.WORK_CONTRACT]: {
    title: 'Work Contract',
    description: 'Upload a picture of your work contract',
  },
};
*/
