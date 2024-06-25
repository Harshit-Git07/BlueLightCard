import { BrandRepository } from "src/repositories/brandRepository";

export interface IBrandService {
  getUserIdByUuid(uuid: string): Promise<boolean>;
}

export class BrandService implements IBrandService{
    public brand: BrandRepository;
  
    constructor(private readonly tableName: string, private readonly region: string) {
      this.brand = new BrandRepository(tableName, region);
    }
  
    public async getUserIdByUuid(uuid: string) {
      const data = await this.brand.findItemsByUuid(uuid);
      if(data && data.Items && data.Items.length > 0){
        return data.Items[0].legacy_id;
      }
      return "";
  }

}
