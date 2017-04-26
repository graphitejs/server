import { Component } from 'react';
import PropTypes from 'prop-types';
import { HOC } from 'formsy-react';
import { get } from 'lodash';

class Select extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    setValue: PropTypes.func,
    showRequired: PropTypes.func,
    showError: PropTypes.func,
    getErrorMessage: PropTypes.func,
    getValue: PropTypes.func,
    keyLabel: PropTypes.string,
    keyValue: PropTypes.string,
    items: PropTypes.array,
    multiple: PropTypes.bool,
    defaultDisplay: PropTypes.string,
  }

  static defaultProps = {
    keyLabel: undefined,
    keyValue: undefined,
    items: [],
    mutliple: false,
  }

  componentDidMount() {
    const { defaultDisplay, setValue } = this.props;
    setValue([defaultDisplay]);
  }

  componentWillReceiveProps(nextProps) {
    const { defaultDisplay } = this.props;

    if (nextProps.defaultDisplay !== defaultDisplay) {
      this.props.setValue([nextProps.defaultDisplay]);
    }
  }

  render() {
    const { props } = this;
    const { items, multiple, getValue } = this.props;
    const addClassName = get(props, 'className', '');
    const className = `form-group + ${addClassName}`;
    const defaultLabel = get(this.props, 'keyLabel', 'label');
    const defaultValue = get(this.props, 'keyValue', 'value');

    return (
      <div className={className}>
        <label htmlFor={props.name}>{props.title}</label>
        <select
          name={props.name}
          onChange={this.changeValue.bind(this)}
          multiple={multiple}
          value={getValue()}>
          { !!getValue() ? <option defaultValue hidden>Choose here</option> : null }
          { items.map((item, key) => {
            return <option key= {key} value= {item[defaultValue]}> {item[defaultLabel]} </option>;
          })}
        </select>
      </div>
    );
  }

  changeValue(event) {
    const { setValue } = this.props;
    const selected = event.target;
    const values = [...selected.options].filter(option => option.selected).map(option => option.value);
    setValue(values);
  }
}

export default HOC(Select);
