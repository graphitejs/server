import React from 'react';
import { mount } from 'enzyme';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;

import Logout from '../src/Logout';

describe('<Logout />', () => {
  let wrapper;

  global.localStorage = {
    getItem: sinon.stub(),
    setItem: sinon.stub(),
  };

  beforeEach(() => {
    localStorage.getItem.withArgs('Graphite.userId').returns('123456');
    wrapper = mount(<Logout />);
  });

  context('when create instance', () => {
    it('Logout should exist', () => {
      expect(wrapper).to.exist;
    });

    it('should be instance of my component', () => {
      const inst = wrapper.instance();
      expect(inst).to.be.instanceOf(Logout);
    });

    it('Should be render button element', () => {
      expect(wrapper.find('button')).to.exist;
    });
  });

  context('when interactive', () => {
    context('when isLoggedIn is true and I do click', () => {
      it('Should set isLoggedIn to false', () => {
        wrapper.find('button').simulate('click');
        expect(wrapper.state().isLoggedIn).to.be.false;
      });
    });

    context('when loggedIn', () => {
      it('Should set isLoggedIn to true', () => {
        const instance = wrapper.instance();
        instance.loggedIn();
        expect(wrapper.state().isLoggedIn).to.be.true;
      });
    });
  });
});
