import { Component } from 'react';
import PropTypes from 'prop-types';
import { HOC } from 'formsy-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';

class DatepickerInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    setValue: PropTypes.func,
    placeholder: PropTypes.string,
    format: PropTypes.string,
  }

  static defaultProps = {
    placeholder: 'DD/MM/YYYY',
    format: 'DD/MM/YYYY',
  }

  constructor() {
    super();
  }

  render() {
    const { name, placeholder, format } = this.props;

    return (
      <DayPickerInput
                name={name}
                placeholder={placeholder}
                format={format}
                onDayChange={ this.changeValue.bind(this) }
                dayPickerProps={{
                  enableOutsideDays: true,
                }} />
    );
  }

  changeValue(date) {
    const { setValue } = this.props;
    setValue(date);
  }
}

export default HOC(DatepickerInput);
