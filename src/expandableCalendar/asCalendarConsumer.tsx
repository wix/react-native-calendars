import React, {Component, Ref} from 'react';
// @ts-expect-error
import hoistNonReactStatic from 'hoist-non-react-statics';
import CalendarContext from './Context';


function asCalendarConsumer(WrappedComponent: React.ComponentType<any>): React.ComponentClass {

  class CalendarConsumer extends Component {
    contentRef: any;

    saveRef = (r: Ref<React.Component<any>>) => {
      this.contentRef = r;
    };

    render() {
      return (
        <CalendarContext.Consumer>
          {context => <WrappedComponent ref={this.contentRef} context={context} {...this.props} />}
        </CalendarContext.Consumer>
      );
    }
  }

  hoistNonReactStatic(CalendarConsumer, WrappedComponent);

  return CalendarConsumer;
}

export default asCalendarConsumer;
