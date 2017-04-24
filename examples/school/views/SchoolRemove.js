import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import Formsy from 'formsy-react';
import { remove } from '../graphql/schools';

class SchoolRemove extends Component {
  static propTypes = {
    id: PropTypes.string,
    mutate: PropTypes.func,
  }

  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <style jsx>{`
          div {
            display: inline-block;
            padding: 0 5px;
          }

          button {
            cursor: pointer;
          }
        `}</style>

        <Formsy.Form onValidSubmit={this.submit.bind(this)}>
          <button type="submit">Delete</button>
        </Formsy.Form>
      </div>
    );
  }

  async submit() {
    try {
      const { item: { _id } } = this.props;
      const { data } = await this.props.mutate({ variables: { id: _id }});
    } catch (e) {
    }
  }
}

export default compose(
  graphql(remove)
)(SchoolRemove);
