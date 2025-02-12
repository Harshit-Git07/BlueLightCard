import { Model } from './model';

export class ResponseModel {
  constructor(public statusCode: string, public responseModel: Model) {}
}
