import { beforeEach, describe, expect, jest, afterEach } from "@jest/globals";
import { httpRequest } from "./httpRequest";
import { SpiedFunction } from "jest-mock";

describe('httpRequest', () => {
  let mockedFetch: SpiedFunction<(input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>>;

  beforeEach(() => {
    mockedFetch = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    mockedFetch.mockRestore();
  });

  describe('200s' ,() => {
    test('httpRequest should return 200 status and an expected body for GET request (text/plain)', async () => {
      mockedFetch.mockResolvedValueOnce(new Response("hello world", {
        headers: {
          'Content-Type': 'text/plain'
        }
      }))
      const response = await httpRequest({
        method: 'GET',
        endpoint: 'https://google.co.uk',
      });
      expect(response).toEqual({data: "hello world", status: 200})
    });

    test('httpRequest should return 200 status and an expected body for POST request (application/json)', async () => {
      mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({test: "test"}), {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
      const response = await httpRequest({
        method: 'POST',
        endpoint: 'https://google.co.uk',
      });
      expect(response).toEqual( { data: { test: 'test' }, status: 200 })
    });

    test('httpRequest should return 200 status and an expected body for PUT request (application/json)', async () => {
      mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({test: "test"}), {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
      const response = await httpRequest({
        method: 'PUT',
        endpoint: 'https://google.co.uk',
      });
      expect(response).toEqual( { data: { test: 'test' }, status: 200 })
    });

    test('httpRequest should return 200 status and an expected body for PATCH request (application/json)', async () => {
      mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({test: "test"}), {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
      const response = await httpRequest({
        method: 'PATCH',
        endpoint: 'https://google.co.uk',
      });
      expect(response).toEqual( { data: { test: 'test' }, status: 200 })
    });

    test('httpRequest should return 200 status and an expected body for DELETE request (text/plain)', async () => {
      mockedFetch.mockResolvedValueOnce(new Response("hello world", {
        headers: {
          'Content-Type': 'text/plain'
        }
      }))
      const response = await httpRequest({
        method: 'DELETE',
        endpoint: 'https://google.co.uk',
      });
      expect(response).toEqual({data: "hello world", status: 200})
    });

  })

  describe('400s', () => {
    test('httpRequest should return 400 status and an expected body for GET request (text/plain)', async () => {
      mockedFetch.mockResolvedValueOnce(new Response("404", {
        headers: {
          'Content-Type': 'text/plain',
        },
        status: 404
      }))
      const response = await httpRequest({
        method: 'GET',
        endpoint: 'https://google.co.uk',
      });
      expect(response).toEqual({data: "404", status: 404})
    });

    test('httpRequest should return 400 status and an expected body for PATCH request (application/json)', async () => {
      mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({test: "update failed"}), {
        headers: {
          'Content-Type': 'application/json)',
        },
        status: 404
      }))
      const response = await httpRequest({
        method: 'PATCH',
        endpoint: 'https://google.co.uk',
      });
      expect(response).toEqual({data: {test: "update failed"}, status: 404})
    });

    test('httpRequest should return 400 status and an expected body for PUT request (application/json)', async () => {
      mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({test: "update failed"}), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 404
      }))
      const response = await httpRequest({
        method: 'PUT',
        endpoint: 'https://google.co.uk',
      });
      expect(response).toEqual({data: {test: "update failed"}, status: 404})
    });


    test('httpRequest should return 400 status and an expected body for POST request (application/json)', async () => {
      mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({test: "update failed"}), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 404
      }))
      const response = await httpRequest({
        method: 'POST',
        endpoint: 'https://google.co.uk',
      });
      expect(response).toEqual({data: {test: "update failed"}, status: 404})
    });


    test('httpRequest should return 400 status and an expected body for DELETE request text/plain', async () => {
      mockedFetch.mockResolvedValueOnce(new Response("id not found", {
        headers: {
          'Content-Type': ' text/plain',
        },
        status: 404
      }))
      const response = await httpRequest({
        method: 'POST',
        endpoint: 'https://google.co.uk',
      });
      expect(response).toEqual({data: "id not found", status: 404})
    });

  })

  describe("invalid headers", ()=> {
    test('httpRequest should response with  "Invalid content type header"', async () => {
      mockedFetch.mockResolvedValueOnce(new Response("id not found", {
        headers: {
          'Content-Type': 'aaaa',
        },

      }))
      const response = await httpRequest({
        method: 'POST',
        endpoint: 'https://google.co.uk',
      });
      expect(response?.message).toEqual("Invalid content type header")
    });
  })


});
