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

export function apiKeyIsActive(): boolean {
  const today = new Date();
  const appSyncApi = getAppSyncApi();
  const { apiKeyConfig } = getApiKeyConfig(appSyncApi) || {};
  const { apiKeyExpirationDate } = apiKeyConfig || {};

  if (!apiKeyExpirationDate) return false;

  return new Date(apiKeyExpirationDate) > today;
}

export function hasApiKey(): boolean {
  const appSyncApi = getAppSyncApi();
  const apiKeyConfig = getApiKeyConfig(appSyncApi);

  return !!apiKeyConfig;
}
