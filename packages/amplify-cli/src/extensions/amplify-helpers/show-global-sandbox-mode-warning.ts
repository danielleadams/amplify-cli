import chalk from 'chalk';
import { stateManager } from 'amplify-cli-core';

export function showGlobalSandboxModeWarning(context): void {
  const apiConfig = stateManager.getBackendConfig()['api'];
  let globalSandboxModeConfig;

  Object.keys(apiConfig).forEach(k => {
    if (apiConfig[k]['service'] === 'AppSync') globalSandboxModeConfig = apiConfig[k].globalSandboxMode;
  });

  if (!globalSandboxModeConfig || Object.keys(globalSandboxModeConfig).length === 0) return;

  const currEnvName = context.amplify.getEnvInfo().envName;
  const sandboxEnabledEnv = globalSandboxModeConfig[currEnvName];

  if (sandboxEnabledEnv && sandboxEnabledEnv.enabled) {
    context.print.info(`
\n⚠️  WARNING: ${chalk.green('"type AMPLIFY_GLOBAL @allow_public_data_access_with_api_key"')} in your GraphQL schema
allows public create, read, update, and delete access to all models via API Key. This
should only be used for testing purposes.
    `);
  }
}
