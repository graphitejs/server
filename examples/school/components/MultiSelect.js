import { Component } from 'react';
import Select from './Select';
import { differenceBy, find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';

export default class MultiSelect extends Component {
  static propTypes = {
    name: PropTypes.string,
    items: PropTypes.array,
  }

  static defaultProps = {
    items: [],
  }

  constructor() {
    super();
    this.state = {
      initialItems: [],
      initialSelectedItems: [],
      items: [],
      selectedItems: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(this.state.initial)) {
      const { items, selectedItems } = nextProps;
      this.setState({ initial: items, initialSelectedItems: selectedItems, items, selectedItems });
    }
  }

  render() {
    const { items, selectedItems } = this.state;
    const { name } = this.props;
    const differenceItems = differenceBy(items, selectedItems, '_id');

    return (
      <div>
        <style jsx>{`
          select {
            width: 300px;
          }
          .list {
            float: left;
          }

          .selected {
            float: left;
          }

          .test select {
              width: 300px;
          }
        `}
        </style>
        <fieldset>
          <div className={'list'}>
            <Select ref={'list'}
              multiple name= {'list'}
              title= {'Choose students'}
              items={differenceItems}
              keyLabel={'name'}
              keyValue={'_id'}
              className= {'test'} />
            <button onClick={this.addItem.bind(this)}>Add</button>
          </div>

          <div className={'selected'}>
            <Select ref={'selected'}
              multiple name= {name}
              title= {'Students Selected'}
              items={selectedItems}
              keyLabel={'name'}
              keyValue={'_id'} />
            <button onClick={this.removeItem.bind(this)}>Remove</button>
          </div>

          <button onClick={this.resetItem.bind(this)}>Reset</button>
        </fieldset>
      </div>
    );
  }

  addItem(event) {
    event.preventDefault();
    const { list, selected } = this.refs;
    const { items } = this.props;
    const { selectedItems } = this.state;
    const values = list.state._value;
    const pickItems = values.map(value => find(items, { _id: value }));
    this.setState({ selectedItems: [...selectedItems, ...pickItems]});
    selected.setValue([...selectedItems, ...pickItems].map(i => i._id));
  }

  removeItem(event) {
    event.preventDefault();
    const { selected } = this.refs;
    const { items } = this.props;
    const values = selected.state._value;
    const pickItems = values.map(value => find(items, { _id: value }));
    const differenceItems = differenceBy(this.state.selectedItems, pickItems, '_id');
    this.setState({ selectedItems: differenceItems });
    selected.setValue(differenceItems.map(i => i._id));
  }

  resetItem(event) {
    event.preventDefault();
    const { initialSelectedItems } = this.state;
    this.setState({ selectedItems: initialSelectedItems });
  }
}
