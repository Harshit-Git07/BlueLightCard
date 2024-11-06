
export enum HTTPRequestMethods {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE"
}

export type headers = {
  [header: string]: string
}

export type RequestResponse = { data?: any, status: number, message?: string | undefined }
type RequestMethods = keyof typeof HTTPRequestMethods


export type FetchParams = {
  data?: any,
  method: RequestMethods
  endpoint: string
  headers?: headers
}

const enum SupportedFormats {
  json = 'application/json',
  text = 'text/plain'

}

const enum ErrorMessages {
  invalidContentType = 'Invalid content type header'
}

type RequestHandlerParams = (endpoint: string, data: any, method: RequestMethods, headers?: headers | undefined) => Promise<any>
type SimpleRequestParams = (endpoint: string, headers: headers | undefined) => Promise<any>

type MethodHandlers = {
  GET: SimpleRequestParams
  POST: RequestHandlerParams
  PUT: RequestHandlerParams
  PATCH: RequestHandlerParams
  DELETE: SimpleRequestParams
}

/**
 * Determines response type by the Content-Type header
 * @param response
 * @returns {RequestResponse}
 */
const determineResponse = async (response: Response): Promise<RequestResponse> => {
  const contentType = response.headers.get('Content-Type') || ''
  if (contentType.includes(SupportedFormats.json)) {
    return { data: await response.json(), status: response.status }
  }
  else if (contentType.includes(SupportedFormats.text)) {
    return { data: await response.text(), status: response.status }
  }
  else {
    return { message: ErrorMessages.invalidContentType, status: response.status };
  }
}
/**
 * Handles requests such as POST,PUT,PATCH
 * @param endpoint {string}
 * @param data {any}
 * @param method {RequestMethods}
 * @param headers {headers}
 */
const handleRequest = async (endpoint:string , data: any, method:RequestMethods ,headers?: headers| undefined): Promise<RequestResponse> => {
  try {
    const options = {
      headers: headers ? headers : undefined,
      method: method,
      body: JSON.stringify(data),
    };
    const response = await fetch(endpoint, options);
    return determineResponse(response);
  }
  catch (exception) {
    throw exception
  }
}

/**
 * Handles a simple request, GET and DELETE
 * @param endpoint {string}
 * @param headers {headers}
 * @returns {Promise<RequestResponse>}
 */
const handleSimpleRequest =  async (endpoint : string, headers?:  headers | undefined): Promise<RequestResponse> => {
  try {
    const options = { headers: headers ? headers : undefined }
    const response = await fetch(endpoint, options)
    return determineResponse(response)
  }
  catch (exception) {
    throw exception
  }
}



const methodHandlers: MethodHandlers = {
  GET: handleSimpleRequest,
  POST: handleRequest,
  PUT: handleRequest,
  PATCH: handleRequest,
  DELETE: handleSimpleRequest
}

/**
 * Handles http requests for a given endpoint
 *
 * @param data {any} - Payload to be sent
 * @param method {MethodHandlers}  - Method to use
 * @param endpoint {string} - endpoint
 * @param headers {headers} - Headers to use with request
 *
 * @example
 *  httpRequest({
 *    method: "GET"
 *    endpoint: "https://google.co.uk"
 *  }) // { data: "<html>"status: 200 }
 *
 * @return {RequestMethods}
 */
export const httpRequest = async ({ data, method, endpoint, headers }: FetchParams): Promise<RequestResponse | undefined> => {
  if (method === HTTPRequestMethods.GET) {
    return methodHandlers.GET(endpoint, headers);
  } else if (method === HTTPRequestMethods.POST) {
    return methodHandlers.POST(endpoint, data, method, headers);
  } else if (method === HTTPRequestMethods.PUT) {
    return methodHandlers.POST(endpoint, data, method, headers);
  } else if (method === HTTPRequestMethods.PATCH) {
    return methodHandlers.PATCH(endpoint, data, method, headers);
  } else if (method === HTTPRequestMethods.DELETE) {
    return methodHandlers.PATCH(endpoint, data, method, headers);
  }
};
