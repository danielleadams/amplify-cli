import chalk from 'chalk';
import { stateManager } from 'amplify-cli-core';

function getAppSyncApi(): any {
  const apiConfig = stateManager.getBackendConfig()?.api;
  let appSyncApi;

  Object.keys(apiConfig).forEach(k => {
    if (apiConfig[k]['service'] === 'AppSync') appSyncApi = apiConfig[k];
  });

  return appSyncApi;
}

function getApiKeyConfig(appSyncApi: any): any {
  const { defaultAuthentication, additionalAuthenticationProviders } = appSyncApi.output.authConfig;

  if (defaultAuthentication.apiKeyConfig) return defaultAuthentication.apiKeyConfig;

  let apiKeyConfig;

  additionalAuthenticationProviders.forEach(authProvider => {
    if (authProvider.authenticationType === 'API_KEY') apiKeyConfig = authProvider;
  });

  return apiKeyConfig;
}

export function showGlobalSandboxModeWarning(context): void {
  const appSyncApi = getAppSyncApi();
  const apiKeyConfig = getApiKeyConfig(appSyncApi);
  const currEnvName = context.amplify.getEnvInfo().envName;
  const globalSandboxModeConfig = appSyncApi.globalSandboxModeConfig || {};
  const expirationDate = new Date(apiKeyConfig?.apiKeyExpirationDate);

  if (apiKeyConfig && globalSandboxModeConfig[currEnvName]?.enabled) {
    context.print.info(`
⚠️  WARNING: ${chalk.green('"type AMPLIFY_GLOBAL @allow_public_data_access_with_api_key"')} in your GraphQL schema
allows public create, read, update, and delete access to all models via API Key. This
should only be used for testing purposes. API Key expiration date is: ${expirationDate.toLocaleDateString()}

To configure PRODUCTION-READY authorization rules, review: https://docs.amplify.aws/cli/graphql-transformer/auth
`);
  }
}
