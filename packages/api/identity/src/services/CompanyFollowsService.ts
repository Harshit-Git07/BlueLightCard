import {
  CompanyFollowsRepository,
  ICompanyFollowsRepository,
} from '../repositories/companyFollowsRepository';

export interface ICompanyFollowsService {
  deleteCompanyFollows(uuid: string, companyId: string): Promise<any>;
  updateCompanyFollows(uuid: string, companyId: string, likeType: string): Promise<any>;
}

export class CompanyFollowsService implements ICompanyFollowsService {
  public companyFollowsRepository: ICompanyFollowsRepository = new CompanyFollowsRepository();

  public async updateCompanyFollows(uuid: string, companyId: string, likeType: string) {
    return await this.companyFollowsRepository.updateCompanyFollows(uuid, companyId, likeType);
  }

  public async deleteCompanyFollows(uuid: string, companyId: string) {
    return await this.companyFollowsRepository.deleteCompanyFollows(uuid, companyId);
  }
}
