import _ from 'lodash';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, {Component, Fragment} from 'react';
import {ActivityIndicator, Platform, View, Text, TouchableOpacity, Image} from 'react-native';
import {shouldUpdate} from '../../component-updater';
import {weekDayNames} from '../../dateutils';
import {parseDate} from '../../interface';
import {
  CHANGE_MONTH_LEFT_ARROW,
  CHANGE_MONTH_RIGHT_ARROW,
  HEADER_DAY_NAMES,
  HEADER_LOADING_INDICATOR,
  HEADER_MONTH_NAME
} from '../../testIDs';
import styleConstructor from './style';

class CalendarHeader extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    theme: PropTypes.object,
    firstDay: PropTypes.number,
    displayLoadingIndicator: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    markedDates: PropTypes.object,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    addWeek: PropTypes.func,
    /** Position the calendar arrows on the left or right (optional) */
    arrowPosition: PropTypes.oneOf(['left', 'right']),
    /** Month format in the title. Formatting values: http://arshaw.com/xdate/#Formatting */
    monthFormat: PropTypes.string,
    /**  Hide day names. Default = false */
    hideDayNames: PropTypes.bool,
    /** Hide month navigation arrows. Default = false */
    hideArrows: PropTypes.bool,
    /** Replace default arrows with custom ones (direction can be 'left' or 'right') */
    renderArrow: PropTypes.func,
    /** Handler which gets executed when press arrow icon left. It receive a callback can go back month */
    onPressArrowLeft: PropTypes.func,
    /** Handler which gets executed when press arrow icon right. It receive a callback can go next month */
    onPressArrowRight: PropTypes.func,
    /** Disable left arrow. Default = false */
    disableArrowLeft: PropTypes.bool,
    /** Disable right arrow. Default = false */
    disableArrowRight: PropTypes.bool,
    /** Apply custom disable color to selected day indexes */
    disabledDaysIndexes: PropTypes.arrayOf(PropTypes.number),
    /** Replace default month and year title with custom one. the function receive a date as parameter. */
    renderHeader: PropTypes.any,
    /** Provide aria-level for calendar heading for proper accessibility when used with web (react-native-web) */
    webAriaLevel: PropTypes.number,
    weekView: PropTypes.bool,
  };

  static defaultProps = {
    monthFormat: 'MMMM yyyy',
    webAriaLevel: 1
  };

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

  shouldUpdateMonth(prevMonth, nextMonth) {
    return true;
  }

  shouldUpdateMarkings(prevMarkings, nextMarkings) {
    const prevKeys = Object.keys(prevMarkings);
    const nextKeys = Object.keys(nextMarkings);

    if (prevKeys.length !== nextKeys.length) {
      return true;
    }

    for (const prevKey of prevKeys) {
      if (!nextKeys.includes(prevKey)) {
        return true;
      }
    }

    for (const nextKey of nextKeys) {
      if (!prevKeys.includes(nextKey)) {
        return true;
      }
    }

    return false;
  }

  shouldUpdateWeek(nextProps) {
    const { markedDates, month } = this.props;
    return this.shouldUpdateMarkings(markedDates, nextProps.markedDates)
      || this.shouldUpdateMonth(month, nextProps.month);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.weekView && this.shouldUpdateWeek(nextProps)) {
      return true;
    }
    if (nextProps.month.toString('yyyy MM') !== this.props.month.toString('yyyy MM')) {
      return true;
    }
    return shouldUpdate(this.props, nextProps, [
      'displayLoadingIndicator',
      'hideDayNames',
      'firstDay',
      'showWeekNumbers',
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

  addWeek = () => {
    const {addWeek} = this.props;
    addWeek(1);
  };

  subtractWeek = () => {
    const {addWeek} = this.props;
    addWeek(-1);
  };

  onPressLeft = () => {
    const {onPressArrowLeft, month, weekView} = this.props;
    const handlerFunc = weekView ? this.subtractWeek : this.subtractMonth;

    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(handlerFunc, month);
    }

    return handlerFunc();
  };

  onPressRight = () => {
    const {onPressArrowRight, month, weekView} = this.props;
    const handlerFunc = weekView ? this.addWeek : this.addMonth;

    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(handlerFunc, month);
    }

    return handlerFunc();
  };

  renderWeekDays = weekDaysNames => {
    const {disabledDaysIndexes, month, markedDates, weekView} = this.props;
    const [date] = Object.entries(markedDates).find(([date, value]) => value.selected === true) || [];
    const selectedDate = date ? parseDate(date) : null;
    const sameDate = month.toString('yyyy MM dd') === selectedDate?.toString('yyyy MM dd');

    return weekDaysNames.map((day, idx) => {
      const dayStyle = [this.style.dayHeader];

      if (_.includes(disabledDaysIndexes, idx)) {
        dayStyle.push(this.style.disabledDayHeader);
      }

      const selected = weekView && sameDate && selectedDate?.getDay() === idx;
      if (selected) {
        dayStyle.push(this.style.selectedDayHeaderText);
      }

      return (
        <View key={idx} style={[this.style.dayHeaderContainer, selected && this.style.selectedDayHeader]}>
          <Text allowFontScaling={false} style={dayStyle} numberOfLines={1} accessibilityLabel={''}>
            {day}
          </Text>
        </View>
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
        onPress={!shouldDisable ? onPress : undefined}
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
    const {displayLoadingIndicator, theme, testID} = this.props;

    if (displayLoadingIndicator) {
      return (
        <ActivityIndicator
          color={theme && theme.indicatorColor}
          testID={testID ? `${HEADER_LOADING_INDICATOR}-${testID}` : HEADER_LOADING_INDICATOR}
        />
      );
    }
  }

  renderDayNames() {
    const {firstDay, hideDayNames, showWeekNumbers, testID} = this.props;
    const weekDaysNames = weekDayNames(firstDay);

    if (!hideDayNames) {
      return (
        <View style={this.style.week} testID={testID ? `${HEADER_DAY_NAMES}-${testID}` : HEADER_DAY_NAMES}>
          {showWeekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader}></Text>}
          {this.renderWeekDays(weekDaysNames)}
        </View>
      );
    }
  }

  renderHeaderContents() {
    const {style, arrowPosition} = this.props;

    const ArrowContainer = () => (
      <View style={this.style.arrowsContainerStyle}>
        {this.renderArrow('left')}
        {this.renderArrow('right')}
      </View>
    );

    const Title = () => (
      <View style={this.style.headerContainer}>
        {this.renderHeader()}
        {this.renderIndicator()}
      </View>
    );

    const HeaderContents = () => {
      if (arrowPosition === 'left') {
        return (
          <>
            <ArrowContainer />
            <Title />
          </>
        );
      }

      if (arrowPosition === 'right') {
        return (
          <>
            <Title />
            <ArrowContainer />
          </>
        );
      }

      return (
        <>
          {this.renderArrow('left')}
          <Title />
          {this.renderArrow('right')}
        </>
      );
    };

    return <HeaderContents />;
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
          {this.renderHeaderContents()}
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
