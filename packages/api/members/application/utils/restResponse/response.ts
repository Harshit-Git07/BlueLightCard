import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { APIError } from '../../models/APIError';

interface ResponseHeaders {
  [header: string]: boolean | number | string;
}

export interface ResponsePayload {
  statusCode: HttpStatusCode;
  body: string;
  headers?: ResponseHeaders;
  isBase64Encoded?: boolean;
}

interface BodyPayload {
  message: string;
  data?: any;
  errors?: APIError[];
}

export class Response {
  static createResponse(
    statusCode: HttpStatusCode,
    body: BodyPayload,
    headers?: ResponseHeaders,
  ): ResponsePayload {
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        ...this.getDefaultHeaders(),
        ...headers,
      },
    };
  }

  static getDefaultHeaders(): ResponseHeaders {
    return {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // for CORS
    };
  }

  static OK(body: BodyPayload, headers?: ResponseHeaders): ResponsePayload {
    return this.createResponse(HttpStatusCode.OK, body, headers);
  }

  static Created(body: BodyPayload, headers?: ResponseHeaders): ResponsePayload {
    return this.createResponse(HttpStatusCode.CREATED, body, headers);
  }

  static NoContent(headers?: ResponseHeaders): ResponsePayload {
    return this.createResponse(HttpStatusCode.NO_CONTENT, { message: 'No Content' }, headers);
  }

  static BadRequest(body: BodyPayload, headers?: ResponseHeaders): ResponsePayload {
    return this.createResponse(HttpStatusCode.BAD_REQUEST, body, headers);
  }

  static Unauthorized(body: BodyPayload, headers?: ResponseHeaders): ResponsePayload {
    return this.createResponse(HttpStatusCode.UNAUTHORIZED, body, headers);
  }

  static Forbidden(body: BodyPayload, headers?: ResponseHeaders): ResponsePayload {
    return this.createResponse(HttpStatusCode.FORBIDDEN, body, headers);
  }

  static NotFound(body: BodyPayload, headers?: ResponseHeaders): ResponsePayload {
    return this.createResponse(HttpStatusCode.NOT_FOUND, body, headers);
  }

  static MethodNotAllowed(body: BodyPayload, headers?: ResponseHeaders): ResponsePayload {
    return this.createResponse(HttpStatusCode.METHOD_NOT_ALLOWED, body, headers);
  }

  static Error(
    error: Error,
    statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
    headers?: ResponseHeaders,
  ): ResponsePayload {
    return this.createResponse(
      statusCode,
      { message: 'Error occurred processing request' },
      headers,
    );
  }
}
