import {
  CognitoIdentityProviderClient,
  DescribeUserPoolCommand,
  DescribeUserPoolDomainCommand,
  DomainDescriptionType,
  SetUICustomizationCommand,
  UserPoolType,
} from '@aws-sdk/client-cognito-identity-provider';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import {
  CdkCustomResourceHandler,
  CdkCustomResourceIsCompleteHandler,
  CdkCustomResourceIsCompleteResponse,
  CdkCustomResourceIsCompleteEvent,
} from 'aws-lambda';
import * as runtypes from 'runtypes';
import { IdentityStackEnvironmentKeys } from 'src/utils/IdentityStackEnvironmentKeys';
import { Readable } from 'stream';
import streamBuffers from 'stream-buffers';

const s3ResourceLocatorRuntype = runtypes.Record({
  bucketName: runtypes.String,
  objectKey: runtypes.String,
});

export const updateCognitoUiPropertiesRuntype = runtypes.Record({
  userPoolId: runtypes.String,
  userPoolClientId: runtypes.String,
  cssLocator: s3ResourceLocatorRuntype,
  logoLocator: s3ResourceLocatorRuntype,
});

export type S3ResourceLocator = runtypes.Static<typeof s3ResourceLocatorRuntype>;

export type UpdateCognitoUiProperties = runtypes.Static<typeof updateCognitoUiPropertiesRuntype>;

const region = getEnv(IdentityStackEnvironmentKeys.REGION);
const s3Client = new S3Client({ region: region });
const cognitoClient = new CognitoIdentityProviderClient({
  region: region,
});

export const eventHandler: CdkCustomResourceHandler = async (event) => {
  const { userPoolId } = event.ResourceProperties;

  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      return {
        PhysicalResourceId: userPoolId + '-' + new Date().toISOString(),
      };

    case 'Delete':
      return {
        PhysicalResourceId: event.PhysicalResourceId,
      };
  }
};

export const handler: CdkCustomResourceIsCompleteHandler = async (event) => {
  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      return createCognitoUiSettings(event);

    case 'Delete':
      return {
        IsComplete: true,
      };
  }
};

async function createCognitoUiSettings(
  event: CdkCustomResourceIsCompleteEvent,
): Promise<CdkCustomResourceIsCompleteResponse> {
  const { cssLocator, logoLocator, userPoolClientId, userPoolId } =
    updateCognitoUiPropertiesRuntype.check(event.ResourceProperties);

  console.log('Checking userpool domain');
  const userPool = await getUserPool(userPoolId);
  if (!userPool.Domain && !userPool.CustomDomain) {
    return {
      IsComplete: false,
    };
  }

  const domain = await getUserPoolDomain(userPool);
  if (domain.Status?.toLowerCase() !== 'active') {
    console.log('Domain is not yet active');
    return {
      IsComplete: false,
    };
  }

  console.log('Updating cognito settings');
  // Load resources from S3
  const [cssResource, logoResource] = await Promise.all([
    s3Client
      .send(
        new GetObjectCommand({
          Bucket: cssLocator.bucketName,
          Key: cssLocator.objectKey,
        }),
      )
      .then(({ Body }) => getFileContents(Body as Readable)),
    s3Client
      .send(
        new GetObjectCommand({
          Bucket: logoLocator.bucketName,
          Key: logoLocator.objectKey,
        }),
      )
      .then(async ({ Body }) => getFileContents(Body as Readable)),
  ]);

  const cssContents = cssResource.toString('utf-8');

  const res = await cognitoClient.send(
    new SetUICustomizationCommand({
      UserPoolId: userPoolId,
      ClientId: userPoolClientId,
      CSS: cssContents,
      ImageFile: logoResource,
    }),
  );

  return {
    IsComplete: true,
    Data: res.UICustomization,
  };
}

function getFileContents(readable: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const writable = new streamBuffers.WritableStreamBuffer();
    writable.on('error', (err) => reject(err));
    writable.on('finish', () => {
      const buf = writable.getContents();
      if (!buf) {
        reject(new Error('Failed to load data'));
        return;
      }
      resolve(buf);
    });
    readable.pipe(writable);
  });
}

async function getUserPool(userPoolId: string): Promise<UserPoolType> {
  return cognitoClient
    .send(
      new DescribeUserPoolCommand({
        UserPoolId: userPoolId,
      }),
    )
    .then(({ UserPool }) => {
      if (!UserPool) {
        throw new Error('Failed to get userPool');
      }
      return UserPool;
    });
}

async function getUserPoolDomain(userPool: UserPoolType): Promise<DomainDescriptionType> {
  // use the CustomDomain if there is one, otherwise the 'prefix'
  const domain = userPool.CustomDomain ?? userPool.Domain;
  if (!domain) {
    throw new Error('No domain!');
  }

  return cognitoClient
    .send(
      new DescribeUserPoolDomainCommand({
        Domain: domain,
      }),
    )
    .then(({ DomainDescription }) => {
      if (!DomainDescription) {
        throw new Error('No domain description');
      }
      console.log('Domain', { DomainDescription });

      return DomainDescription;
    });
}
