import 'reflect-metadata';
import axios, { AxiosResponse } from 'axios';
import { LambdaLogger } from '../../../core/src/utils/logger/lambdaLogger';
import { inject, injectable } from 'tsyringe';
import { Logger } from '../../../core/src/utils/logger/logger';
import { DI_KEYS } from '../utils/diTokens';

export type LegacyEndPointProps = {
  apiEndPoint: string;
  authToken: string;
  queryParams?: string;
  headers?: Record<string, string>;
  body?: any;
  byPass?: boolean;
};

export interface ILegacyAPIService {
  get<T>(p: LegacyEndPointProps): Promise<AxiosResponse<T>>;
}

@injectable()
export class LegacyAPICallService implements ILegacyAPIService {
  constructor(
    @inject(Logger.key) private readonly logger: LambdaLogger,
    @inject(DI_KEYS.BlcBaseUrl) private readonly blcBaseUrl: string,
  ) {}

  get<T>(p: LegacyEndPointProps): Promise<AxiosResponse<T>> {
    const url = `${this.blcBaseUrl}/${p.apiEndPoint}?${p.queryParams}${p.byPass ? '&bypass=true' : ''}`;
    this.logger.info({ message: 'GET legacy api', body: { url } });
    return axios.get<T>(url, {
      headers: {
        Authorization: p.authToken,
        ...p.headers,
      },
    });
  }
}
