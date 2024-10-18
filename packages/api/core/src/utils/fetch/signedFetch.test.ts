import { beforeEach, describe, expect, jest, afterEach } from "@jest/globals";
import { httpRequest, HTTPRequestMethods } from "./httpRequest";
import { SpiedFunction } from "jest-mock";
import { AwsClient } from 'aws4fetch'
import { signAndHandleRequest } from "./signedHttpRequest";

jest.mock('aws4fetch');


describe('signAndHandleRequest', () => {
  let mockedFetch: SpiedFunction<(input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>>;
  

  beforeEach(() => {
    mockedFetch = jest.spyOn(global, 'fetch');
    (AwsClient as jest.Mock).mockClear();
  });

  afterEach(() => {
    mockedFetch.mockRestore();
  });

  describe('200s' ,() => {

    test('httpRequest should return 200 status and an expected body for POST request (application/json)', async () => {
      mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({test: "test"}), {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
      const response = await signAndHandleRequest('https://google.co.uk', {
        someData: "data"
      }, HTTPRequestMethods.POST);
      expect(response).toEqual( { data: { test: 'test' }, status: 200 })
    });

  })

  describe('400s', () => {
    test('httpRequest should return 400 status and an expected body for POST request (application/json)', async () => {
      mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({test: "update failed"}), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 404
      }))
      const response = await signAndHandleRequest('https://google.co.uk', {
        someData: "data"
      }, HTTPRequestMethods.POST);
      expect(response).toEqual({data: {test: "update failed"}, status: 404})
    });
  })

  describe("invalid headers", ()=> {
    test('httpRequest should response with  "Invalid content type header"', async () => {
      mockedFetch.mockResolvedValueOnce(new Response("id not found", {
        headers: {
          'Content-Type': 'aaaa',
        },

      }))
      const response = await signAndHandleRequest('https://google.co.uk', {
        someData: "data"
      }, HTTPRequestMethods.POST);
      expect(response?.message).toEqual("Invalid content type header")
    });
  })
});
