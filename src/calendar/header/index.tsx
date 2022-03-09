import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {Fragment, ReactNode, useCallback, useMemo, forwardRef, useImperativeHandle, useRef} from 'react';
import {
  ActivityIndicator,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  AccessibilityActionEvent,
  ColorValue
} from 'react-native';
import {formatNumbers, weekDayNames} from '../../dateutils';
import {
  CHANGE_MONTH_LEFT_ARROW,
  CHANGE_MONTH_RIGHT_ARROW,
  HEADER_DAY_NAMES,
  HEADER_LOADING_INDICATOR,
  HEADER_MONTH_NAME
  // @ts-expect-error
} from '../../testIDs';
import styleConstructor from './style';
import {Theme, Direction} from '../../types';

export interface CalendarHeaderProps {
  month?: XDate;
  addMonth?: (num: number) => void;

  /** Specify theme properties to override specific styles for calendar parts */
  theme?: Theme;
  /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday */
  firstDay?: number;
  /** Display loading indicator. Default = false */
  displayLoadingIndicator?: boolean;
  /** Show week numbers. Default = false */
  showWeekNumbers?: boolean;
  /** Month format in the title. Formatting values: http://arshaw.com/xdate/#Formatting */
  monthFormat?: string;
  /**  Hide day names */
  hideDayNames?: boolean;
  /** Hide month navigation arrows */
  hideArrows?: boolean;
  /** Replace default arrows with custom ones (direction can be 'left' or 'right') */
  renderArrow?: (direction: Direction) => ReactNode;
  /** Handler which gets executed when press arrow icon left. It receive a callback can go back month */
  onPressArrowLeft?: (method: () => void, month?: XDate) => void; //TODO: replace with string
  /** Handler which gets executed when press arrow icon right. It receive a callback can go next month */
  onPressArrowRight?: (method: () => void, month?: XDate) => void; //TODO: replace with string
  /** Disable left arrow */
  disableArrowLeft?: boolean;
  /** Disable right arrow */
  disableArrowRight?: boolean;
  /** Apply custom disable color to selected day indexes */
  disabledDaysIndexes?: number[];
  /** Replace default title with custom one. the function receive a date as parameter */
  renderHeader?: (date?: XDate) => ReactNode; //TODO: replace with string
  /** Replace default title with custom element */
  customHeaderTitle?: JSX.Element;

  /** Provide aria-level for calendar heading for proper accessibility when used with web (react-native-web) */
  webAriaLevel?: number;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
}

const accessibilityActions = [
  {name: 'increment', label: 'increment'},
  {name: 'decrement', label: 'decrement'}
];


const CalendarHeader = forwardRef((props: CalendarHeaderProps, ref) => {
  const {
    theme,
    style: propsStyle,
    addMonth: propsAddMonth,
    month,
    monthFormat,
    firstDay,
    hideDayNames,
    showWeekNumbers,
    hideArrows,
    renderArrow,
    onPressArrowLeft,
    onPressArrowRight,
    disableArrowLeft,
    disableArrowRight,
    disabledDaysIndexes,
    displayLoadingIndicator,
    customHeaderTitle,
    renderHeader,
    webAriaLevel,
    testID,
    accessibilityElementsHidden,
    importantForAccessibility
  } = props;
  const style = useRef(styleConstructor(theme));
  
  useImperativeHandle(ref, () => ({
    onPressLeft,
    onPressRight
  }));

  const addMonth = useCallback(() => {
    propsAddMonth?.(1);
  }, [propsAddMonth]);

  const subtractMonth = useCallback(() => {
    propsAddMonth?.(-1);
  }, [propsAddMonth]);

  const onPressLeft = useCallback(() => {
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(subtractMonth, month);
    }
    return subtractMonth();
  }, [onPressArrowLeft, subtractMonth, month]);

  const onPressRight = useCallback(() => {
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(addMonth, month);
    }
    return addMonth();
  }, [onPressArrowRight, addMonth, month]);

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    switch (event.nativeEvent.actionName) {
      case 'decrement':
        onPressLeft();
        break;
      case 'increment':
        onPressRight();
        break;
      default:
        break;
    }
  };

  const renderWeekDays = useMemo(() => {
    const weekDaysNames = weekDayNames(firstDay);

    return weekDaysNames.map((day: string, index: number) => {
      const dayStyle = [style.current.dayHeader];

      if (includes(disabledDaysIndexes, index)) {
        dayStyle.push(style.current.disabledDayHeader);
      }

      const dayTextAtIndex = `dayTextAtIndex${index}`;
      // @ts-expect-error
      if (style[dayTextAtIndex]) {
        // @ts-expect-error
        dayStyle.push(style[dayTextAtIndex]);
      }

      return (
        <Text allowFontScaling={false} key={index} style={dayStyle} numberOfLines={1} accessibilityLabel={''}>
          {day}
        </Text>
      );
    });
  }, [firstDay]);

  const _renderHeader = () => {
    const webProps = Platform.OS === 'web' ? {'aria-level': webAriaLevel} : {};

    if (renderHeader) {
      return renderHeader(month);
    }

    if (customHeaderTitle) {
      return customHeaderTitle;
    }

    return (
      <Fragment>
        <Text
          allowFontScaling={false}
          style={style.current.monthText}
          testID={testID ? `${HEADER_MONTH_NAME}-${testID}` : HEADER_MONTH_NAME}
          {...webProps}
        >
          {formatNumbers(month?.toString(monthFormat))}
        </Text>
      </Fragment>
    );
  };

  const _renderArrow = (direction: Direction) => {
    if (hideArrows) {
      return <View/>;
    }

    const isLeft = direction === 'left';
    const id = isLeft ? CHANGE_MONTH_LEFT_ARROW : CHANGE_MONTH_RIGHT_ARROW;
    const testId = testID ? `${id}-${testID}` : id;
    const onPress = isLeft ? onPressLeft : onPressRight;
    const imageSource = isLeft ? require('../img/previous.png') : require('../img/next.png');
    const renderArrowDirection = isLeft ? 'left' : 'right';
    const shouldDisable = isLeft ? disableArrowLeft : disableArrowRight;

    return (
      <TouchableOpacity
        onPress={!shouldDisable ? onPress : undefined}
        disabled={shouldDisable}
        style={style.current.arrow}
        hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
        testID={testId}
      >
        {renderArrow ? (
          renderArrow(renderArrowDirection)
        ) : (
          // @ts-expect-error style?: StyleProp<ImageStyle>
          <Image source={imageSource} style={shouldDisable ? style.current.disabledArrowImage : style.current.arrowImage}/>
        )}
      </TouchableOpacity>
    );
  };

  const renderIndicator = () => {
    if (displayLoadingIndicator) {
      return (
        <ActivityIndicator
          color={theme?.indicatorColor as ColorValue}
          testID={testID ? `${HEADER_LOADING_INDICATOR}-${testID}` : HEADER_LOADING_INDICATOR}
        />
      );
    }
  };

  const renderWeekNumbersSpace = () => {
    return showWeekNumbers && <View style={style.current.dayHeader}/>;
  };

  const renderDayNames = () => {
    if (!hideDayNames) {
      return (
        <View style={style.current.week} testID={testID ? `${HEADER_DAY_NAMES}-${testID}` : HEADER_DAY_NAMES}>
          {renderWeekNumbersSpace()}
          {renderWeekDays}
        </View>
      );
    }
  };

  return (
    <View
      testID={testID}
      style={propsStyle}
      accessible
      accessibilityRole={'adjustable'}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={onAccessibilityAction}
      accessibilityElementsHidden={accessibilityElementsHidden} // iOS
      importantForAccessibility={importantForAccessibility} // Android
    >
      <View style={style.current.header}>
        {_renderArrow('left')}
        <View style={style.current.headerContainer}>
          {_renderHeader()}
          {renderIndicator()}
        </View>
        {_renderArrow('right')}
      </View>
      {renderDayNames()}
    </View>
  );
});

export default CalendarHeader;
CalendarHeader.displayName = 'CalendarHeader';
CalendarHeader.propTypes = {
  month: PropTypes.instanceOf(XDate),
  addMonth: PropTypes.func,
  theme: PropTypes.object,
  firstDay: PropTypes.number,
  displayLoadingIndicator: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  monthFormat: PropTypes.string,
  hideDayNames: PropTypes.bool,
  hideArrows: PropTypes.bool,
  renderArrow: PropTypes.func,
  onPressArrowLeft: PropTypes.func,
  onPressArrowRight: PropTypes.func,
  disableArrowLeft: PropTypes.bool,
  disableArrowRight: PropTypes.bool,
  disabledDaysIndexes: PropTypes.any,
  renderHeader: PropTypes.any,
  customHeaderTitle: PropTypes.any,
  webAriaLevel: PropTypes.number
};
CalendarHeader.defaultProps = {
  monthFormat: 'MMMM yyyy',
  webAriaLevel: 1
};
