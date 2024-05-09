import { IncomingMessage, Server, ServerResponse, createServer } from 'http';
import { logger } from './instances';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TEST_DATA_DIR } from './constants';

export default class MockServer {
  private server: Server;
  private url: URL;

  private readonly defaultResponseHeaders: Record<string, string> = {
    'access-control-allow-methods': '*',
    'access-control-allow-credentials': 'true',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
  };

  private readonly routeToMockDataFiles: Record<string, string> = {
    '/newSearch': 'searchMockData.json',
  };

  constructor(mockServerUrl: string) {
    this.url = new URL(mockServerUrl);
    this.server = createServer((req, res) => this.handleIncomingRequests(req, res));
  }

  private getMockData(routeKey: string) {
    const mockDataFile = this.routeToMockDataFiles[routeKey];
    if (mockDataFile) {
      const mockData = JSON.parse(readFileSync(join(TEST_DATA_DIR, mockDataFile)).toString());
      return mockData;
    }
  }

  private handleIncomingRequests(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage },
  ) {
    let statusCode = 200;
    let response: string = JSON.stringify({});

    try {
      const mockData = this.getMockData(req.url as string);
      if (!mockData) {
        throw new Error(`No mock data found for route '${req.url}'`);
      }
      logger.info({ message: `Responding with mock data for route '${req.url}'` });
      response = JSON.stringify(mockData);
    } catch (error) {
      logger.error({ message: `Incoming request failed for route '${req.url}'`, error });
      statusCode = 404;
    }

    res.writeHead(statusCode, this.defaultResponseHeaders);
    res.write(response);
    res.end();
  }

  public async start() {
    return new Promise((_, reject) => {
      this.server.listen(this.url.port, () => {
        logger.info({ message: `Mock server listening on ${this.url.href}` });
      });
      this.server.on('error', (error) => {
        reject(error);
      });
    });
  }
}
