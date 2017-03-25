import account from '@graphite/mongoose-account';
import { JwSToken } from './config/default';

account.setConfig(JwSToken);

/* eslint-disable no-console */
account.onBeforeCreate(function(data) {
  console.log(`Method onBeforeCreate - data: ${JSON.stringify(data)}`);
  return data;
});

account.onAfterCreate(function(data) {
  console.log(`Method onAfterCreate - data: ${JSON.stringify(data)}`);
});

export default account;
