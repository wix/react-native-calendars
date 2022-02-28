import React, {Component, Ref} from 'react';
// @ts-expect-error
import hoistNonReactStatic from 'hoist-non-react-statics';
import CalendarContext from './Context';


function asCalendarConsumer<PROPS>(WrappedComponent: React.ComponentType<any>): React.ComponentClass<PROPS> {

  class CalendarConsumer extends Component {
    contentRef: any;

    saveRef = (r: Ref<React.Component<any>>) => {
      this.contentRef = r;
    };

    render() {
      return (
        <CalendarContext.Consumer>
          {context => <WrappedComponent ref={this.saveRef} context={context} {...this.props} />}
        </CalendarContext.Consumer>
      );
    }
  }

  hoistNonReactStatic(CalendarConsumer, WrappedComponent);

  return CalendarConsumer as any;
}

export default asCalendarConsumer;
