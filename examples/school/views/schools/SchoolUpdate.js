import Link from 'next/link';
import Router from 'next/router';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import Formsy from 'formsy-react';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { edit, update } from '../../graphql/schools';
import { update as updateStudent } from '../../graphql/students';
import { get } from 'lodash';

class SchoolUpdate extends Component {
  static propTypes = {
    data: PropTypes.shape({
      students: PropTypes.array,
    }),
    updateSchool: React.PropTypes.func.isRequired,
    updateStudent: React.PropTypes.func.isRequired,
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
      students: [],
      id: '',
    };
  }

  componentDidMount() {
    this.setState({ id: Router.query.id });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ students: get(nextProps.data, 'students', []) });
  }

  render() {
    const { canSubmit } = this.state;
    const { data: { schools = [] } } = this.props;
    const { students } = this.state;
    const editedSchool = schools.filter(school => school._id === Router.query.id)[0] || {};
    const schoolStudents = students.filter(option => option.school && option.school._id === editedSchool._id);
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
          <h2>Edit school</h2>
          <Link href="/school">
            <a>view schools</a>
          </Link>
        </div>
        <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} >
          <Input name="name" title="Name" validationError="This is not a valid name" required value={editedSchool.name}/>
          <Input name="street" title="Street" validationError="This is not a valid street" required value={editedSchool.street}/>
          <button type="submit" disabled={!canSubmit}>Save</button>
          <Select ref={'student'} multiple name= {'student'} title= {'Choose students'} items={students}  keyLabel={'name'} keyValue={'_id'} />
          <button onClick={this.addItem.bind(this)}>Add</button>
          <Select ref={'studentDeletion'} multiple name= {'student'} title= {'Students Selected'} items={schoolStudents}  keyLabel={'name'} keyValue={'_id'} />
          <button onClick={this.removeItem.bind(this)}>Remove</button>
        </Formsy.Form>
      </div>
    );
  }

  addItem() {
    const { students } = this.state;
    const { student } = this.refs;
    const selected = student.getValue();

    students.forEach(value => {
      selected.forEach(selection => {
        if (value._id === selection) {
          const id = value._id;
          const variable = { ...value, school: this.state.id };
          delete variable._id;
          delete variable.__typename;

          this.props.updateStudent({ variables: { id, updateStudent: variable } });
        }
      });
    });
  }

  removeItem() {
    const { students } = this.state;
    const { studentDeletion } = this.refs;
    const selected = studentDeletion.getValue();

    students.forEach(value => {
      selected.forEach(selection => {
        if (value._id === selection) {
          const id = value._id;
          const variable = { ...value, school: '' };
          delete variable._id;
          delete variable.__typename;

          this.props.updateStudent({ variables: { id, updateStudent: variable } });
        }
      });
    });
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  async submit(model) {
    try {
      const variable = { ...model};
      delete variable.student;

      const { data } = await this.props.updateSchool(
        { variables: { id: this.state.id, updateSchool: variable } });
    } catch (e) {
    }
  }
}
const options = { pollInterval: 300 };
export default compose(
  graphql(edit, { options }),
  graphql(update, { ...options, name: 'updateSchool' }),
  graphql(updateStudent, { ...options, name: 'updateStudent' })
)(SchoolUpdate);
