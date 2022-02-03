import React, {Component} from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import CalendarContext from './Context';

<<<<<<< HEAD:src/expandableCalendar/asCalendarConsumer.js
function asCalendarConsumer(WrappedComponent) {
=======

function asCalendarConsumer<PROPS>(WrappedComponent: React.ComponentType<any>): React.ComponentClass<PROPS> {

>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/asCalendarConsumer.tsx
  class CalendarConsumer extends Component {
    render() {
      return (
        <CalendarContext.Consumer>
<<<<<<< HEAD:src/expandableCalendar/asCalendarConsumer.js
          {context => <WrappedComponent ref={r => (this.contentRef = r)} context={context} {...this.props} />}
=======
          {context => <WrappedComponent ref={this.saveRef} context={context} {...this.props} />}
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/asCalendarConsumer.tsx
        </CalendarContext.Consumer>
      );
    }
  }

  hoistNonReactStatic(CalendarConsumer, WrappedComponent);

  return CalendarConsumer as any;
}

export default asCalendarConsumer;
