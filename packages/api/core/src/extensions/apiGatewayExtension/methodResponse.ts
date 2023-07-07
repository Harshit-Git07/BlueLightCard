import { ResponseModel } from './responseModel';

export class MethodResponses {
    static toMethodResponses(responses: ResponseModel[]) {
        return responses.map(response => ({
            statusCode: response.statusCode,
            responseModels: { 'application/json': response.responseModel.getModel() },
        }));
    }
}

