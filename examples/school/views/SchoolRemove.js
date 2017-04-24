import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import Formsy from 'formsy-react';
import Select from '../components/Select';
import { remove } from '../graphql/schools';
import { all as schoolsAll } from '../graphql/schools';

class SchoolRemove extends Component {
  static propTypes = {
    data: PropTypes.shape({
      schools: PropTypes.array,
    }),
  }

  static defaultProps = {
    data: {
      schools: [],
    },
  }

  constructor() {
    super();

    this.state = {
      canSubmit: false,
    };
  }

  render() {
    const { canSubmit } = this.state;
    const { data: { schools } } = this.props;

    return (
      <div>
        <h2>Delete school</h2>
        <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} >
          <Select name= {'schools'} title= {'Choose school'} items={schools}  keyLabel={'name'} keyValue={'_id'} required />
          <button type="submit" disabled={!canSubmit}>Submit</button>
        </Formsy.Form>
      </div>
    );
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  async submit(model) {
    try {
      const { data } = await this.props.mutate({ variables: { id: model.schools[0] }});
    } catch (e) {
    }
  }
}

export default compose(
  graphql(remove),
  graphql(schoolsAll)
)(SchoolRemove);
