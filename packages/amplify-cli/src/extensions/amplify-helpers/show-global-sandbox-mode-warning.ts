import chalk from 'chalk';
import { stateManager } from 'amplify-cli-core';

export function showGlobalSandboxModeWarning(context): void {
  const apiConfig = stateManager.getBackendConfig()['api'];
  let appSyncApi;

  Object.keys(apiConfig).forEach(k => {
    if (apiConfig[k]['service'] === 'AppSync') appSyncApi = apiConfig[k];
  });

  const globalSandboxModeConfig = appSyncApi.globalSandboxModeConfig || {};
  const currEnvName = context.amplify.getEnvInfo().envName;
  const apiKeyConfig = appSyncApi.output.authConfig.defaultAuthentication.apiKeyConfig;
  const sandboxEnabledEnv = globalSandboxModeConfig && globalSandboxModeConfig[currEnvName]?.enabled;
  const expirationDateTime = apiKeyConfig?.apiKeyExpirationDateTime;
  const expirationDate = new Date(expirationDateTime);

  if (sandboxEnabledEnv) {
    context.print.info(`
\n⚠️  WARNING: ${chalk.green('"type AMPLIFY_GLOBAL @allow_public_data_access_with_api_key"')} in your GraphQL schema
allows public create, read, update, and delete access to all models via API Key. This
should only be used for testing purposes. API Key expiration date is: ${expirationDate.toUTCString()}

To configure PRODUCTION-READY authorization rules, review: https://docs.amplify.aws/cli/graphql-transformer/auth`);
  }
}
