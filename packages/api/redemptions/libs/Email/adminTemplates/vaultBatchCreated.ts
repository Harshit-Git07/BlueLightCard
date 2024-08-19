export type VaultBatchCreatedBodyParams = {
  subject: string;
  vaultId: string;
  batchId: string;
  fileName: string;
  countCodeInsertSuccess: number;
  countCodeInsertFail: number;
  codeInsertFailArray: string[] | null;
};

export const vaultBatchCreatedBody = (params: VaultBatchCreatedBodyParams): string => {
  const para1 = `<p>Codes uploaded to vault offer.</p>`;
  const para2 = `<p>Vault ID: (${params.vaultId}).</p>`;
  const para3 = `<p>Batch ID: (${params.batchId}).</p>`;
  const para4 = `<p>File name: (${params.fileName}).</p>`;
  const para5 = `<p>The total number of codes inserted was (${params.countCodeInsertSuccess}).</p>`;
  const para6 = `<p>The total number of codes that failed to be inserted was (${params.countCodeInsertFail}).</p>`;
  let body;
  if (params.codeInsertFailArray === null) {
    body = `${para1}${para2}${para3}${para4}${para5}${para6}`;
  } else {
    const failedCodes = JSON.stringify(params.codeInsertFailArray);
    const para7 = `<p>Codes that failed to insert: ${failedCodes}</p>`;
    body = `${para1}${para2}${para3}${para4}${para5}${para6}${para7}`;
  }
  return `<html><head><title>${params.subject}</title></head><body>${body}</body></html>`;
};
