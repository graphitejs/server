import { Component } from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import gql from 'graphql-tag';

export default class Remove extends Component {
  static propTypes = {
    id: PropTypes.string,
    mutate: PropTypes.func,
    url: PropTypes.object,
  }

  static contextTypes = {
    store: PropTypes.object,
    client: PropTypes.object,
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
      const { client, store } = this.context;
      const { item: { _id } } = this.props;
      const { model } = this.props.url.query;
      const { adminGraphite } = store.getState();

      const removeModel = adminGraphite.graphql.reduce((acum, value) => {
        if (value[model]) {
          /* eslint-disable no-param-reassign */
          acum = value[model].mutation.remove;
          /* eslint-enable no-param-reassign */
        }

        return acum;
      }, '');

      const data = await client.mutate({
        mutation: gql`${removeModel}`,
        variables: { id: _id },
      });
    } catch (e) {
      console.log("error ",e);
    }
  }
}
