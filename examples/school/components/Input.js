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

  constructor() {
    super();

    this.state = {
      init: true,
    };
  }

  componentDidMount() {
    this.setState({ init: false });
  }

  render() {
    const { props } = this;
    const { showRequired, showError, getErrorMessage, getValue, checked } = this.props;
    const { init } = this.state;
    const addClassName = get(props, 'className', '');
    const classesValidations = showRequired() ? 'required' : showError() ? 'error' : null;
    const className = `form-group + ${addClassName} ${classesValidations}`;
    const errorMessage = getErrorMessage();
    return (
      <div className={className}>
        <label htmlFor={props.name}>{props.title}</label>
        <input
          type={props.type || 'text'}
          onChange={this.changeValue.bind(this)}
          value={getValue()}
          name={props.name}
          checked={(props.type === 'checkbox' || props.type === 'radio') && checked && init ? 'checked' : null }
        />
      <span className="validation-error">{errorMessage}</span>
      </div>
    );
  }

  changeValue(event) {
    this.setState({ init: false });
    const { setValue, type } = this.props;
    const target = event.currentTarget;
    if (type !== 'checkbox') {
      setValue(target.value);
    }
  }
}

export default HOC(Input);
