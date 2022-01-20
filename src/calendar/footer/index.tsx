import React, {Fragment, ReactNode} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';

export interface CalendarFooterProps {
  /** Replace default title with custom one. the function receive a date as parameter */
  renderFooter?: (props: any) => ReactNode;
  testID?: string;
}

class CalendarFooter extends React.Component<CalendarFooterProps> {
  static displayName = 'CalendarFooter';

  static propTypes = {
    renderFooter: PropTypes.any,
  };

  renderFooter() {
    const {props} = this;
    const {renderFooter, ...other} = props;
    if (renderFooter) return renderFooter(other);
    return (
      <View {...props}></View>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderFooter()}
      </Fragment>
    );
  }
}

export default CalendarFooter;
