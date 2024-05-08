import { ChildProcess, spawn } from 'child_process';
import postgres from 'postgres';
import { Config } from 'sst/node/config';

import { WELL_KNOWN_PORTS_SCHEMA } from '@blc-mono/core/schemas/common';
import { getEnv, getEnvOrDefaultValidated } from '@blc-mono/core/utils/getEnv';
import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';
import { waitOn } from '@blc-mono/core/utils/waitOn';
import { DatabaseConfigHelpers, DatabaseType } from '@blc-mono/redemptions/infrastructure/config/database';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import {
  DatabaseConnection,
  DatabaseConnectionConfig,
  DatabaseConnectionType,
  DatabaseEndpoint,
  RawDatabaseCredentials,
  SecretsManagerDatabaseCredentials,
} from '@blc-mono/redemptions/libs/database/connection';
import { DEFAULT_POSTGRES_PORT } from '@blc-mono/redemptions/libs/database/database';

const logger = new CliLogger();

export class E2EDatabaseConnectionManager {
  private constructor(
    public readonly connection: DatabaseConnection,
    private bastionTunnelProcess: ChildProcess | null = null,
    private readonly sessionId: string | null = null,
  ) {}

  // ============================= SETUP / CLEANUP =============================

  public static setup(connectionType: DatabaseConnectionType) {
    const databaseType = DatabaseConfigHelpers.getDatabaseTypeFromEnv();

    if (databaseType === DatabaseType.LOCAL) {
      return this.setupLocal(connectionType);
    }

    return this.setupRemote(connectionType);
  }

  public static async setupLocal(connectionType: DatabaseConnectionType) {
    const connectionConfig = DatabaseConnectionConfig.fromCredentialsAndEndpoint(
      RawDatabaseCredentials.fromEnvironmentVariables(),
      DatabaseEndpoint.fromHostAndPort(
        '127.0.0.1',
        getEnvOrDefaultValidated(
          RedemptionsStackEnvironmentKeys.REDEMPTIONS_DATABASE_PORT,
          DEFAULT_POSTGRES_PORT,
          WELL_KNOWN_PORTS_SCHEMA,
        ),
      ),
      getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_DATABASE_NAME),
    );
    const connection = await DatabaseConnection.connect(connectionConfig, connectionType);
    await this.waitForConnection(connection.sql);
    return new E2EDatabaseConnectionManager(connection);
  }

  public static async setupRemote(connectionType: DatabaseConnectionType) {
    const credentials = await SecretsManagerDatabaseCredentials.fromSecretName(
      Config.REDEMPTIONS_DATABASE_CREDENTIALS_SECRET_NAME,
    ).toRaw();
    const localPort = Math.floor(Math.random() * 1000) + 7000;
    const endpoint = DatabaseEndpoint.fromHostAndPort('127.0.0.1', localPort);
    const config = DatabaseConnectionConfig.fromCredentialsAndEndpoint(
      credentials,
      endpoint,
      getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_DATABASE_NAME),
    );

    const bastianHostInstanceId = Config.REDEMPTIONS_BASTION_HOST_INSTANCE;
    const remoteHost =
      connectionType === DatabaseConnectionType.READ_ONLY
        ? Config.REDEMPTIONS_DATABASE_READ_ONLY_HOST
        : Config.REDEMPTIONS_DATABASE_READ_WRITE_HOST;
    const remotePort = getEnvOrDefaultValidated(
      RedemptionsStackEnvironmentKeys.REDEMPTIONS_DATABASE_PORT,
      DEFAULT_POSTGRES_PORT,
      WELL_KNOWN_PORTS_SCHEMA,
    );

    const cmd = 'aws';
    const args = [
      'ssm',
      'start-session',
      '--target',
      bastianHostInstanceId,
      '--document-name',
      'AWS-StartPortForwardingSessionToRemoteHost',
      '--parameters',
      JSON.stringify({
        portNumber: [remotePort.toString()],
        localPortNumber: [localPort.toString()],
        host: [remoteHost],
      }),
      '--reason',
      'e2e-test-tunnel',
      '--region',
      'eu-west-2',
    ];

    const command = `${cmd} ${args.join(' ')}`;
    logger.info({
      message: 'Starting port forwarding session with AWS SSM Session Manager...',
    });
    logger.debug({
      message: `Running command: ${command}`,
    });

    const bastionTunnelProcess = spawn('aws', args);
    bastionTunnelProcess.stdout.on('data', (data) => {
      const lines: string[] = data.toString().split('\n');
      for (const line of lines) {
        if (line.startsWith('Starting session with SessionId: ')) {
          sessionId = line.split(' ').at(-1) ?? null;
        }
        logger.debug({
          message: line,
        });
      }
    });
    let sessionId: string | null = null;
    bastionTunnelProcess.stderr.on('data', (data) => {
      logger.error({
        message: data.toString(),
      });
    });
    let started = false;

    bastionTunnelProcess.on('error', (err) => {
      logger.error({
        message: `❌ Failed to : ${err.message}\n${err.stack}`,
      });
    });
    bastionTunnelProcess.on('exit', (code, signal) => {
      if (started && (code ?? 0) === 0) {
        logger.info({
          message: '✅ Exited session successfully',
        });
      } else {
        logger.error({
          message: `❌ Failed to start session: process exited with code ${code} and signal ${signal}`,
        });
      }
    });

    await new Promise((resolve) => {
      bastionTunnelProcess.stdout.on('data', (data) => {
        if (data.toString().includes('Waiting for connections...')) {
          logger.info({
            message: '✅ Port forwarding session started successfully',
          });
          started = true;
          resolve(null);
        }
      });
    });

    const connection = await DatabaseConnection.connect(config, connectionType);
    await this.waitForConnection(connection.sql);

    return new E2EDatabaseConnectionManager(connection, bastionTunnelProcess, sessionId);
  }

  public async cleanup() {
    await this.connection.close().catch((err) => {
      logger.error({
        message: `❌ Failed to close database connection: ${err}`,
      });
    });
    if (this.bastionTunnelProcess) {
      const bastionTunnelProcess = this.bastionTunnelProcess;
      logger.info({
        message: `Exiting port forwarding session...`,
      });
      bastionTunnelProcess.kill();
      await new Promise((resolve) => {
        bastionTunnelProcess.on('exit', resolve);
      });
      const cmd = 'aws';
      const args = ['ssm', 'terminate-session', '--session-id', this.sessionId ?? '', '--region', 'eu-west-2'];
      const command = `${cmd} ${args.join(' ')}`;
      logger.info({
        message: `Terminating port forwarding session...`,
      });
      logger.debug({
        message: `Running command: ${command}`,
      });
      const process = spawn(cmd, args);
      process.stdout.on('data', (data) => {
        logger.debug({
          message: data.toString(),
        });
      });
      process.stderr.on('data', (data) => {
        logger.error({
          message: data.toString(),
        });
      });
      await new Promise((resolve) => {
        process.on('exit', (code, signal) => {
          if (code === 0) {
            logger.info({
              message: '✅ Terminated port forwarding session successfully',
            });
            resolve(null);
          } else {
            logger.error({
              message: `❌ Failed to terminate port forwarding session: process exited with code ${code} and signal ${signal}`,
            });
            resolve(null);
          }
        });
      });
    }
  }

  // ================================= HELPERS =================================

  private static waitForConnection(sql: postgres.Sql) {
    return waitOn(async () => {
      const results = await sql`SELECT * FROM pg_catalog.pg_tables;`;
      if (!results.length) {
        throw new Error('Invalid response from database');
      }
    });
  }
}
