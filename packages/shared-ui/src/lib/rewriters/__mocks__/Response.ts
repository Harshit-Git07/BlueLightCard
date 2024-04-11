/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Response {
  public status: number;

  constructor(private data: string, private options: any) {
    this.status = options.status;
  }

  async json() {
    return JSON.parse(this.data);
  }
}
