import { Component } from 'react';
import PropTypes from 'prop-types';
import 'isomorphic-fetch';

import GraphiQL from 'graphiql';
import Layout from '../components/Layout.js';
import withData from '../lib/withData';
import NoSSR from 'react-no-ssr';

class GraphiQLView extends Component {

  static propTypes = {
    items: PropTypes.array,
  }

  constructor() {
    super();

    this.state = {
      defaultQuery: '',
      query: '',
      response: '',
      variables: '',
    };
  }

  static async getInitialProps({ store }) {
    const { adminGraphite } = store.getState();
    return { items: adminGraphite.items };
  }

  render() {
    const { items } = this.props;

    return (
      <Layout items={items}>
        <NoSSR>
          <GraphiQL fetcher={this.graphQLFetcher.bind(this)} {...this.state}>
            <GraphiQL.Logo>Graphite</GraphiQL.Logo>
          </GraphiQL>
        </NoSSR>
      </Layout>
    );
  }

  graphQLFetcher(graphQLParams) {
    return fetch('http://localhost:8001/graphql', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }
}

export default withData(GraphiQLView);
