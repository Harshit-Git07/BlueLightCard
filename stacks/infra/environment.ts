export enum SharedStackEnvironmentKeys {
  /**
   * The brand of this deployment.
   */
  BRAND = 'BRAND',

  /**
   * Forces the creation of an IAM user with access to the bastion host. Requires
   * DANGEROUSLY_ALLOW_SHARED_BASTION_HOST to also be set.
   */
  DANGEROUSLY_ALLOW_DB_ACCESS_USER_CREATION = 'DANGEROUSLY_ALLOW_DB_ACCESS_USER_CREATION',

  /**
   * Forces the shared bastion host to be created, even in development environments.
   */
  DANGEROUSLY_ALLOW_SHARED_BASTION_HOST = 'DANGEROUSLY_ALLOW_SHARED_BASTION_HOST',

}
