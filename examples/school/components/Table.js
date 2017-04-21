import { Component, PropTypes } from 'react';
import { keys, pullAll, values, omit as omitKeys } from 'lodash';

export default class Table extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    omit: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    items: [{}],
    omit: '',
  }

  constructor() {
    super();
  }

  render() {
    const { items, omit } = this.props;
    const keyItems = pullAll(keys(items[0]), omit);

    return (
      <div>
        <style jsx>{`
          table, tr {
            display: flex;
          }

          thead,
          tbody {
            display: block;
          }

          table {
            flex-flow: column;
            width: 100%;
          }

          table th,
          table td {
            flex: 1;
          }

          thead {
            width: calc(100% - 1rem);
          }

          tbody {
            overflow-y: auto;
            height: 400px;
            width: 100%;
          }

          td {
            height: 30px;
          }
        `}</style>

        <table>
          <thead>
            <tr>
              { keyItems.map((item, key) => {
                return <th key= {key}> {item} </th>;
              })}
            </tr>
          </thead>
          <tbody>
            <table>
                {items.map(function(item, keyRow) {
                  return <tr key={keyRow}>
                    {(values(omitKeys(item, omit))).map(function(i, keyCell) {
                      return <td key={`${keyRow}-${keyCell}`}><p>{i}</p></td>;
                    })}
                  </tr>;
                })}
            </table>
          </tbody>
        </table>
      </div>
    );
  }
}
