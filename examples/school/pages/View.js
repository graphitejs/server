import { Component } from 'react';
import PropTypes from 'prop-types';
import apollo from '../lib/apollo';
import gql from 'graphql-tag';
import Layout from '../components/Layout.js';
import Link from 'next/link';
import Table from '../components/Table';
import StudentActions from '../views/students/StudentActions';

export default class View extends Component {

  static propTypes = {
    items: PropTypes.array,
  }

  constructor() {
    super();
  }

  static async getInitialProps({ query }) {
    try {
      const data = await apollo.query({
        query: gql`${query.all}`,
      });

      return { ...data, ...query };
    } catch (e) {
      console.log("Error ",e);
      return {};
    }
  }

  render() {
    const { items } = this.props;
    const { data: { loading, error, students }, model } = this.props;

    const actions = {
      name: 'Actions',
      elements: (<StudentActions />),
    };

    const studentTable = !loading && !error ? (
      <Table items= {students} actions={actions} omit={['__typename', 'active']} />
    ) : null;

    return (
      <Layout items={JSON.parse(items)} >
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
