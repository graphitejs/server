import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { keys, pullAll, values, omit as omitKeys } from 'lodash';

export default class Table extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    omit: PropTypes.arrayOf(PropTypes.string),
    actions: PropTypes.shape({
      name: PropTypes.string,
      elements: PropTypes.element,
    }),
  }

  static defaultProps = {
    items: [],
    omit: '',
  }

  constructor() {
    super();
  }

  render() {
    const { items, omit, actions } = this.props;
    let keyItems = [];
    if (items && items.length > 0) {
      keyItems = pullAll(keys(items[0]), omit);

      if (actions) {
        keyItems.push(actions.name);
      }
    }

    return (
      <div>
       { items && items.length > 0 ?
         <table>
           <thead>
             <tr>
               { keyItems.map((item, key) => {
                 return <th key= {`thead-${key}`}> {item} </th>;
               })}
             </tr>
           </thead>
           <tbody>
             {items.map((item, keyRow) => {
               return <tr key={`tr-${keyRow}`}>
                         {(values(omitKeys(item, omit))).map((i, keyCell) => {
                           return <td key={`${keyRow}-${keyCell}`}>{i}</td>;
                         })}
                         { actions ?
                           <td key={`${keyRow}-actions`}>{React.cloneElement(actions.elements, { item: item })}</td> : null }
                      </tr>;
             })}
            </tbody>
         </table>
        : null }
      </div>
    );
  }
}
