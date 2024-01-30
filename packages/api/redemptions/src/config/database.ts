import { Stack } from 'sst/constructs';

import { getEnv, getEnvOrDefault, getEnvOrDefaultValidated, getEnvRaw } from '@blc-mono/core/utils/getEnv';

import { DEFAULT_POSTGRES_PORT } from '../constants/database';
import { EnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX, PRODUCTION_STAGE, STAGING_STAGE } from '../constants/sst';
import { WELL_KNOWN_PORTS_SCHEMA } from '../schemas/common';

export enum DatabaseType {
  LOCAL = 'LOCAL',
  RDS_PG_SINGLE_INSTANCE = 'RDS_PG_SINGLE_INSTANCE',
  AURORA_PG_CLUSTER = 'AURORA_PG_CLUSTER',
}
export enum DatabaseSeedMethod {
  SYNTHETIC_DATA = 'SYNTHETIC_DATA',
  DISABLED = 'DISABLED',
}

export type AuroraPgClusterDatabaseConfig = {
  databaseType: DatabaseType.AURORA_PG_CLUSTER;
  databaseSeedMethod: DatabaseSeedMethod;
  databaseName: string;
  port: number;
};
export type RdsPgSingleInstanceDatabaseConfig = {
  databaseType: DatabaseType.RDS_PG_SINGLE_INSTANCE;
  databaseSeedMethod: DatabaseSeedMethod;
  databaseName: string;
  port: number;
};
export type LocalDatabaseConfig = {
  databaseType: DatabaseType.LOCAL;
  databaseSeedMethod: DatabaseSeedMethod;
  databaseName: string;
  port: number;
  host: string;
  username: string;
  password: string;
};

export type DatabaseConfig = AuroraPgClusterDatabaseConfig | RdsPgSingleInstanceDatabaseConfig | LocalDatabaseConfig;

export class RedemptionsDatabaseConfigResolver {
  public static for(stack: Stack): DatabaseConfig {
    switch (true) {
      case [PRODUCTION_STAGE, STAGING_STAGE].includes(stack.stage):
        return this.forProductionLikeStage();
      case PR_STAGE_REGEX.test(stack.stage):
        return this.forPrStage();
      default:
        return this.fromEnvironmentVariables();
    }
  }

  public static forProductionLikeStage(): AuroraPgClusterDatabaseConfig {
    return {
      databaseType: DatabaseType.AURORA_PG_CLUSTER,
      databaseSeedMethod: DatabaseSeedMethod.DISABLED,
      databaseName: 'redemptions',
      port: 5432,
    };
  }

  public static forPrStage(): RdsPgSingleInstanceDatabaseConfig {
    return {
      databaseType: DatabaseType.RDS_PG_SINGLE_INSTANCE,
      databaseSeedMethod: DatabaseSeedMethod.SYNTHETIC_DATA,
      databaseName: 'redemptions',
      port: 5432,
    };
  }

  public static fromEnvironmentVariables(): DatabaseConfig {
    return {
      databaseType: DatabaseConfigHelpers.getDatabaseTypeFromEnv(),
      databaseSeedMethod: DatabaseConfigHelpers.getDatabaseSeedMethodFromEnv(),
      databaseName: getEnv(EnvironmentKeys.REDEMPTIONS_DATABASE_NAME),
      port: getEnvOrDefaultValidated(
        EnvironmentKeys.REDEMPTIONS_DATABASE_PORT,
        DEFAULT_POSTGRES_PORT,
        WELL_KNOWN_PORTS_SCHEMA,
      ),
      host: getEnvOrDefault(EnvironmentKeys.REDEMPTIONS_DATABASE_HOST, 'localhost'),
      username: getEnv(EnvironmentKeys.REDEMPTIONS_DATABASE_USER),
      password: getEnv(EnvironmentKeys.REDEMPTIONS_DATABASE_PASSWORD),
    };
  }

  public static fromEnvironmentVariablesLocal(): LocalDatabaseConfig {
    return {
      databaseType: DatabaseType.LOCAL,
      databaseSeedMethod: DatabaseConfigHelpers.getDatabaseSeedMethodFromEnv(),
      databaseName: getEnv(EnvironmentKeys.REDEMPTIONS_DATABASE_NAME),
      port: getEnvOrDefaultValidated(
        EnvironmentKeys.REDEMPTIONS_DATABASE_PORT,
        DEFAULT_POSTGRES_PORT,
        WELL_KNOWN_PORTS_SCHEMA,
      ),
      host: getEnvOrDefault(EnvironmentKeys.REDEMPTIONS_DATABASE_HOST, 'localhost'),
      username: getEnv(EnvironmentKeys.REDEMPTIONS_DATABASE_USER),
      password: getEnv(EnvironmentKeys.REDEMPTIONS_DATABASE_PASSWORD),
    };
  }
}

export class DatabaseConfigHelpers {
  public static getDatabaseTypeFromEnv(): DatabaseType {
    const databaseType = getEnv(EnvironmentKeys.REDEMPTIONS_DATABASE_TYPE);

    if (!DatabaseConfigHelpers.isDatabaseType(databaseType)) {
      throw new Error(
        [
          `Unknown value for environment variable ${EnvironmentKeys.REDEMPTIONS_DATABASE_TYPE}: ${getEnvRaw(
            EnvironmentKeys.REDEMPTIONS_DATABASE_TYPE,
          )}`,
          `Valid values are: ${Object.values(DatabaseType).join(', ')}`,
        ].join('\n'),
      );
    }

    return databaseType;
  }

  public static getDatabaseSeedMethodFromEnv(): DatabaseSeedMethod {
    const databaseSeedMethod = getEnv(EnvironmentKeys.REDEMPTIONS_DATABASE_SEED_METHOD);

    if (!DatabaseConfigHelpers.isDatabaseSeedMethod(databaseSeedMethod)) {
      throw new Error(
        [
          `Unknown value for environment variable ${EnvironmentKeys.REDEMPTIONS_DATABASE_SEED_METHOD}: ${getEnvRaw(
            EnvironmentKeys.REDEMPTIONS_DATABASE_SEED_METHOD,
          )}`,
          `Valid values are: ${Object.values(DatabaseSeedMethod).join(', ')}`,
        ].join('\n'),
      );
    }

    return databaseSeedMethod;
  }

  public static isDatabaseType(maybeDatabaseType: string): maybeDatabaseType is DatabaseType {
    return Object.keys(DatabaseType).includes(maybeDatabaseType);
  }

  public static isDatabaseSeedMethod(maybeDatabaseSeedMethod: string): maybeDatabaseSeedMethod is DatabaseSeedMethod {
    return Object.keys(DatabaseSeedMethod).includes(maybeDatabaseSeedMethod);
  }
}
