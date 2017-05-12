import { Component } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout.js';
import gql from 'graphql-tag';
import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import withData from '../lib/withData';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
import Input from '../components/Input';
import Select from '../components/Select';
import MultiSelect from '../components/MultiSelect';
import DatepickerInput from '../components/DatepickerInput';
import { get, upperFirst, pick } from 'lodash';

const { Checkbox, CheckboxGroup, RadioGroup } = FRC;

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

  getItemsWithTemplate(schema, attr) {
    let itemWithTemplate = [];

    if (schema[attr].type === 'hasOne' || schema[attr].type === 'hasMany') {
      const itemsSafe = get(schema[attr].data, pluralize(attr, 2), []);
      itemWithTemplate = itemsSafe.reduce((acum, value) => {
        let template = schema[attr].template;
        Object.keys(value).forEach(x => {
          template = template.replace(`{${x}}`, value[x]);
        });
        acum.push(Object.assign({}, value, { template }));
        return acum;
      }, []);
    }

    return itemWithTemplate;
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
              const itemWithTemplate = this.getItemsWithTemplate(schema, attr);

              switch (schema[attr].type) {
              case 'String':
                if (schema[attr].enum) {
                  const options = schema[attr].enum.map(option => {
                    return {
                      value: option,
                      label: option,
                    };
                  });

                  return (
                    <RadioGroup
                        name={attr}
                        value={schema[attr].default}
                        label={attr}
                        help=""
                        options={options} />
                  );
                }
                return <Input key={attr} name={attr} title={attr} validationError="This is not a valid name" required />;

              case '[String]':
                if (schema[attr].enum) {
                  const options = schema[attr].enum.map(option => {
                    return {
                      value: option,
                      label: option,
                    };
                  });

                  return (
                    <CheckboxGroup
                        name={attr}
                        value={[schema[attr].default]}
                        label={attr}
                        help=""
                        options={options} />
                  );
                }
                return <p>Not options.</p>;

              case 'Boolean':
                return <Checkbox
                          key={attr}
                          name={attr}
                          value={schema[attr].default}
                          label={attr}
                          valueLabel="" />;

              case 'Date':
                return <DatepickerInput
                          name={attr}
                          placeholder="DD/MM/YYYY"
                          format="DD/MM/YYYY"
                          dayPickerProps={{
                            enableOutsideDays: true,
                          }} />;

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
