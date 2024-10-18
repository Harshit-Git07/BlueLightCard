
import { AwsClient } from 'aws4fetch'
import { getEnv } from '../getEnv'
import { determineResponse, HTTPRequestMethods, RequestResponse } from './httpRequest'


const aws = new AwsClient({
    accessKeyId: getEnv("AWS_ACCESS_KEY_ID") || getEnv("AWS_ACCESS_KEY"),
    secretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY") || getEnv("AWS_SECRET_KEY"),
    sessionToken: getEnv("AWS_SESSION_TOKEN"),
})

type headers = {
    [header: string]: string
}

/**
 * Handles requests such as POST,PUT,PATCH
 * @param endpoint {string}
 * @param data {any}
 * @param method {RequestMethods}
 * @param headers {headers}
 */
export const signAndHandleRequest = async (endpoint: string, data: any, method: HTTPRequestMethods, headers?: headers | undefined): Promise<RequestResponse> => {

    const request = await aws.sign(endpoint, {
        headers,
        method,
        body: JSON.stringify(data),
    })

    const response = await fetch(request);
    return determineResponse(response);
}