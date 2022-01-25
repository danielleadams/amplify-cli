import { TransformerContextProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { printer } from 'amplify-prompts';
import { AuthRule } from '../utils';

export const showDefaultIdentityClaimWarning = (context: TransformerContextProvider, rules?: AuthRule[]) => {
  rules = rules || [];
  const usesCognitoUsernameAsDefault = !context.featureFlags?.getBoolean('useSubForDefaultIdentityClaim');
  const usesDefaultIdentityClaim = rules.some(rule => rule.allow === 'owner' && rule.identityClaim === undefined);

  if (usesCognitoUsernameAsDefault && usesDefaultIdentityClaim) {
    printer.warn(
      ` WARNING: Amplify CLI will change the default identity claim from 'cognito:username' ` +
        `to use 'sub'. To continue using usernames, set 'identityClaim: "cognito:username"' on your ` +
        `'owner' rules on your schema. The default will be officially switched with v8.0.0. To read ` +
        `more: https://link.to/docs-and-migration-gudes`,
    );
  }
};
