export const database = ({
  PORT: 3001,
  NAME: 'Example-mars-mongoose-accounts',
});

export const graphql = ({
  PORT: 8001,
});

export const JwSToken = ({
  SECRET: 'exmapleAccounts',
  EXPIRES_IN: 10000,
});

export const facebook = ({
  APPID: '1471216883135083',
  SECRET: '48797c6b62e426a6f9f89c8ce71374fd',
  REDIRECT: 'http://localhost:4000/login/facebook/',
});
