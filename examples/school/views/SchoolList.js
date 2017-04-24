import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import Table from '../components/Table';

import { all } from '../graphql/schools';

import '../graphql/schools';

export class SchoolList extends Component {
  static propTypes = {
    mutate: PropTypes.func,
    data: PropTypes.shape({
      loading: PropTypes.boolean,
      error: PropTypes.object,
    }),
  }

  static defaultProps = {
    loading: true,
    data: {
      schools: [],
    },
  }

  constructor() {
    super();
  }

  render() {
    const { data: { loading, error, schools } } = this.props;

    const schoolTable = !loading && !error ? (
      <Table items= {schools} omit={['__typename', 'active']} />
    ) : null;

    return (
      <div>
        <h2>List of Schools</h2>
        <div className="schoolsListContainer">
          <style jsx>{`
            .schoolsListContainer {
              height: 180px;
              overflow-x: scroll;
              background: #f1f1f1;
            }
          `}</style>
          {schoolTable}
        </div>
      </div>
    );
  }
}

const options = { pollInterval: 300 };
export default graphql(all, { options })(SchoolList);
