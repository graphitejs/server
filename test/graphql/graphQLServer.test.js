import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;

import GraphQLServer from '../../src/graphql/graphQLServer';

/* eslint-disable */
var graphQLServer;
var Graphite;
var collection1;
var collection2;
/* eslint-enable */

beforeEach(() => {
  collection1 = {
    aa: () => {},
    Types: 'aa',
    Query: 'aa',
    Mutation: 'aa',
    Resolvers: {
      MutationKeys: ['aa'],
      Mutation: {
        aa: () => {},
      },
    },
  };

  collection2 = {
    bb: () => {},
    Types: 'bb',
    Query: 'bb',
    Mutation: 'bb',
    Resolvers: {
      MutationKeys: ['bb'],
      Mutation: {
        bb: () => {},
      },
    },
  };

  Graphite = {
    use: sinon.spy(),
    listen: sinon.spy(),
  };

  graphQLServer = new GraphQLServer(Graphite);
  graphQLServer.debugGraphQLServer = sinon.spy();
  graphQLServer.logger = sinon.spy();
});

describe('graphQLServer', () => {
  describe('constructor', () => {
    it('should to be instance of graphQLServer', (done) => {
      expect(graphQLServer).to.be.an.instanceof(GraphQLServer);
      done();
    });
  });

  describe('logger', () => {
    it('should logger call debugGraphQLServer', (done) => {
      const e = {
        stack: 'Error',
      };
      graphQLServer.customLogger(e);
      expect(graphQLServer.logger).to.have.been.called;
      done();
    });
  });

  describe('listenGraphQl', () => {
    it('should listenGraphQl call debugGraphQLServer', (done) => {
      graphQLServer.listenGraphQl();
      expect(graphQLServer.logger).to.have.been.called;
      done();
    });
  });

  describe('executeInitialize', () => {
    context('when there are initialize method', () => {
      it('should call initialize', (done) => {
        const collection = {
          initialize: sinon.spy(),
        };
        graphQLServer.executeInitialize(collection);
        expect(collection.initialize).to.have.been.called;
        done();
      });
    });
  });

  describe('hasPropertyInitialize', () => {
    context('when there are initialize property', () => {
      it('should return true', (done) => {
        const collection = {
          initialize: sinon.spy(),
        };
        graphQLServer.hasPropertyInitialize(collection);
        expect(graphQLServer.hasPropertyInitialize(collection)).to.be.ok;
        done();
      });
    });

    context('when not there are initialize property', () => {
      it('should return false', (done) => {
        const collection = {};
        graphQLServer.hasPropertyInitialize(collection);
        expect(graphQLServer.hasPropertyInitialize(collection)).to.be.not.ok;
        done();
      });
    });
  });

  describe('requestApolloExpress', () => {
    context('when there are userId', () => {
      it('Should return object with schema and context with userId defined', (done) => {
        const request = {
          userId: '123456',
        };

        const response = graphQLServer.requestApolloExpress(request);
        expect(response.context.userId).eql('123456');
        expect(response).to.have.property('schema');
        done();
      });
    });

    context('when not there are userId', () => {
      it('Should return object with schema and context with userId undefined', (done) => {
        const request = {};
        const response = graphQLServer.requestApolloExpress(request);
        expect(response.context.userId).to.be.undefined;
        expect(response).to.have.property('schema');
        done();
      });
    });
  });

  describe('init', () => {
    it('should to be a function property init', (done) => {
      expect(graphQLServer.init).to.be.a('function');
      done();
    });

    context('when execute init default parameters', () => {
      it('should call use and listen', (done) => {
        graphQLServer.init();
        expect(Graphite.use).to.have.been.called;
        expect(Graphite.listen).to.have.been.called;
        done();
      });
    });

    context('when execute init without default parameters', () => {
      it('should call use and listen', (done) => {
        const config = {
          database: {
            PORT: 3001,
            NAME: 'Graphite',
          },
          graphql: {
            PORT: 8888888,
          },
          JwSToken: {
            SECRET: 'JwStrategy',
            EXPIRES_IN: 10000,
          },
        };

        graphQLServer.init(config, [collection1]);
        expect(Graphite.use).to.have.been.called;
        expect(Graphite.listen).to.have.been.called;
        done();
      });
    });
  });

  describe('register', () => {
    context('when collection is empty', () => {
      it('should to be Types, Query, Mutation a string and Resolvers a function', (done) => {
        const result = graphQLServer.register();
        expect(result.Types).to.be.a('string');
        expect(result.Query).to.be.a('string');
        expect(result.Mutation).to.be.a('string');
        expect(result.Resolvers).to.be.a('object');
        done();
      });
    });

    context('when collection has one', () => {
      it('should to be Types, Query, Mutation a string and Resolvers a function', (done) => {
        const collection = {
          aa: () => {},
          Types: 'aa',
          Query: 'aa',
          Mutation: 'aa',
          Resolvers: {
            MutationKeys: ['aa'],
            Mutation: {
              aa: () => {},
            },
          },
        };
        const result = graphQLServer.register([collection]);
        expect(result.Types).to.be.a('string').to.contain('aa');
        expect(result.Query).to.be.a('string').to.contain('aa');
        expect(result.Mutation).to.be.a('string').to.contain('aa');
        expect(result.Resolvers).to.be.a('object');
        expect(result.Resolvers.Mutation).to.be.a('object').to.have.property('aa');
        done();
      });
    });

    context('when collection has two', () => {
      it('should to be Types, Query, Mutation a string and Resolvers a function', (done) => {
        const result = graphQLServer.register([collection1, collection2]);
        expect(result.Types).to.be.a('string').to.contain('aa bb');
        expect(result.Query).to.be.a('string').to.contain('aa bb');
        expect(result.Mutation).to.be.a('string').to.contain('aa bb');
        expect(result.Resolvers).to.be.a('object');
        expect(result.Resolvers.Mutation).to.be.a('object').to.have.property('aa');
        expect(result.Resolvers.Mutation).to.be.a('object').to.have.property('bb');
        done();
      });
    });
  });
});
