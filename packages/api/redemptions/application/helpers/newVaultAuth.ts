import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import aesjs from 'aes-js';
import { randomBytes } from 'crypto';
import * as pkcs7 from 'pkcs7';

export type Secrets = {
  codeRedeemedPassword: string;
  codeRedeemedData: string;
  checkAmountIssuedData: string;
  checkAmountIssuedPassword: string;
  assignUserCodesData: string;
  assignUserCodesPassword: string;
};

export const generateKey = (data: string, password: string): string => {
  const dataBytes = aesjs.utils.utf8.toBytes(data);
  const passwordBytes = aesjs.utils.utf8.toBytes(password);
  const ivBytes = randomBytes(16);
  // eslint-disable-next-line new-cap
  const aesCbc = new aesjs.ModeOfOperation.cbc(passwordBytes, ivBytes); // PHP uses AES-128-CBC
  const encryptedBytes = aesCbc.encrypt(pkcs7.pad(dataBytes)); // pad as PHP function is OPENSSL_RAW_DATA (option=1)
  const encHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  const ivHex = aesjs.utils.hex.fromBytes(ivBytes);
  const hex = encHex + ivHex; // concat as PHP code does and lambda-scripts repo breaks out
  const buf = Buffer.from(hex, 'hex');
  return buf.toString('base64');
};

export const getKeysFromSecretManager = async (secretManagerName: string): Promise<Secrets> => {
  const client = new SecretsManagerClient({
    region: 'eu-west-2',
  });

  const awsResponse = await client.send(
    new GetSecretValueCommand({
      SecretId: secretManagerName,
    }),
  );

  const codeRedemptionSecrets: Secrets = awsResponse.SecretString ? JSON.parse(awsResponse.SecretString) : {};

  return codeRedemptionSecrets;
};
