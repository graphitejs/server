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
import { get, upperFirst, pick, isArray, isString } from 'lodash';

class Create extends Component {
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

    return { model, items: adminGraphite.items, dataModel };
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
            <h2>Create {model}</h2>
          </div>

          <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} >
            { Object.keys(schema).map(attr => {
              let itemsSafe = [];
              let itemWithTemplate = [];
              if (schema[attr].type === 'hasOne' || schema[attr].type === 'hasMany') {
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
                if (schema[attr].enum) {
                  const options = schema[attr].enum.map((option, i) => {
                    return (
                      <label>{option}  <Input key={attr} type={'radio'} name={attr} value={option} checked={ schema[attr].default === option } /> </label>
                    );
                  });

                  return (
                    <fieldset>
                      <legend>{attr}</legend>
                      {options}
                    </fieldset>
                  );
                }
                return <Input key={attr} name={attr} title={attr} validationError="This is not a valid name" required />;
              case '[String]':
                if (schema[attr].enum) {
                  const options = schema[attr].enum.map((option, i) => {
                    let checked = false;
                    if (isString(schema[attr].default)) {
                      checked = schema[attr].default === option;
                    }

                    if (isArray(schema[attr].default)) {
                      checked = schema[attr].default.indexOf(option) > -1 ? true : false;
                    }
                    return (
                      <label>{option}  <Input key={attr} type={'checkbox'} name={`${attr}[${i}]`} value={option} checked={ checked } /> </label>
                    );
                  });

                  return (
                    <fieldset>
                      <legend>{attr}</legend>
                      {options}
                    </fieldset>
                  );
                }
                return <p>Not options.</p>;
              case 'Boolean':
                return <Input key={attr} type={'checkbox'} name={attr} title={attr} />;
              case 'hasOne':
                return <Select key={attr} name={attr} title={attr} items={itemWithTemplate}  keyLabel={'template'} keyValue={'_id'} />;
              case 'hasMany':
                return <MultiSelect key={attr} name={attr} items={itemWithTemplate} selectedItems={[]} />;
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
      const { model } = this.props;
      const { create } = this.props.dataModel.mutation;
      const { schema } = this.props.dataModel;
      const keysSchema = Object.keys(schema);

      const nameModelUppper = pluralize(upperFirst(model), 1);
      const variables = {};
      variables[`new${nameModelUppper}`] = pick(dataForm, ...keysSchema);

      const data = await client.mutate({
        mutation: gql`${create}`,
        variables,
      });
    } catch (e) {
    }
  }
}

export default withData(Create);
