import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import XDate from 'xdate';
import CalendarContext from './calendarContext';


const commons = require('./commons');
const UPDATE_SOURCES = commons.UPDATE_SOURCES;

class CalendarProvider extends Component {
  static propTypes = {
    // Initial date in 'yyyy-MM-dd' format. Default = Date()
    date: PropTypes.any.isRequired,
    // callback for date change event
    onDateChanged: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.state = {
      date: this.props.date || XDate().toString('yyyy-MM-dd'),
      updateSource: UPDATE_SOURCES.CALENDAR_INIT
    };
  }
  
  getProviderContextValue = () => {
    return {
      setDate: this.setDate,
      date: this.state.date,
      updateSource: this.state.updateSource
    };
  };

  setDate = (date, updateSource) => {
    this.setState({date, updateSource});
    _.invoke(this.props, 'onDateChanged', date, updateSource);
  }
  
  render() {
    return (
      <CalendarContext.Provider value={this.getProviderContextValue()}>
        {this.props.children}
      </CalendarContext.Provider>
    );
  }
}

export default CalendarProvider;
