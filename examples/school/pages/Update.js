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
import { get, upperFirst, pick } from 'lodash';
import Router from 'next/router';

class Update extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
    }),
    items: PropTypes.array,
    model: PropTypes.string,
    dataModel: PropTypes.object,
  }

  static contextTypes = {
    client: PropTypes.object,
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
    const modelID = query.id;
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

    await Object.keys(dataModel.schema).forEach(async attr => {
      if (dataModel.schema[attr].type === 'hasMany' || dataModel.schema[attr].type === 'hasOne') {
        const data = await client.query({
          query: gql`${dataModel.schema[attr].queryResolver}`,
        });

        dataModel.schema[attr] = { ...dataModel.schema[attr], ...data };
      }
    });

    const dataCurrentModel = await client.query({
      query: gql`${dataModel.queryOne}`,
      variables: { id: modelID },
    });

    dataModel.currentData = dataCurrentModel.data[model][0];
    return { model, items: adminGraphite.items, dataModel, modelID };
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
              <h2>Update {model}</h2>
              <Link as={`/${pluralize(model, 1)}`} href= {{ pathname: '/View', query: { model: pluralize(model, 2) } }}>
                <a>view {pluralize(model, 2)}</a>
              </Link>
            </div>
            <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} >

              { Object.keys(schema).map(attr => {
                let itemsSafe = [];
                if (schema[attr].type === 'hasOne' || schema[attr].type === 'hasMany') {
                  itemsSafe = get(schema[attr].data, pluralize(attr, 2), []);
                }
                switch (schema[attr].type) {
                case 'String':
                  return <Input key={attr} value={dataModel.currentData[attr]} name={attr} title={attr} validationError="This is not a valid name" required />;
                case 'Boolean':
                  return <Input key={attr} value={dataModel.currentData[attr]} type={'checkbox'} name={attr} title={attr} />;
                case 'hasOne':
                  return <Select key={attr} name={attr} title={attr} items={itemsSafe}  keyLabel={'name'} keyValue={'_id'} />;
                case 'hasMany':
                  return <MultiSelect key={attr} name={attr} items={itemsSafe} selectedItems={[]} />;
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

  async submit(dataForm) {
    try {
      debugger
      const { client } = this.context;
      const { model, modelID } = this.props;
      const { update } = this.props.dataModel.mutation;
      const { schema } = this.props.dataModel;
      const keysSchema = Object.keys(schema);

      const nameModelUppper = pluralize(upperFirst(model), 1);
      const variables = { id: modelID };
      variables[`update${nameModelUppper}`] = pick(dataForm, ...keysSchema);
      console.log("update ",update);
      const data = await client.mutate({
        mutation: gql`${update}`,
        variables,
      });

      console.log("data ",data);
    } catch (e) {
      console.log("e ",e);
    }
  }
}

export default withData(Update);
