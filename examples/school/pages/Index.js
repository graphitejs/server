import { Component } from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/Layout.js';
import withData from '../lib/withData';

class Index extends Component {
  static propTypes = {
    items: PropTypes.array,
  }

  static contextTypes = {
    store: PropTypes.object,
  }

  static defaultProps = {
    items: [],
  }

  constructor() {
    super();
  }

  static async getInitialProps({ store }) {
    const { adminGraphite } = store.getState();
    return { items: adminGraphite.items };
  }

  render() {
    const { items } = this.props;

    return (
      <Layout items={items} >
        <h1>Home</h1>
      </Layout>
    );
  }
}

export default withData(Index);
