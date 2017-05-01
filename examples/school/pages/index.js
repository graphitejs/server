import { Component } from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/Layout.js';

export default class Index extends Component {
  static propTypes = {
    url: {
      query: {
        items: PropTypes.array,
      },
    },
  }

  static defaultProps = {
    url: {
      query: {
        items: [],
      },
    },
  }

  constructor() {
    super();
  }

  static async getInitialProps({ query }) {
    return { ...query };
  }

  render() {
    const { items } = this.props;

    return (
      <Layout items={JSON.parse(items)} >
        <h1>Home</h1>
      </Layout>
    );
  }
}
