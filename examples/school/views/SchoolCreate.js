import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import Formsy from 'formsy-react';
import Input from '../components/Input';
import Select from '../components/Select';
import { create } from '../graphql/schools';
import { all as studentsAll } from '../graphql/students';

class SchoolCreate extends Component {
  static propTypes = {
    data: PropTypes.shape({
      students: PropTypes.array,
    }),
  }

  static defaultProps = {
    data: {
      students: [],
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
    const { data: { students } } = this.props;

    return (
      <div>
        <h2>Create school</h2>
        <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} >
          <Input name="name" title="Name" validationError="This is not a valid name" required />
          <Input name="street" title="Street" validationError="This is not a valid street" required />
          <Select multiple name= {'student'} title= {'Choose students'} items={students}  keyLabel={'name'} keyValue={'_id'} />
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
      const { data } = await this.props.mutate({ variables: { newSchool: model }});
    } catch (e) {
    }
  }
}

export default compose(
  graphql(create),
  graphql(studentsAll)
)(SchoolCreate);
