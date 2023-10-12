import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class S3Helper {

  private static s3Client = new S3Client({});

  static async fetch(bucket: string, key: string) {
    return await this.s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }

}