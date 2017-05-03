import { Component } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout.js';
import gql from 'graphql-tag';
import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import withData from '../lib/withData';
import Formsy from 'formsy-react';
import Input from '../components/Input';
import Select from '../components/Select';
import MultiSelect from '../components/MultiSelect';

class Create extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
    }),
    items: PropTypes.array,
    model: PropTypes.string,
  }

  static defaultProps = {
    data: {
      loading: true,
    },
    items: [],
  }

  constructor() {
    super();

    this.state = {
      canSubmit: false,
    };
  }

  static async getInitialProps({ store, query, client }) {
    const model = query.model;
    const { adminGraphite } = store.getState();
    const dataModel = adminGraphite.graphql.reduce((acum, value) => {
      if (value[model]) {
        /* eslint-disable no-param-reassign */
        acum = value[model];
        /* eslint-enable no-param-reassign */
      }

      return acum;
    }, '');

    Object.keys(dataModel.schema).forEach(async attr => {
      if (dataModel.schema[attr].type === 'hasMany' || dataModel.schema[attr].type === 'hasOne') {
        const data = await client.query({
          query: gql`${dataModel.schema[attr].queryResolver}`,
        });

        dataModel.schema[attr] = { ...dataModel.schema[attr], ...data };
      }
    });

    return { model, items: adminGraphite.items, dataModel };
  }

  render() {
    const { items, model, dataModel } = this.props;
    const { canSubmit } = this.state;
    const { schema } = dataModel;

    return (
      <Layout items={items} >
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
              <h2>Create {model}</h2>
              <Link as={`/${pluralize(model, 1)}`} href= {{ pathname: '/View', query: { model: pluralize(model, 2) } }}>
                <a>view {pluralize(model, 2)}</a>
              </Link>
            </div>
            <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} >

              { Object.keys(schema).map(attr => {
                switch (schema[attr].type) {
                case 'String':
                  return <Input key={attr} name={attr} title={attr} validationError="This is not a valid name" required />;
                case 'Boolean':
                  return <Input key={attr} type={'checkbox'} name={attr} title={attr} />;
                case 'hasOne':
                  return <Select key={attr} name={attr} title={attr} items={schema[attr].data[pluralize(attr, 2)]}  keyLabel={'name'} keyValue={'_id'} />;
                case 'hasMany':
                  return <MultiSelect key={attr} name={attr} items={schema[attr].data[pluralize(attr, 2)]} selectedItems={[]} />;
                default:
                  return null;
                }
              })}

              <button type="submit" disabled={!canSubmit}>Submit</button>
            </Formsy.Form>
          </div>
        </Layout>
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
      //console.log("model submit",model);
      //const { data } = await this.props.mutate({ variables: { newStudent: model }});
    } catch (e) {
    }
  }
}

export default withData(Create);
