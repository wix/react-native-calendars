import React, {Component} from 'react';
import CalendarContext from './calendarContext';


class CalendarProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: undefined
    };
  }
  
  getProviderContextValue = () => {
    return {
      setDate: this.setDate,
      date: this.state.date
    };
  };

  setDate = (date) => {
    this.setState({date});
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
