import { IDatabaseConnection } from '../iDatabseConnection';
import { IDatabaseAdapter } from '../IDatabaseAdapter';
import { OffersFunction } from '../../sst/OffersFunction';
import { Script, Stack } from 'sst/constructs';
import { migrationRunner } from './migrationRunner';

export const LAMBDA_MIGRATION_FOLDER: string = 'migrations';
export const LOCAL_MIGRATION_FOLDER: string = 'packages/api/offers/src/constructs/database/migration/generatedFiles';

export class Migration {
  public static async runMigrationsLocally(db: IDatabaseConnection, folderPath: string) {
    console.log('\n🚀 Running offers migrations locally 🚀\n');
    await migrationRunner(db.drizzleClient, folderPath);
    console.log('\n✅  Hurray 🎉 Offers migrations completed! 🎉\n');
  }

  public static runLambdaMigrationScript(stack: Stack, dbAdapter: IDatabaseAdapter) {
    const migration = new OffersFunction(stack, 'OffersDatabaseMigrationLambda', {
      handler: 'packages/api/offers/src/constructs/database/migration/migrationHandler.handler',
      copyFiles: [{ from: LOCAL_MIGRATION_FOLDER, to: LAMBDA_MIGRATION_FOLDER }],
      database: dbAdapter,
    });
    migration.node.addDependency(dbAdapter.details.database);

    new Script(stack, 'OffersDatabaseMigrationScript', {
      onCreate: migration,
      onUpdate: migration,
    });
  }
}
