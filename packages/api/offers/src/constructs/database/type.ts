import { DatabaseCluster, DatabaseInstance, DatabaseProxy } from 'aws-cdk-lib/aws-rds';

export type DatabaseResource = DatabaseType.LOCAL | DatabaseCluster | DatabaseInstance | DatabaseProxy;

export const enum DatabaseInstanceType {
  READER = 'READER',
  WRITER = 'WRITER',
}

export type Credentials = {
  username: string;
  password: string;
};

export type Host = {
  type?: DatabaseInstanceType;
  host: string;
  port?: number;
};

export type DatabaseConfig = {
  type?: DatabaseType;
  secretName?: string;
  host: Host;
  clusterReaderHost?: Host;
  credentials?: Credentials;
};

export const enum DatabaseType {
  LOCAL = 'LOCAL',
  CLUSTER = 'CLUSTER',
  INSTANCE = 'INSTANCE',
}

export type ConnectionDetails = {
  username: string;
  password: string;
  host: string;
  dbname: string;
  port: number;
};

export type Secret = {
  username: string;
  password: string;
  host: string;
  dbname: string;
  port: number;
};
