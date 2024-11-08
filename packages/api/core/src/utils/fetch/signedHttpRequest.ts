import { getEnv } from '../getEnv';
import { type HTTPRequestMethods, type RequestResponse } from './httpRequest';
import aws4 from 'aws4';
import https from 'https';

type headers = {
  [header: string]: string;
};

/**
 * Handles requests such as POST,PUT,PATCH
 * @param endpoint {string}
 * @param data {any}
 * @param method {RequestMethods}
 * @param headers {headers}
 */
export const signAndHandleRequest = async (
  endpoint: string,
  data: any,
  method: HTTPRequestMethods,
  headers?: headers | undefined,
): Promise<RequestResponse> => {
  const url = new URL(endpoint);

  const options = {
    host: url.hostname,
    path: url.pathname + url.search,
    service: 'execute-api',
    region: getEnv('AWS_REGION'),
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      host: url.host,
    },
    body: JSON.stringify(data),
    method,
  };

  aws4.sign(options, {
    accessKeyId: getEnv('AWS_ACCESS_KEY_ID') || getEnv('AWS_ACCESS_KEY'),
    secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY') || getEnv('AWS_SECRET_KEY'),
    sessionToken: getEnv('AWS_SESSION_TOKEN'),
  });

  return new Promise((resolve, reject) => {
    const req = https
      .request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve({
            status: res.statusCode ?? 500,
            data,
          });
        });
      })
      .on('error', (e) => {
        reject(e);
      });

    req.end(options.body || '');
  });
};
