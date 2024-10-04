import { exec } from 'child_process';
import { promisify } from 'util';

// Dom added this script but it's not clear where or how we can use it. Let's discuss this once he's back.

const secretName = process.argv[1];

const promiseExec = promisify(exec);

switch (secretName) {
  case 'blc-mono-redemptions/NewVaultSecrets': // BLC_UK
    await promiseExec(
      [
        'aws secretsmanager create-secret',
        '--name blc-mono-redemptions/NewVaultSecrets',
        `--secret-string "${JSON.stringify({
          codeRedeemedData: 'secrets.CODE_REDEEMED_DATA',
          codeRedeemedPassword: 'secrets.CODE_REDEEMED_PASSWORD',
          assignUserCodesData: 'secrets.ASSIGN_USER_CODES_DATA',
          assignUserCodesPassword: 'secrets.ASSIGN_USER_CODES_PASSWORD',
          checkAmountIssuedData: 'secrets.CHECK_AMOUNT_ISSUED_DATA',
          checkAmountIssuedPassword: 'secrets.CHECK_AMOUNT_ISSUED_PASSWORD',
          retrieveAllVaultsData: 'secrets.RETRIEVE_ALL_VAULTS_DATA',
          retrieveAllVaultsPassword: 'secrets.RETRIEVE_ALL_VAULTS_PASSWORD',
          viewVaultBatchesData: 'secrets.VIEW_VAULT_BATCHES_DATA',
          viewVaultBatchesPassword: 'secrets.VIEW_VAULT_BATCHES_PASSWORD',
          checkVaultStockData: 'secrets.CHECK_VAULT_STOCK_DATA',
          checkVaultStockPassword: 'secrets.CHECK_VAULT_STOCK_PASSWORD',
          brazeApiKey: 'secrets.BRAZE_API_KEY',
        })}"`,
      ].join(' '),
    );
    break;
  case 'blc-mono-redemptions/NewVaultSecrets-blc-au': // BLC_AU
    await promiseExec(
      [
        'aws secretsmanager create-secret',
        '--name blc-mono-redemptions/NewVaultSecrets-blc-au',
        `--secret-string "${JSON.stringify({
          codeRedeemedData: 'secrets.CODE_REDEEMED_DATA',
          codeRedeemedPassword: 'secrets.CODE_REDEEMED_PASSWORD',
          assignUserCodesData: 'secrets.ASSIGN_USER_CODES_DATA',
          assignUserCodesPassword: 'secrets.ASSIGN_USER_CODES_PASSWORD',
          checkAmountIssuedData: 'secrets.CHECK_AMOUNT_ISSUED_DATA',
          checkAmountIssuedPassword: 'secrets.CHECK_AMOUNT_ISSUED_PASSWORD',
          retrieveAllVaultsData: 'secrets.RETRIEVE_ALL_VAULTS_DATA',
          retrieveAllVaultsPassword: 'secrets.RETRIEVE_ALL_VAULTS_PASSWORD',
          viewVaultBatchesData: 'secrets.VIEW_VAULT_BATCHES_DATA',
          viewVaultBatchesPassword: 'secrets.VIEW_VAULT_BATCHES_PASSWORD',
          checkVaultStockData: 'secrets.CHECK_VAULT_STOCK_DATA',
          checkVaultStockPassword: 'secrets.CHECK_VAULT_STOCK_PASSWORD',
          brazeApiKey: 'secrets.BRAZE_API_KEY',
        })}"`,
      ].join(' '),
    );
    break;
  case 'blc-mono-redemptions/NewVaultSecrets-dds-uk': // DDS_UK
    await promiseExec(
      [
        'aws secretsmanager create-secret',
        '--name blc-mono-redemptions/NewVaultSecrets-dds-uk',
        `--secret-string "${JSON.stringify({
          codeRedeemedData: 'secrets.CODE_REDEEMED_DATA',
          codeRedeemedPassword: 'secrets.CODE_REDEEMED_PASSWORD',
          assignUserCodesData: 'secrets.ASSIGN_USER_CODES_DATA',
          assignUserCodesPassword: 'secrets.ASSIGN_USER_CODES_PASSWORD',
          checkAmountIssuedData: 'secrets.CHECK_AMOUNT_ISSUED_DATA',
          checkAmountIssuedPassword: 'secrets.CHECK_AMOUNT_ISSUED_PASSWORD',
          retrieveAllVaultsData: 'secrets.RETRIEVE_ALL_VAULTS_DATA',
          retrieveAllVaultsPassword: 'secrets.RETRIEVE_ALL_VAULTS_PASSWORD',
          viewVaultBatchesData: 'secrets.VIEW_VAULT_BATCHES_DATA',
          viewVaultBatchesPassword: 'secrets.VIEW_VAULT_BATCHES_PASSWORD',
          checkVaultStockData: 'secrets.CHECK_VAULT_STOCK_DATA',
          checkVaultStockPassword: 'secrets.CHECK_VAULT_STOCK_PASSWORD',
          brazeApiKey: 'secrets.BRAZE_API_KEY',
        })}"`,
      ].join(' '),
    );
    break;
}
