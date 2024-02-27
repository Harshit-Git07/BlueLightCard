import { Logger } from "@aws-lambda-powertools/logger";
import { UnsuccessfulLoginAttemptsRepository } from "src/repositories/unsuccessfulLoginAttemptsRepository";
import { DeleteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export class UnsuccessfulLoginAttemptsService {
  private unsuccessfulLoginAttemptsRepository: UnsuccessfulLoginAttemptsRepository;
  private log: Logger;

  constructor(private readonly tableName: string, private readonly logger: Logger) {
    this.unsuccessfulLoginAttemptsRepository = new UnsuccessfulLoginAttemptsRepository(tableName);
    this.log = logger;
  }

  public async checkIfDatabaseEntryExists(email: string, userPoolId: string) {
    const params = {
      ExpressionAttributeValues: {
          ":email": email,
           ":userPoolId": userPoolId
       },
       ExpressionAttributeNames: {
          "#email": "email",
          "#userPoolId": "userPoolId"
      },
      TableName: this.tableName,
      KeyConditionExpression: "#email = :email and #userPoolId = :userPoolId",
      IndexName: 'gsi1',
    }

    try {
      return this.unsuccessfulLoginAttemptsRepository.checkIfRecordExists(params);
    } catch (error) {
        this.log.error('error while fetching data ',{error});
        throw new Error("authentication failed");
    }
  }


  public async addOrUpdateRecord(email: string, userPoolId: string, count: number) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
          email: email,
          userPoolId: userPoolId,
          count: count,
          timestamp: Date.now(),
      },
    });
    return this.unsuccessfulLoginAttemptsRepository.addOrUpdateRecord(command);
  }

  public async deleteRecord(email: string, userPoolId: string) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
          email: email,
          userPoolId: userPoolId
      },
    });
    return this.unsuccessfulLoginAttemptsRepository.deleteRecord(command);
  }

  public async sendEmailtoUser(emailAddress: string, resetPasswordApiUrl: string, 
                                apiAuthoriserUserBlc: string, apiAuthoriserPasswordBlc: string): Promise<any> {
    let formdata = new FormData();
    formdata.append('email', btoa(emailAddress));
    formdata.append('manual_trigger','true');

    const response = await fetch(
      resetPasswordApiUrl,
        {
            method: "POST",
            headers: {
                Authorization: "Basic " + btoa(apiAuthoriserUserBlc + ":" + apiAuthoriserPasswordBlc),
            },
            body: formdata
        }
      );
      return response.json();
  }
}