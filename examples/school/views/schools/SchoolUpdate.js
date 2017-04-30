import Link from 'next/link';
import Router from 'next/router';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import Formsy from 'formsy-react';
import Input from '../../components/Input';
import MultiSelect from '../../components/MultiSelect';
import { edit, update } from '../../graphql/schools';
import { update as updateStudent } from '../../graphql/students';
import { get, differenceBy, omit } from 'lodash';

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
    const selectedItem = get(editedSchool, 'student', []);
    const differenceItems = differenceBy(students, selectedItem, '_id');

    return (
      <div>
        <div className="layout-header">
          <Link href="/school">
            <a>Schools</a>
          </Link>
          <h2>-></h2>
          <h2>Edit school</h2>
        </div>
        
        <Formsy.Form onSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} >
          <Input name="name"
                 title="Name"
                 validationError="This is not a valid name"
                 required value={editedSchool.name}/>

          <Input name="street"
                 title="Street"
                 validationError="This is not a valid street"
                 required value={editedSchool.street}/>

          <MultiSelect name="student"
                       items={students}
                       selectedItems={selectedItem} />

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
      const variables = { id: this.state.id, updateSchool: omit(model, 'list') };
      const { data } = await this.props.updateSchool({ variables });
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
