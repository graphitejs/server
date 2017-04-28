import Link from 'next/link';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import Formsy from 'formsy-react';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { create } from '../../graphql/students';
import { all as schoolsAll } from '../../graphql/schools';

class StudentCreate extends Component {
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
      <style jsx>{`
          h2 {
            float: left;
          }
          a {
            float: right;
            padding: 30px;
          }
          .title {
            float: left;
            width: 100%;
          }
        `}
        </style>
        <div className="title">
          <h2>Create student</h2>
          <Link href="/student">
            <a>view students</a>
          </Link>
        </div>
        <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} >
          <Input name="name" title="Name" validationError="This is not a valid name" required />
          <Input name="street" title="Street" validationError="This is not a valid street" required />
          <Select name= {'school'} title= {'Choose your school'} items={schools}  keyLabel={'name'} keyValue={'_id'} />
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
      const { data } = await this.props.mutate({ variables: { newStudent: model }});
    } catch (e) {
    }
  }
}

export default compose(
  graphql(create),
  graphql(schoolsAll)
)(StudentCreate);
