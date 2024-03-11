import { Logger } from "@aws-lambda-powertools/logger";
import { UnsuccessfulLoginAttemptsRepository } from "src/repositories/unsuccessfulLoginAttemptsRepository";

export class UnsuccessfulLoginAttemptsService {
  private unsuccessfulLoginAttemptsRepository: UnsuccessfulLoginAttemptsRepository;
  private log: Logger;

  constructor(private readonly tableName: string, private readonly logger: Logger) {
    this.unsuccessfulLoginAttemptsRepository = new UnsuccessfulLoginAttemptsRepository(tableName);
    this.log = logger;
  }

  public async checkIfDatabaseEntryExists(email: string, userPoolId: string) {
    try {
      return this.unsuccessfulLoginAttemptsRepository.checkIfRecordExists(email, userPoolId);
    } catch (error) {
        throw new Error("error while fetching data: " + error);
    }
  }


  public async addOrUpdateRecord(email: string, userPoolId: string, count: number) {
    this.log.debug('Adding/updating a record in database for email:  ' + email + ', userPoolId: ' + userPoolId + ' to count: ' + count);
    try {
      return this.unsuccessfulLoginAttemptsRepository.addOrUpdateRecord(email, userPoolId, count);
    } catch (error) {
      throw new Error("error while adding/updating data: " + error);
    }
  }

  public async deleteRecord(email: string, userPoolId: string) {
    this.logger.debug('Deleting a record for email: ' + email + ", user pool ID: " + userPoolId)
    try {
      return this.unsuccessfulLoginAttemptsRepository.deleteRecord(email, userPoolId);
    } catch (error) {
      throw new Error("error while deleting the record: " + error);
    }
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
      return response;
  }
}