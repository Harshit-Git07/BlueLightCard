import { IdMappingRepository, IIdMappingRepository } from 'src/repositories/idMappingRepository';

export interface IIdMappingService {
  findByLegacyId(brand: string, legacyId: string): Promise<any>;
}

export class IdMappingService implements IIdMappingService {
  public idMappingRepository: IIdMappingRepository = new IdMappingRepository();

  public async findByLegacyId(brand: string, legacyId: string): Promise<any> {
    const result = await this.idMappingRepository.findByLegacyId(brand, legacyId);
    if (result.Items === null || result.Items?.length === 0) {
      return null;
    }
    return result.Items?.at(0) as Record<string, string>;
  }
}
