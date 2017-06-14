import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { Button } from 'semantic-ui-react';
import moment from 'moment';

require('react-datepicker/dist/react-datepicker.css');

const DatePickerInput = React.createClass({
  displayName: "DatePickerInput" ,
  propTypes: {
    onClick: React.PropTypes.func,
    value: React.PropTypes.string
  },
  render() {
    return (
      <Button id='journal-head-button' onClick={this.props.onClick}>{this.props.value}</Button>
    );
  }
});

const DatePicker = React.createClass({
  getInitialState() {
    return {
      current_date: moment()
    }
  },
  handleChange(date) {
    this.setState({
      current_date: date
    }),
    this.props.setDate(date.toISOString());
  },
  render() {
    return (
      <ReactDatePicker customInput={<DatePickerInput />}
                       todayButton={"Today"}
                       selected={this.state.current_date}
                       onChange={this.handleChange}/>
    );
  }
});



export default DatePicker;
