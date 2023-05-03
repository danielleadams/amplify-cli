import {
  addAuthWithDefault,
  addAuthWithDefaultSocial,
  amplifyPushAuth,
  createNewProjectDir,
  deleteProject,
  deleteProjectDir,
  getProjectMeta,
  getUserPoolIdentityProviders,
  initJSProjectWithProfile,
  updateAuthWithDefaultSocial,
} from '@aws-amplify/amplify-e2e-core';
  
const defaultsSettings = {
  name: 'authTest',
};

const getProviderTypes = async (projRoot: string) => {
  const { auth, providers } = getProjectMeta(projRoot);
  const region = providers.awscloudformation.Region;
  const { UserPoolId } = Object.keys(auth)
    .map(key => auth[key])
    .find(auth => auth.service === 'Cognito').output;

  const { Providers } = await getUserPoolIdentityProviders(UserPoolId, region);

  return Providers.map(provider => provider.ProviderType);
};
  
describe('hosted ui tests', () => {
  let projRoot: string;

  beforeEach(async () => {
    projRoot = await createNewProjectDir('auth');
  });

  afterEach(async () => {
    await deleteProject(projRoot);
    deleteProjectDir(projRoot);
  });

  describe('...amplify add auth', () => {
    describe('...creating with hosted ui provider', () => {
      it('...creates identity providers', async () => {
        await initJSProjectWithProfile(projRoot, defaultsSettings);
        await addAuthWithDefaultSocial(projRoot);
        await amplifyPushAuth(projRoot);

        const providerTypes = getProviderTypes(projRoot);

        expect(providerTypes).toContain('Facebook');
        expect(providerTypes).toContain('Google');
        expect(providerTypes).toContain('LoginWithAmazon');
        expect(providerTypes).toContain('SignInWithApple');
      });
    });
  });

  describe('amplify update auth', () => {
    describe('...updating to add hosted ui provider', () => {
      it('...creates identity providers', async () => {
        await initJSProjectWithProfile(projRoot, defaultsSettings);
        await addAuthWithDefault(projRoot);
        await updateAuthWithDefaultSocial(projRoot);
        await amplifyPushAuth(projRoot);

        const providerTypes = getProviderTypes(projRoot);

        expect(providerTypes).toContain('Facebook');
        expect(providerTypes).toContain('Google');
        expect(providerTypes).toContain('LoginWithAmazon');
        expect(providerTypes).toContain('SignInWithApple');
      });
    });

    describe('...updating to add hosted ui provider after push', () => {
      it.only('...creates identity providers', async () => {
        await initJSProjectWithProfile(projRoot, defaultsSettings);
        await addAuthWithDefault(projRoot);
        await amplifyPushAuth(projRoot);

        await updateAuthWithDefaultSocial(projRoot);
        await amplifyPushAuth(projRoot);

        const providerTypes = getProviderTypes(projRoot);

        expect(providerTypes).toContain('Facebook');
        expect(providerTypes).toContain('Google');
        expect(providerTypes).toContain('LoginWithAmazon');
        expect(providerTypes).toContain('SignInWithApple');
      });
    });
  });
});
  