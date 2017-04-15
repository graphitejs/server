import React from 'react';
import { mount } from 'enzyme';
import afterUpdate from 'enzyme-after-update';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;

import { CreateUser } from '../src/CreateUser';

describe('<CreateUser />', () => {
  let wrapper;
  let wrapperFailed;
  let wrapperThrow;

  const success = {
    data: {
      createUser: {
        loginToken: '123456',
        loginTokenExpires: 0,
        userId: '123456',
      },
    },
  };

  const failed = {
    data: {},
  };

  const responseSuccess = () => Promise.resolve(success);
  const responseFailed = () => Promise.resolve(failed);
  const responseThrow = () => Promise.reject(failed);

  beforeEach(() => {
    global.localStorage = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
    };

    wrapper = mount(<CreateUser mutate= {responseSuccess} />);
    wrapperFailed = mount(<CreateUser mutate= {responseFailed} />);
    wrapperThrow = mount(<CreateUser mutate= {responseThrow} />);
  });

  afterEach(() => {
    global.localStorage.getItem.reset();
    global.localStorage.setItem.reset();
  });

  context('when create instance', () => {
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

  context('when interactive', () => {
    context('when submit', () => {
      context('when there are createUser', () => {
        it('Should set loginToken, loginTokenExpires and userId', () => {
          wrapper.find('form').simulate('submit');
          afterUpdate(wrapper).then(function() {
            expect(wrapper.state().loginToken).eql('123456');
            expect(wrapper.state().loginTokenExpires).eql(0);
            expect(wrapper.state().userId).eql('123456');
          });
        });
      });

      context('when not there are createUser', () => {
        it('Should be loginToken, loginTokenExpires and userId', () => {
          wrapperFailed.find('form').simulate('submit');
          afterUpdate(wrapperFailed).then(function() {
            expect(wrapper.state().loginToken).to.be.undefined;
            expect(wrapper.state().loginTokenExpires).to.be.undefined;
            expect(wrapper.state().userId).to.be.undefined;
          });
        });
      });

      context('when throw', () => {
        it('Should be isLoggedIn false, loginToken, loginTokenExpires and userId empty', () => {
          wrapperThrow.find('form').simulate('submit');
          afterUpdate(wrapperThrow).then(function() {
            expect(wrapper.state().isLoggedIn).to.be.false;
            expect(wrapper.state().loginToken).to.be.empty;
            expect(wrapper.state().loginTokenExpires).to.be.empty;
            expect(wrapper.state().userId).to.be.empty;
          });
        });
      });
    });

    context('when logout', () => {
      it('Should be isLoggedIn false, loginToken, loginTokenExpires and userId empty', () => {
        wrapper.instance().logout();
        expect(wrapper.state().isLoggedIn).to.be.false;
        expect(wrapper.state().loginToken).to.be.empty;
        expect(wrapper.state().loginTokenExpires).to.be.empty;
        expect(wrapper.state().userId).to.be.empty;
      });
    });
  });
});
