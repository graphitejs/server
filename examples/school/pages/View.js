import { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Layout from '../components/Layout.js';
import Link from 'next/link';
import Table from '../components/Table';
import Actions from '../views/Actions';
import withData from '../lib/withData';
import { get, isArray, isObject, isEmpty } from 'lodash';
import pluralize from 'pluralize';

class View extends Component {

  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
    }),
    items: PropTypes.array,
    model: PropTypes.string,
    schema: PropTypes.object,
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
      data: { loading: true },
    };
  }

  static async getInitialProps({ store, query, client }) {
    const model = query.model;
    const { adminGraphite } = store.getState();
    const queryModel = adminGraphite.graphql.reduce((acum, value) => {
      if (value[model]) {
        /* eslint-disable no-param-reassign */
        acum = value[model].query;
        /* eslint-enable no-param-reassign */
      }

      return acum;
    }, '');

    const data = await client.query({
      query: gql`${queryModel}`,
    });

    const getCurrentSchema = (adminData)  => {
      return adminData.graphql.reduce((acum, value) => {
        if (value[model]) {
          /* eslint-disable no-param-reassign */
          acum = Object.assign({}, value[model].schema);
          /* eslint-enable no-param-reassign */
        }
        return acum;
      }, {});
    };

    const schema = getCurrentSchema(adminGraphite);
    return { ...data, model, items: adminGraphite.items, schema };
  }


  render() {
    const { data: { loading, error }, items, model, schema } = this.props;
    const graphqlData = get(this.props.data, model, []);

    const reduceData = graphqlData.reduce((acum, item) => {
      const keys = Object.keys(item);

      const valuesWithRelations = keys.reduce((acum2, key) => {
        if (isArray(item[key])) {
          const obj = {};
          const value = item[key].map((i, j) => {
            let template = schema[key].template;

            Object.keys(i).forEach(x => {
              template = template.replace(`{${x}}`, i[x]);
            });

            template = isEmpty(template) ? i._id : template;

            return (
              <div>
                  <Link key={i._id} as={`/${pluralize(key, 1)}/${i._id}`} href= {{ pathname: '/Update', query: { model: pluralize(key, 2), id: i._id } }}><a>{template}</a></Link>
                  <br />
              </div>
            );
          });

          obj[key] = value;
          return Object.assign(acum2, obj);
        }

        if (isObject(item[key])) {
          let template = schema[key].template;
          const obj = {};
          Object.keys(item).forEach(x => {
            template = template.replace(`{${x}}`, item[x]);
          });

          template = isEmpty(template) ? item._id : template;
          obj[key] = (<Link key={item._id} as={`/${pluralize(key, 1)}/${item[key]._id}`} href= {{ pathname: '/Update', query: { model: pluralize(key, 2), id: item[key]._id } }}><a>{template}</a></Link>);
          return Object.assign(acum2, obj);
        }

        return acum2;
      }, {});

      acum.push(Object.assign({}, item, valuesWithRelations));
      return acum;
    }, []);

    const actions = {
      name: 'Actions',
      elements: (<Actions {...this.props} />),
    };

    const studentTable = !loading && !error ? (
      <Table items= {reduceData} actions={actions} omit={['__typename', 'active']} />
    ) : null;

    return (
      <Layout items={items} model={model} >
        <div>
          <div className="layout-header">
            <h2 className="main">{model}</h2>
          </div>
          {studentTable}
          <Link as={`/${pluralize(model, 1)}/create`} href= {{ pathname: '/Create', query: { model: pluralize(model, 2) } }}>
            <div className="btn-round">
              <span title="Create new">+</span>
            </div>
          </Link>
        </div>
      </Layout>
    );
  }
}

export default withData(View);
