import { CompanyFollowsRepository } from 'src/repositories/companyFollowsRepository';
import { CompanyFollowsService, ICompanyFollowsService } from '../CompanyFollowsService';

const MockCompanyFollowsRepository =
  CompanyFollowsRepository as jest.Mock<CompanyFollowsRepository>;

const companyFollowsService: ICompanyFollowsService = new CompanyFollowsService();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('updateCompanyFollows', () => {
  test('should call updateCompanyFollows when action is update', async () => {
    jest
      .spyOn(MockCompanyFollowsRepository.prototype, 'updateCompanyFollows')
      .mockImplementation(() => {
        return {
          Items: [],
        };
      });

    await companyFollowsService.updateCompanyFollows('uuid', 'companyId', 'likeType');

    expect(MockCompanyFollowsRepository.prototype.updateCompanyFollows).toHaveBeenCalledTimes(1);

    expect(MockCompanyFollowsRepository.prototype.updateCompanyFollows).toHaveBeenCalledWith(
      'uuid',
      'companyId',
      'likeType',
    );
  });

  test('should return response from updateCompanyFollows', async () => {
    jest
      .spyOn(MockCompanyFollowsRepository.prototype, 'updateCompanyFollows')
      .mockImplementation(() => {
        return {
          Items: [{ some: 'data' }],
        };
      });

    const result = await companyFollowsService.updateCompanyFollows(
      'uuid',
      'companyId',
      'likeType',
    );

    expect(result).toEqual({
      Items: [{ some: 'data' }],
    });
  });
});

describe('deleteCompanyFollows', () => {
  test('should call deleteCompanyFollows', async () => {
    jest
      .spyOn(MockCompanyFollowsRepository.prototype, 'deleteCompanyFollows')
      .mockImplementation(() => {
        return {
          Items: [],
        };
      });

    await companyFollowsService.deleteCompanyFollows('uuid', 'companyId');

    expect(MockCompanyFollowsRepository.prototype.deleteCompanyFollows).toHaveBeenCalledTimes(1);

    expect(MockCompanyFollowsRepository.prototype.deleteCompanyFollows).toHaveBeenCalledWith(
      'uuid',
      'companyId',
    );
  });

  test('should return response from deleteCompanyFollows', async () => {
    jest
      .spyOn(MockCompanyFollowsRepository.prototype, 'deleteCompanyFollows')
      .mockImplementation(() => {
        return {
          Items: [{ some: 'data' }],
        };
      });

    const result = await companyFollowsService.deleteCompanyFollows('uuid', 'companyId');

    expect(result).toEqual({
      Items: [{ some: 'data' }],
    });
  });
});
