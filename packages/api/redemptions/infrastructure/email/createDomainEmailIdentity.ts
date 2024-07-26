import { SES } from 'aws-sdk';

export async function createDomainEmailIdentity(domain: string, region: string) {
  try {
    const client = new SES({ region });
    await client.verifyDomainIdentity({ Domain: domain }).promise();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error creating domain email identity: ${error}`);
  }
}
