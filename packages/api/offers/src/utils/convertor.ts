export class Convertor {
  public static streamToString(stream: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on('data', (chunk: any) => chunks.push(chunk));
      stream.on('error', (err: any) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }

  public static legacyIdToString(brand: string, legacyId: number | string): string {
    return `${brand}#${legacyId}`;
  }
}
