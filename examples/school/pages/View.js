import { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Layout from '../components/Layout.js';
import Link from 'next/link';
import Table from '../components/Table';
import StudentActions from '../views/students/StudentActions';
import withData from '../lib/withData';
import { get } from 'lodash';

class View extends Component {

  static propTypes = {
    data: {
      loading: PropTypes.bool,
    },
    items: PropTypes.array,
    model: PropTypes.string,
  }

  static contextTypes = {
    store: PropTypes.object,
  }

  static defaultProps = {
    data: {
      loading: true,
    },
    items: [],
    model: 'students',
  }

  constructor() {
    super();
    this.state = {
      data: { loading: true },
    };
  }

  static async getInitialProps({ store, query, client }) {
    const model = query.model;
    const { adminGraphite } = store.getState();
    const querys = get(adminGraphite, 'graphql.query', {});
    const findQuery = querys.find(value => value[model]);
    const graphqlQuery = Object.values(findQuery)[0];

    const data = await client.query({
      query: gql`${graphqlQuery}`,
    });

    return { ...data, model, items: adminGraphite.items };
  }

  render() {
    const { data: { loading, error }, items, model } = this.props;
    const graphqlData = get(this.props.data, model, []);

    const actions = {
      name: 'Actions',
      elements: (<StudentActions />),
    };

    const studentTable = !loading && !error ? (
      <Table items= {graphqlData} actions={actions} omit={['__typename', 'active']} />
    ) : null;

    return (
      <Layout items={items} >
        <div>
          <style jsx>{`
              h2 {
                float: left;
              }
              a {
                float: right;
                padding: 30px;
              }
              `}
            </style>
            <div>
              <h2>{model}</h2>
              <Link href="/{model}/create">
                <a>Add {model}</a>
              </Link>
            </div>
            {studentTable}
          </div>
        </Layout>
    );
  }
}

export default withData(View);
