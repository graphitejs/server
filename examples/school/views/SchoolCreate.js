import { Component } from 'react';
import { graphql } from 'react-apollo';
import Formsy from 'formsy-react';
import Input from '../components/Input';
import { create } from '../graphql/schools';

class SchoolCreate extends Component {
  constructor() {
    super();

    this.state = {
      canSubmit: false,
    };
  }

  render() {
    const { canSubmit } = this.state;

    return (
      <div>
        <h2>Create school</h2>
        <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} >
          <Input name="name" title="Name" validationError="This is not a valid name" required />
          <Input name="street" title="Street" validationError="This is not a valid street" required />
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

export default graphql(create)(SchoolCreate);
