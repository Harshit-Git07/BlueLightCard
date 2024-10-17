import { ReusableCrudQueryMapper } from '../reusableCrudQueryMapper';
import { APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { ReusableCrudQueryPayload } from '../../../types/reusableCrudQueryPayload';

describe('ReusableCrudQueryMapper', () => {
  describe('fromPathParameters', () => {
    const pkKey = 'pk';
    const skKey = 'sk';

    it('should throw an error if pathParameters is null', () => {
      expect(() => {
        ReusableCrudQueryMapper.fromPathParameters(null, pkKey, skKey);
      }).toThrow('Event path parameters are required');
    });

    it('should throw an error if pathParameters is missing brand', () => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
        pk: 'PK#123',
        sk: 'SK#456',
      };

      expect(() => {
        ReusableCrudQueryMapper.fromPathParameters(pathParameters, pkKey, skKey);
      }).toThrow();
    });

    it('should throw an error if pathParameters is missing pkKey', () => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
        brand: 'blc-uk',
        sk: 'SK#456',
      };

      expect(() => {
        ReusableCrudQueryMapper.fromPathParameters(pathParameters, pkKey, skKey);
      }).toThrow();
    });

    it('should return a payload with null sk if skKey is missing', () => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
        brand: 'blc-uk',
        pk: 'PK#123',
      };

      const expectedPayload: ReusableCrudQueryPayload = {
        brand: 'blc-uk',
        pk: 'PK#123',
        sk: null,
      };

      const result = ReusableCrudQueryMapper.fromPathParameters(pathParameters, pkKey, skKey);
      expect(result).toEqual(expectedPayload);
    });

    it('should return a valid payload if all required keys are present', () => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
        brand: 'blc-uk',
        pk: 'PK#123',
        sk: 'SK#456',
      };

      const expectedPayload: ReusableCrudQueryPayload = {
        brand: 'blc-uk',
        pk: 'PK#123',
        sk: 'SK#456',
      };

      const result = ReusableCrudQueryMapper.fromPathParameters(pathParameters, pkKey, skKey);
      expect(result).toEqual(expectedPayload);
    });
  });
});
