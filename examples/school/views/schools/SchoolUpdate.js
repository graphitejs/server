import Link from 'next/link';
import Router from 'next/router';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import Formsy from 'formsy-react';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { edit, update } from '../../graphql/schools';
import { get } from 'lodash';

class SchoolUpdate extends Component {
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
    const studentsSelected = [];

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
          <Select ref={'student'} multiple name= {'student'} title= {'Choose students'} items={students}  keyLabel={'name'} keyValue={'_id'} />
          <button onClick={this.addItem.bind(this)}>Add</button>
          <Select multiple name= {'student'} title= {'Students Selected'} items={studentsSelected}  keyLabel={'name'} keyValue={'_id'} />
          <button onClick={this.removeItem.bind(this)}>Remove</button>
          <button type="submit" disabled={!canSubmit}>Save</button>
        </Formsy.Form>
      </div>
    );
  }

  addItem(event) {
    debugger
    const { student } = this.refs;
    const selected = event.target;
    const values = [...selected.options].filter(option => option.selected).map(option => option.value);
  }

  removeItem(event) {

  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  async submit(model) {
    try {
      const { data } = await this.props.mutate({ variables: { id: this.state.id, updateSchool: model } });
    } catch (e) {
    }
  }
}
const options = { pollInterval: 300 };
export default compose(
  graphql(edit, { options }),
  graphql(update, { options })
)(SchoolUpdate);
