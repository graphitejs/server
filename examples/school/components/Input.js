import { Component } from 'react';
import PropTypes from 'prop-types';
import { HOC } from 'formsy-react';
import { get } from 'lodash';

class Input extends Component {
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
  }

  render() {
    const { props } = this;
    const { showRequired, showError, getErrorMessage, getValue } = this.props;
    const addClassName = get(props, 'className', '');
    const classesValidations = showRequired() ? 'required' : showError() ? 'error' : null;
    const className = `form-group + ${addClassName} ${classesValidations}`;
    const errorMessage = getErrorMessage();
    return (
      <div className={className}>
        <label htmlFor={props.name}>{props.title}</label>
        <input
          type={props.type || 'text'}
          name={props.name}
          onChange={this.changeValue.bind(this)}
          value={getValue()}
          checked={props.type === 'checkbox' && getValue() ? 'checked' : null}
        />
      <span className="validation-error">{errorMessage}</span>
      </div>
    );
  }

  changeValue(event) {
    const { setValue } = this.props;
    setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
  }
}

export default HOC(Input);
