import React from 'react';
import { shallow } from 'enzyme';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import { CreateUser, LoginPassword } from '../dist/account';

describe('<Account />', () => {
  var wrapper;

  global.localStorage = {
    getItem: sinon.spy(),
    setItem: sinon.spy()
  }

  beforeEach(() => {
    const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/graphql' });
    const client = new ApolloClient({ networkInterface, dataIdFromObject: r => r.id });
    wrapper = shallow(
      <ApolloProvider client={client}>
        <div>
          <CreateUser />
          <LoginPassword />
        </div>
      </ApolloProvider>);
  });

  it('CreateUser should exist', () => {
    expect(wrapper).to.exist;
  });

  it('should be instance of my component', () => {
    const inst = wrapper.instance();
    expect(inst).to.be.instanceOf(ApolloProvider);
  });
});
