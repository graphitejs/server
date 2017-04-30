import Link from 'next/link';
import Router from 'next/router';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import Formsy from 'formsy-react';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { edit, update } from '../../graphql/students';
import { get } from 'lodash';

class StudentUpdate extends Component {
  static propTypes = {
    data: PropTypes.shape({
      students: PropTypes.array,
    }),
  }

  static defaultProps = {
    data: {
      students: [],
      schools: [],
    },
  }

  constructor() {
    super();

    this.state = {
      canSubmit: false,
      id: '',
    };
  }

  componentDidMount() {
    this.setState({ id: Router.query.id });
  }

  render() {
    const { canSubmit } = this.state;
    const { data: { students = [], schools } } = this.props;
    const editedStudent = students.filter(student => student._id === Router.query.id)[0] || {};
    const defaultSchool = get(editedStudent.school, '_id', undefined);
    return (
      <div>
        <div className="layout-header">
          <Link href="/student">
            <a>Students</a>
          </Link>
          <h2>-></h2>
          <h2>Edit student</h2>
        </div>
        <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} >
          <Input name="name" title="Name" validationError="This is not a valid name" required value={editedStudent.name}/>
          <Input name="street" title="Street" validationError="This is not a valid street" required value={editedStudent.street}/>
          <Select name= {'school'} defaultDisplay= {defaultSchool} title= {'Choose school'} items={schools}  keyLabel={'name'} keyValue={'_id'}/>
          <Input type= {'checkbox'} name= {'active'} title="Active" value= {editedStudent.active} checked= {editedStudent.active}/>
          <button type="submit" disabled={!canSubmit}>Save</button>
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
      const { data } = await this.props.mutate({ variables: {
        id: this.state.id,
        updateStudent: {
          ...model,
          school: model.school[0] }},
      });
    } catch (e) {
    }
  }
}

const options = { pollInterval: 300 };
export default compose(
  graphql(edit, { options }),
  graphql(update)
)(StudentUpdate);
