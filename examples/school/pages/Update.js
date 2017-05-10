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

    const getDataModel = (graphqlData) => {
      return graphqlData.graphql.reduce((acum, value) => {
        if (value[model]) {
          /* eslint-disable no-param-reassign */
          acum = value[model];
          /* eslint-enable no-param-reassign */
        }

        return acum;
      }, '');
    };

    const getAllItemRelationsData = async (currentModel) => {
      Object.keys(currentModel.schema).forEach(async attr => {
        if (currentModel.schema[attr].type === 'hasMany' || currentModel.schema[attr].type === 'hasOne') {
          const data = await client.query({
            query: gql`${currentModel.schema[attr].queryResolver}`,
          });
          currentModel.schema[attr] = { ...currentModel.schema[attr], ...data };
        }
      });
    };

    const getItemData = async (currentModel, id) => {
      const dataCurrentModel = await client.query({
        query: gql`${currentModel.queryOne}`,
        variables: { id: id },
      });

      return dataCurrentModel.data[model][0];
    };

    const dataModel = getDataModel(adminGraphite);
    getAllItemRelationsData(dataModel);
    dataModel.currentData = await getItemData(dataModel, modelID);

    return { model, items: adminGraphite.items, dataModel, modelID };
  }

  render() {
    const { items, model, dataModel } = this.props;
    const { canSubmit } = this.state;
    const { schema } = dataModel;

    return (
      <Layout items={items} model={model} >
        <div>
            <div className="layout-header">
              <Link as={`/${pluralize(model, 1)}`} href= {{ pathname: '/View', query: { model: pluralize(model, 2) } }}>
                <a>{pluralize(model, 2)}</a>
              </Link>
              <h2>-></h2>
              <h2>Update {model}</h2>
            </div>
            <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} >

              { Object.keys(schema).map(attr => {
                let itemsSafe = [];
                let itemWithTemplate = [];
                let selectedItems = [];
                let selectedItemsWithTemplate = [];
                let selectValue = null;
                if (schema[attr].type === 'hasOne' || schema[attr].type === 'hasMany') {
                  const getValueSelected = get(dataModel.currentData, pluralize(attr, 1), []);
                  if (getValueSelected !== null) {
                    selectValue = getValueSelected._id;
                  }
                  if (schema[attr].type === 'hasMany') {
                    selectedItems = get(dataModel.currentData, pluralize(attr, 1), []).map(i => (i));
                    selectedItemsWithTemplate = selectedItems.reduce((acum, value) => {
                      let template = schema[attr].template;
                      Object.keys(value).forEach(x => {
                        template = template.replace(`{${x}}`, value[x]);
                      });
                      acum.push(Object.assign({}, value, { template }));
                      return acum;
                    }, []);
                  }
                  itemsSafe = get(schema[attr].data, pluralize(attr, 2), []);
                  itemWithTemplate = itemsSafe.reduce((acum, value) => {
                    let template = schema[attr].template;
                    Object.keys(value).forEach(x => {
                      template = template.replace(`{${x}}`, value[x]);
                    });
                    acum.push(Object.assign({}, value, { template }));
                    return acum;
                  }, []);
                }
                switch (schema[attr].type) {
                case 'String':
                  return <Input key={attr} value={dataModel.currentData[attr]} name={attr} title={attr} validationError="This is not a valid name" required />;
                case 'Boolean':
                  return <Input key={attr} value={dataModel.currentData[attr]} type={'checkbox'} name={attr} title={attr} />;
                case 'hasOne':
                  return <Select key={attr} value={selectValue} name={attr} title={attr} items={itemWithTemplate}  keyLabel={'name'} keyValue={'_id'} />;
                case 'hasMany':
                  return <MultiSelect key={attr} name={attr} items={itemWithTemplate} selectedItems={selectedItemsWithTemplate} />;
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
      const { client } = this.context;
      const { model, modelID } = this.props;
      const { update } = this.props.dataModel.mutation;
      const { schema } = this.props.dataModel;
      const keysSchema = Object.keys(schema);

      const nameModelUppper = pluralize(upperFirst(model), 1);
      const variables = { id: modelID };
      variables[`update${nameModelUppper}`] = pick(dataForm, ...keysSchema);
      const data = await client.mutate({
        mutation: gql`${update}`,
        variables,
      });

    } catch (e) {
    }
  }
}

export default withData(Update);
