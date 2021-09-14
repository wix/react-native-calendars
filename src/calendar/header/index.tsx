import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, {Component, Fragment, ReactNode} from 'react';
import {ActivityIndicator, Platform, View, Text, TouchableOpacity, Image, StyleProp, ViewStyle, AccessibilityActionEvent, ColorValue} from 'react-native';
import moment from 'moment';

// @ts-expect-error
import {shouldUpdate} from '../../component-updater';
import {
  CHANGE_MONTH_LEFT_ARROW,
  CHANGE_MONTH_RIGHT_ARROW,
  HEADER_LOADING_INDICATOR,
  HEADER_MONTH_NAME
  // @ts-expect-error
} from '../../testIDs';
import styleConstructor from './style';
import {Theme, Direction} from '../../types';

interface Props {
  theme?: Theme;
  firstDay?: number;
  displayLoadingIndicator?: boolean;
  showWeekNumbers?: boolean;
  month?: XDate;
  addMonth?: (num: number) => void;
  /** Month format in the title. Formatting values: http://arshaw.com/xdate/#Formatting */
  monthFormat?: string;
  /**  Hide day names */
  hideDayNames?: boolean;
  /** Hide month navigation arrows */
  hideArrows?: boolean;
  /** Replace default arrows with custom ones (direction can be 'left' or 'right') */
  renderArrow?: (direction: Direction) => ReactNode;
  /** Handler which gets executed when press arrow icon left. It receive a callback can go back month */
  onPressArrowLeft?: (method: () => void, month?: XDate) => void;
  /** Handler which gets executed when press arrow icon right. It receive a callback can go next month */
  onPressArrowRight?: (method: () => void, month?: XDate) => void;
  /** Disable left arrow */
  disableArrowLeft?: boolean;
  /** Disable right arrow */
  disableArrowRight?: boolean;
  /** Replace default month and year title with custom one. the function receive a date as parameter */
  renderHeader?: (date?: XDate) => ReactNode;
  /** Provide aria-level for calendar heading for proper accessibility when used with web (react-native-web) */
  webAriaLevel?: number;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  showWeeklyTotal: boolean;
  /** Handler which gets executed when press Month name */
  onMonthPress: () => void;
  showCalendar: boolean;
  selectedDate: string;
  dayFormat: string;
  addDay?: (num: number) => void;

}
export type CalendarHeaderProps = Props;

class CalendarHeader extends Component<Props> {
  static displayName = 'IGNORE';

  static propTypes = {
    theme: PropTypes.object,
    firstDay: PropTypes.number,
    displayLoadingIndicator: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
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
    /** Replace default month and year title with custom one. the function receive a date as parameter. */
    renderHeader: PropTypes.any,
    /** Provide aria-level for calendar heading for proper accessibility when used with web (react-native-web) */
    webAriaLevel: PropTypes.number,
    showWeeklyTotal: PropTypes.bool,
    testID: PropTypes.string,
    /** Handler which gets executed when press Month name */
    onMonthPress: PropTypes.func,
    showCalendar: PropTypes.bool,
    selectedDate: PropTypes.string,
    dayFormat: PropTypes.string,
    addDay: PropTypes.func,
  };

  static defaultProps = {
    monthFormat: 'MMMM yyyy',
    webAriaLevel: 1,
    dayFormat: 'dddd, DD MMMM YYYY',
  };
  style: any;

  constructor(props: Props) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps: Props) {
    if (nextProps.month?.toString('yyyy MM') !== this.props.month?.toString('yyyy MM')) {
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
      'disableArrowRight',
      'onMonthPress',
      'showCalendar',
      'selectedDate',
    ]);
  }

  addMonthOrDay = () => {
    const {addMonth, showCalendar, addDay} = this.props;
    if (showCalendar) addMonth?.(1);
    else addDay?.(1);
  };

  subtractMonthOrDay = () => {
    const {addMonth, showCalendar, addDay} = this.props;
    if (showCalendar) addMonth?.(-1);
    else addDay?.(-1);
  };

  onPressLeft = () => {
    const {onPressArrowLeft, month} = this.props;

    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.subtractMonthOrDay, month);
    }

    return this.subtractMonthOrDay();
  };

  onPressRight = () => {
    const {onPressArrowRight, month} = this.props;

    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonthOrDay, month);
    }

    return this.addMonthOrDay();
  };

  renderHeader = () => {
    const {renderHeader, month, monthFormat, testID, webAriaLevel, onMonthPress, showCalendar, selectedDate, dayFormat} = this.props;
    const webProps = Platform.OS === 'web' ? {'aria-level': webAriaLevel} : {};

    const headerText = showCalendar ? month?.toString(monthFormat) : moment(selectedDate)?.format(dayFormat);
    if (renderHeader) {
      return renderHeader(month);
    }

    return (
      <TouchableOpacity onPress={() => onMonthPress()} disabled={!onMonthPress}>
        <Text
          allowFontScaling={false}
          style={this.style.monthText}
          testID={testID ? `${HEADER_MONTH_NAME}-${testID}` : HEADER_MONTH_NAME}
          {...webProps}
        >
          {headerText}
        </Text>
      </TouchableOpacity>
    );
  };

  renderArrow(direction: Direction) {
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
          color={theme?.indicatorColor as ColorValue}
          testID={testID ? `${HEADER_LOADING_INDICATOR}-${testID}` : HEADER_LOADING_INDICATOR}
        />
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
      </View>
    );
  }

  onAccessibilityAction = (event: AccessibilityActionEvent) => {
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
