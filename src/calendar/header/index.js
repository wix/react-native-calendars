import _ from 'lodash';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, {Component, Fragment} from 'react';
import {ActivityIndicator, Platform, View, Text, TouchableOpacity, Image} from 'react-native';
import {shouldUpdate} from '../../component-updater';
import {weekDayNames} from '../../dateutils';
import {CHANGE_MONTH_LEFT_ARROW, CHANGE_MONTH_RIGHT_ARROW, HEADER_MONTH_NAME} from '../../testIDs';
import styleConstructor from './style';

class CalendarHeader extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    monthFormat: PropTypes.string,
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
    disabledDaysIndexes: PropTypes.arrayOf(PropTypes.number),
    renderHeader: PropTypes.any,
    webAriaLevel: PropTypes.number
  };

  static defaultProps = {
    monthFormat: 'MMMM yyyy',
    webAriaLevel: 1
  };

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.month.toString('yyyy MM') !== this.props.month.toString('yyyy MM')) {
      return true;
    }
    return shouldUpdate(this.props, nextProps, [
      'showIndicator', 
      'hideDayNames', 
      'firstDay', 
      'weekNumbers', 
      'monthFormat', 
      'renderArrow',
      'disableArrowLeft',
      'disableArrowRight'
    ]);
  }

  addMonth = () => {
    const {addMonth} = this.props;
    addMonth(1);
  };

  subtractMonth = () => {
    const {addMonth} = this.props;
    addMonth(-1);
  };

  onPressLeft = () => {
    const {onPressArrowLeft, month} = this.props;

    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.subtractMonth, month);
    }
    return this.subtractMonth();
  };

  onPressRight = () => {
    const {onPressArrowRight, month} = this.props;

    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth, month);
    }
    return this.addMonth();
  };

  renderWeekDays = weekDaysNames => {
    const {disabledDaysIndexes} = this.props;

    return weekDaysNames.map((day, idx) => {
      const dayStyle = [this.style.dayHeader];

      if (_.includes(disabledDaysIndexes, idx)) {
        dayStyle.push(this.style.disabledDayHeader);
      }

      return (
        <Text allowFontScaling={false} key={idx} style={dayStyle} numberOfLines={1} accessibilityLabel={''}>
          {day}
        </Text>
      );
    });
  };

  renderHeader = () => {
    const {renderHeader, month, monthFormat, testID, webAriaLevel} = this.props;
    const webProps = Platform.OS === 'web' ? {'aria-level': webAriaLevel} : {};

    if (renderHeader) {
      return renderHeader(month);
    }

    return (
      <Fragment>
        <Text
          allowFontScaling={false}
          style={this.style.monthText}
          testID={testID ? `${HEADER_MONTH_NAME}-${testID}` : HEADER_MONTH_NAME}
          {...webProps}
        >
          {month.toString(monthFormat)}
        </Text>
      </Fragment>
    );
  };

  renderArrow(direction) {
    const {hideArrows, disableArrowLeft, disableArrowRight, renderArrow, testID} = this.props;
    if (hideArrows) {
      return <View />;
    }
    const isLeft = direction === 'left';
    const id = isLeft ? CHANGE_MONTH_LEFT_ARROW : CHANGE_MONTH_RIGHT_ARROW;
    const testId = testID ? `${id}-${testID}` : id;
    const onPress = isLeft ? this.onPressLeft : this.onPressRight;
    const imageSource = isLeft ? require('../img/previous.png') : require('../img/next.png');
    const renderArrowDirection = isLeft ? 'left' : 'right';
    const shouldDisable = isLeft ? disableArrowLeft : disableArrowRight;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={shouldDisable}
        style={this.style.arrow}
        hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
        testID={testId}
      >
        {renderArrow ? (
          renderArrow(renderArrowDirection)
        ) : (
          <Image source={imageSource} style={shouldDisable ? this.style.disabledArrowImage : this.style.arrowImage} />
        )}
      </TouchableOpacity>
    );
  }

  renderIndicator() {
    const {showIndicator, theme} = this.props;

    if (showIndicator) {
      return <ActivityIndicator color={theme && theme.indicatorColor} />;
    }
  }

  renderDayNames() {
    const {firstDay, hideDayNames, weekNumbers} = this.props;
    const weekDaysNames = weekDayNames(firstDay);

    if (!hideDayNames) {
      return (
        <View style={this.style.week}>
          {weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader}></Text>}
          {this.renderWeekDays(weekDaysNames)}
        </View>
      );
    }
  }

  render() {
    const {style, testID} = this.props;

    return (
      <View
        testID={testID}
        style={style}
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
          {this.renderArrow('left')}
          <View style={this.style.headerContainer}>
            {this.renderHeader()}
            {this.renderIndicator()}
          </View>
          {this.renderArrow('right')}
        </View>
        {this.renderDayNames()}
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
  };
}

export default CalendarHeader;
