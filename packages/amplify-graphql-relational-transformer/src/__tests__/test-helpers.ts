export const featureFlags = {
  getBoolean: jest.fn().mockImplementation((name, defaultValue) => {
    if (name === 'useSubForDefaultIdentityClaim') {
      return true;
    }
    return defaultValue;
  }),
  getString: jest.fn(),
  getNumber: jest.fn(),
  getObject: jest.fn(),
};
