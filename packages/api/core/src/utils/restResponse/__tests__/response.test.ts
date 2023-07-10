import { describe, expect } from '@jest/globals';
import { Response } from '../response';
import { HttpStatusCode } from '../../../types/http-status-code.enum';

describe('Response', () => {
  it('should create a 200 OK response', () => {
    const response = Response.OK({ message: 'Success', data: 'Some data' });

    expect(response.statusCode).toBe(HttpStatusCode.OK);
    expect(JSON.parse(response.body)).toEqual({ message: 'Success', data: 'Some data' });
  });

  it('should create a 400 Bad Request response', () => {
    const response = Response.BadRequest({ message: 'Bad Request', error: 'Some error' });

    expect(response.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    expect(JSON.parse(response.body)).toEqual({ message: 'Bad Request', error: 'Some error' });
  });

  it('should create a 500 Internal Server Error response', () => {
    const error = new Error('Some error');
    const response = Response.Error(error);

    expect(response.statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(response.body)).toEqual({ message: 'Error', error: error.message });
  });
});
