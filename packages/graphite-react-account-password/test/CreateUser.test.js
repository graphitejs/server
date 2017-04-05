import React from 'react';
import { shallow } from 'enzyme';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;

import { CreateUser } from '../src/CreateUser';

describe('<CreateUser />', () => {
  var wrapper;

  global.localStorage = {
    getItem: sinon.spy(),
    setItem: sinon.spy()
  }

  beforeEach(() => {
    wrapper = shallow(<CreateUser />);
  });

  it('CreateUser should exist', () => {
    expect(wrapper).to.exist;
  });

  it('should be instance of my component', () => {
    const inst = wrapper.instance();
    expect(inst).to.be.instanceOf(CreateUser);
  });

  it('Should be render button element', () => {
    expect(wrapper.find('button')).to.exist;
  });
});
