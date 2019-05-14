import React, { Component } from 'react';
import CalendarContext from './calendarContext';


function asCalendarConsumer(WrappedComponent) {
  
  class CalendarConsumer extends Component {
    render() {
      return (
        <CalendarContext.Consumer>
          {(context) => (
            <WrappedComponent
              ref={r => (this.contentRef = r)}
              context={context}
              {...this.props}
            />
          )}
        </CalendarContext.Consumer>
      );
    }
  }

  return CalendarConsumer;
}

export default asCalendarConsumer;
