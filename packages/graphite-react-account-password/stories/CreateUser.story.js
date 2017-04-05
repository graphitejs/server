import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { CreateUser } from '../src/CreateUser';

const mutateSuccess = () => {
  return {
    data: {
      createUser: {
        loginToken: '',
        loginTokenExpires: '',
        userId: ''
      }
    }
  }
};

const mutateError = () => {
  return {
    data: {
      errors: {
      }
    }
  }
};

storiesOf('CreateUser', module)
  .add('Default success', () => (
    <CreateUser mutate={mutateSuccess} />
  ))
  .add('Default error', () => (
    <CreateUser mutate={mutateError} />
  ))
