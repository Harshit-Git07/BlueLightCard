export type VaultThresholdBodyParams = {
  subject: string;
  offerId: string;
  companyName: string;
  offerName: string;
  thresholdPercentage: number;
  alertBelow: number;
  remainingCodes: number;
};

export const vaultThresholdCreatedBody = (params: VaultThresholdBodyParams): string => {
  const lines = [
    `Offer ID: ${params.offerId}`,
    `Company Name: ${params.companyName}`,
    `Offer Name: ${params.offerName}`,
    `Threshold: ${params.thresholdPercentage}%`,
    `Alert below: ${params.alertBelow}`,
    `Remaining codes: ${params.remainingCodes}`,
  ];

  const body = lines.map((line) => `<p>${line}</p>`).join('\n');
  return `<html><head><title>${params.subject}</title></head><body><h1>${params.subject}</h1>${body}</body></html>`;
};
