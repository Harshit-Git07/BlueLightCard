import type { CompanyLocation, WebhookEventResult } from '@bluelightcard/sanity-types';

type ArrayElement<ArrayType> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export type CompanyLocationBatch = {
  _id: string;
  _updatedAt: string;
  _type: 'company.location.batch';
  operation: 'create' | 'update' | 'delete';
  locations: CompanyLocation[];
};

export type WebhookResultRecord = ArrayElement<WebhookEventResult> | CompanyLocationBatch;

type RecordType = WebhookResultRecord['_type'] | CompanyLocationBatch['_type'];

export type Record<type extends RecordType> = Extract<WebhookResultRecord, { _type: type }>;

export interface SanityChangeEvent {
  version: string;
  routeKey: string;
  rawPath: string;
  rawQueryString: string;
  headers: SanityChangeEventHeaders;
  requestContext: SanityChangeEventRequestContext;
  body: WebhookResultRecord;
  isBase64Encoded: boolean;
}

export interface SanityChangeEventHeaders {
  host: string;
  'accept-encoding': string;
  'content-length': string;
  'content-type': string;
  'idempotency-key': string;
  'sanity-dataset': string;
  'sanity-document-id': string;
  'sanity-operation': string;
  'sanity-project-id': string;
  'sanity-transaction-id': string;
  'sanity-transaction-time': string;
  'sanity-webhook-id': string;
  'sanity-webhook-signature': string;
  'user-agent': string;
  'x-amzn-trace-id': string;
  'x-forwarded-for': string;
  'x-forwarded-port': string;
  'x-forwarded-proto': string;
}

export interface SanityChangeEventRequestContext {
  accountId: string;
  apiId: string;
  domainName: string;
  domainPrefix: string;
  http: SanityChangeEventHttp;
  requestId: string;
  routeKey: string;
  stage: string;
  time: string;
  timeEpoch: number;
}

export interface SanityChangeEventHttp {
  method: string;
  path: string;
  protocol: string;
  sourceIp: string;
  userAgent: string;
}
