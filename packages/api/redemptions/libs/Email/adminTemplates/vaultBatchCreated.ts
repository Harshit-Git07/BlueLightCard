export type VaultBatchCreatedBodyParams = {
  subject: string;
  vaultId: string;
  batchId: string;
  fileName: string;
  numberOfCodeInsertSuccesses: number;
  numberOfCodeInsertFailures: number;
  codeInsertFailArray: string[] | null;
  numberOfDuplicateCodes: number;
};

export const vaultBatchCreatedBody = (params: VaultBatchCreatedBodyParams): string => {
  const para1 = `<p>Codes uploaded to vault offer.</p>`;
  const para2 = `<p>Vault ID: (${params.vaultId}).</p>`;
  const para3 = `<p>Batch ID: (${params.batchId}).</p>`;
  const para4 = `<p>File name: (${params.fileName}).</p>`;
  const para5 = `<p>The total number of codes inserted was (${params.numberOfCodeInsertSuccesses}).</p>`;
  const para6 = `<p>The total number of codes that failed to be inserted was (${params.numberOfCodeInsertFailures}).</p>`;
  const duplicatesParagraph = `<p>The total number of duplicate codes was (${params.numberOfDuplicateCodes}).</p>`;
  let body;
  if (params.codeInsertFailArray === null) {
    body = `${para1}${para2}${para3}${para4}${para5}${para6}`;
  } else {
    const failedCodes = JSON.stringify(params.codeInsertFailArray);
    const para7 = `<p>Codes that failed to insert: ${failedCodes}</p>`;
    body = `${para1}${para2}${para3}${para4}${para5}${para6}${para7}${duplicatesParagraph}`;
  }
  return `<html><head><title>${params.subject}</title></head><body>${body}</body></html>`;
};
