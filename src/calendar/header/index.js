import React, {Component, Fragment} from 'react';
import {ActivityIndicator, Platform} from 'react-native';
import {View, Text} from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import {weekDayNames} from '../../dateutils';
import {HEADER_MONTH_NAME} from '../../testIDs';
import _ from 'lodash';

import Arrow from '../../components/Arrow';

class CalendarHeader extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func,
    disableArrowLeft: PropTypes.bool,
    disableArrowRight: PropTypes.bool,
    webAriaLevel: PropTypes.number,
    disabledDaysIndexes: PropTypes.arrayOf(PropTypes.number),
    renderHeader: PropTypes.any
  };

  static defaultProps = {
    monthFormat: 'MMMM yyyy',
    webAriaLevel: 1
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
  }

  addMonth = () => {
    const {addMonth} = this.props;
    addMonth(1);
  }

  subtractMonth = () => {
    const {addMonth} = this.props;
    addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.month.toString('yyyy MM') !== this.props.month.toString('yyyy MM')) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    if (nextProps.firstDay !== this.props.firstDay) {
      return true;
    }
    if (nextProps.weekNumbers !== this.props.weekNumbers) {
      return true;
    }
    if (nextProps.monthFormat !== this.props.monthFormat) {
      return true;
    }
    if (nextProps.renderArrow !== this.props.renderArrow) {
      return true;
    }
    if (nextProps.disableArrowLeft !== this.props.disableArrowLeft) {
      return true;
    }
    if (nextProps.disableArrowRight !== this.props.disableArrowRight) {
      return true;
    }
    return false;
  }

  onPressLeft = () => {
    const {onPressArrowLeft, month} = this.props;
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.subtractMonth, month);
    }
    return this.subtractMonth();
  }

  onPressRight = () => {
    const {onPressArrowRight, month} = this.props;
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth, month);
    }
    return this.addMonth();
  }

  renderWeekDays = (weekDaysNames) => {
    const {disabledDaysIndexes} = this.props;
    return weekDaysNames.map((day, idx) => {
      const dayStyle = [this.style.dayHeader];

      if (_.includes(disabledDaysIndexes, idx)) {
        dayStyle.push(this.style.disabledDayHeader);
      }

      return (
        <Text
          allowFontScaling={false}
          key={idx}
          style={dayStyle}
          numberOfLines={1}
          accessibilityLabel={''}
        >
          {day}
        </Text>
      );
    });
  }

  renderHeader = () => {
    const {renderHeader, month, monthFormat, testID} = this.props;
    const webProps = Platform.OS === 'web' ? {'aria-level': this.props.webAriaLevel} : {};

    if (renderHeader) {
      return renderHeader(month);
    }

    return (
      <Fragment>
        <Text
          allowFontScaling={false}
          style={this.style.monthText}
          testID={testID ? `${HEADER_MONTH_NAME}-${testID}`: HEADER_MONTH_NAME}
          {...webProps}
        >
          {month.toString(monthFormat)}
        </Text>
      </Fragment>
    );
  };

  render() {
    let leftArrow = <View/>;
    let rightArrow = <View/>;
    let weekDaysNames = weekDayNames(this.props.firstDay);
    const {testID} = this.props;

    if (!this.props.hideArrows) {
      leftArrow = (
        <Arrow
          type="left"
          onPress={this.onPressLeft}
          style={this.style.arrow}
          disableArrow={this.props.disableArrowLeft}
          style={this.style}
          disabledArrowImageStyle={this.style.disabledArrowImage}
          arrowImageStyle={this.style.arrowImage}
          testID={testID}
        />
      );
      rightArrow = (
        <Arrow
          type="right"
          onPress={this.onPressRight}
          style={this.style.arrow}
          disableArrow={this.props.disableArrowRight}
          style={this.style}
          disabledArrowImageStyle={this.style.disabledArrowImage}
          arrowImageStyle={this.style.arrowImage}
          testID={testID}
        />
      );
    }

    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator color={this.props.theme && this.props.theme.indicatorColor}/>;
    }

    return (
      <View
        testID={testID}
        style={this.props.style}
        accessible
        accessibilityRole={'adjustable'}
        accessibilityActions={[
          {name: 'increment', label: 'increment'},
          {name: 'decrement', label: 'decrement'}
        ]}
        onAccessibilityAction={this.onAccessibilityAction}
        accessibilityElementsHidden={this.props.accessibilityElementsHidden} // iOS
        importantForAccessibility={this.props.importantForAccessibility} // Android
      >
        <View style={this.style.header}>
          {leftArrow}
          <View style={this.style.headerContainer}>
            {this.renderHeader()}
            {indicator}
          </View>
          {rightArrow}
        </View>
        {!this.props.hideDayNames &&
          <View style={this.style.week}>
            {this.props.weekNumbers &&
              <Text allowFontScaling={false} style={this.style.dayHeader}></Text>
            }
            {this.renderWeekDays(weekDaysNames)}
          </View>
        }
      </View>
    );
  }

  onAccessibilityAction = event => {
    switch (event.nativeEvent.actionName) {
    case 'decrement':
      this.onPressLeft();
      break;
    case 'increment':
      this.onPressRight();
      break;
    default:
      break;
    }
  }
}

export default CalendarHeader;
