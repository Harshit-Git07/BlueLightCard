import { APIErrorCode } from '../enums/APIErrorCode';

export class APIError {
  public readonly code!: APIErrorCode;
  public readonly source!: string;
  public readonly detail!: string;

  constructor(code: APIErrorCode, source: string, detail: string) {
    this.code = code;
    this.source = source;
    this.detail = detail;
  }
}
