import { askApiKeyQuestions } from '../service-walkthroughs/appSync-walkthrough';
import { authConfigToAppSyncAuthType } from '../utils/auth-config-to-app-sync-auth-type-bi-di-mapper';
import { getCfnApiArtifactHandler } from '../cfn-api-artifact-handler';

export async function addApiKey(context): Promise<void> {
  console.log('adding api key...');
  if (await context.prompt.confirm('Create API Key?')) {
    console.log('prompt passed');
    const authConfig = { additionalAuthenticationProviders: [await askApiKeyQuestions()] };

    getCfnApiArtifactHandler(context).updateArtifacts({
      version: 1,
      serviceModification: {
        serviceName: 'AppSync',
        additionalAuthTypes: authConfig.additionalAuthenticationProviders.map(authConfigToAppSyncAuthType),
      },
    });
  }
}
