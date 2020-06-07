import React, {Component, Fragment} from 'react';
import {ActivityIndicator, Platform} from 'react-native';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import {weekDayNames} from '../../dateutils';
import {CHANGE_MONTH_LEFT_ARROW, CHANGE_MONTH_RIGHT_ARROW, HEADER_MONTH_NAME, HEADER_YEAR_NAME} from '../../testIDs';
import _ from 'lodash';

const defaultMonthFormat = 'MMMM yyyy';

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
    allowWeekDaysFirstLetterOnly: PropTypes.bool
  };

  static defaultProps = {
    monthFormat: defaultMonthFormat,
    webAriaLevel: 1,
    allowWeekDaysFirstLetterOnly: false
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

  renderMonthAndYear = () => {
    const {testID, month, monthFormat} = this.props;
    const webProps = Platform.OS === 'web' ? {'aria-level': this.props.webAriaLevel} : {};
    const isFormatIncludingDay = monthFormat.toLowerCase().includes('d');
    const format = isFormatIncludingDay ? defaultMonthFormat : monthFormat;

    const formattedHeader = month.toString(format);
    const [formattedMonth, formattedYear] = formattedHeader.split(' ');

    return (
      <Fragment>
        <Text
          testID={testID ? `${HEADER_MONTH_NAME}-${testID}`: HEADER_MONTH_NAME}
          style={this.style.monthText}
          allowFontScaling={false}
          {...webProps}
        >
          {`${formattedMonth} `}
        </Text>
        <Text
          testID={testID ? `${HEADER_YEAR_NAME}-${testID}`: HEADER_YEAR_NAME}
          style={this.style.yearText}
          allowFontScaling={false}
          {...webProps}
        >
          {formattedYear}
        </Text>
      </Fragment>
    );
  };

  render() {
    let leftArrow = <View/>;
    let rightArrow = <View/>;
    const {testID, firstDay, allowWeekDaysFirstLetterOnly} = this.props;
    let weekDaysNames = weekDayNames(firstDay, allowWeekDaysFirstLetterOnly);

    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={this.onPressLeft}
          disabled={this.props.disableArrowLeft}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
          testID={testID ? `${CHANGE_MONTH_LEFT_ARROW}-${testID}`: CHANGE_MONTH_LEFT_ARROW}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('left')
            : <Image
              source={require('../img/previous.png')}
              style={this.props.disableArrowLeft ? this.style.disabledArrowImage : this.style.arrowImage}
            />}
        </TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity
          onPress={this.onPressRight}
          disabled={this.props.disableArrowRight}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
          testID={testID ? `${CHANGE_MONTH_RIGHT_ARROW}-${testID}`: CHANGE_MONTH_RIGHT_ARROW}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('right')
            : <Image
              source={require('../img/next.png')}
              style={this.props.disableArrowRight ? this.style.disabledArrowImage : this.style.arrowImage}
            />}
        </TouchableOpacity>
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
          <View style={this.style.monthAndYearContainer}>
            {this.renderMonthAndYear()}
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
