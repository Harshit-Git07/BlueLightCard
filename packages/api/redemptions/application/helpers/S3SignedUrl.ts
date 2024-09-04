import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3SignedUrl {
  static readonly key = 'S3SignedUrl' as const;

  public async getPutObjectSignedUrl(client: S3Client, bucket: string, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return await getSignedUrl(client, command, { expiresIn: 3600 });
  }
}
