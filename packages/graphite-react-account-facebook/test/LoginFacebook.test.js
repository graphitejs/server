import React from 'react';
import { mount } from 'enzyme';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;

import { LoginFacebook } from '../src/LoginFacebook';

describe('<LoginFacebook />', () => {
  let wrapper;

  global.localStorage = {
    getItem: sinon.spy(),
    setItem: sinon.spy(),
  };

  beforeEach(() => {
    wrapper = mount(<LoginFacebook />);
  });

  context('when create instance', () => {
    it('LoginFacebook should exist', () => {
      expect(wrapper).to.exist;
    });

    it('should be instance of my component', () => {
      const inst = wrapper.instance();
      expect(inst).to.be.instanceOf(LoginFacebook);
    });

    it('Should be render button element', () => {
      expect(wrapper.find('button')).to.exist;
    });
  });
});
