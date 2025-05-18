export const ROUTES = {
  PUBLIC_TOKEN: {
    URL: '/public-token',
    METHOD: 'GET',
    SUMMARY: 'Create a public token',
    DESCRIPTION: 'Create a public token to use in routes that need public key',
    TAGS: 'Public Token',
  },
  AUTH: {
    LOGIN: {
      URL: '/auth/login',
      METHOD: 'POST',
      SUMMARY: 'Login a user',
      DESCRIPTION: 'Login a user to get access and refresh tokens',
      TAGS: 'Auth',
    },
  },
};
