import { BrandRepository } from "../repositories/brandRepository";
import { Logger } from "@aws-lambda-powertools/logger";
import { Brand } from "../models/brand";

export class BrandService {
  private brandRepository: BrandRepository;
  constructor(private readonly tableName: string, private readonly logger: Logger) {
    this.brandRepository = new BrandRepository(tableName);
  }

  public async batchWrite(brands: Brand[]) {
    const putRequests = brands.map((brand: Brand) => {
      return {
        PutRequest: {
          Item: brand,
        },
      };
    });
    return this.brandRepository.batchWrite(putRequests);
  }

}