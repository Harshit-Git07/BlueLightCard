import { CompanyHandler } from '../company/companyHandler';
import { handler } from '../company';

jest.mock('../company/companyHandler');

describe('Company Lambda Handler', () => {
  let mockHandleCompanyCreate: jest.Mock;
  let mockHandleCompanyUpdate: jest.Mock;

  beforeEach(() => {
    (CompanyHandler as jest.MockedClass<typeof CompanyHandler>).mockClear();

    mockHandleCompanyCreate = jest.fn();
    mockHandleCompanyUpdate = jest.fn();

    (CompanyHandler as jest.MockedClass<typeof CompanyHandler>).mockImplementation(() => {
      return {
        handleCompanyCreate: mockHandleCompanyCreate,
        handleCompanyUpdate: mockHandleCompanyUpdate,
      } as any;
    });
  });

  test('should call handleCompanyCreate when event source is company.create', async () => {
    const event = {
      source: 'company.create',
    };
    await handler(event);

    expect(CompanyHandler).toHaveBeenCalledTimes(1);
    expect(mockHandleCompanyCreate).toHaveBeenCalledTimes(1);
    expect(mockHandleCompanyUpdate).toHaveBeenCalledTimes(0);
  });

  test('should call handleCompanyUpdate when event source is company.update', async () => {
    const event = {
      source: 'company.update',
    };

    await handler(event);

    expect(CompanyHandler).toHaveBeenCalledTimes(1);
    expect(mockHandleCompanyCreate).toHaveBeenCalledTimes(0);
    expect(mockHandleCompanyUpdate).toHaveBeenCalledTimes(1);
  });

  test('should throw error when event source is invalid', async () => {
    const event = {
      source: 'invalid',
    };

    await expect(handler(event)).rejects.toThrowError('Invalid event source');
  });
});
