import values from 'lodash/values';
import PropTypes from 'prop-types';
import React, {Fragment, useCallback} from 'react';
import {TouchableOpacity, Text, View, ViewProps} from 'react-native';

import {Theme, DayState, MarkingTypes, DateData} from '../../../types';
import styleConstructor from './style';
import Marking, {MarkingProps} from '../marking';

export interface BasicDayProps extends ViewProps {
  state?: DayState;
  /** The marking object */
  marking?: MarkingProps;
  /** Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple' */
  markingType?: MarkingTypes;
  /** Theme object */
  theme?: Theme;
  /** onPress callback */
  onPress?: (date?: DateData) => void;
  /** onLongPress callback */
  onLongPress?: (date?: DateData) => void;
  /** The date to return from press callbacks */
  date?: DateData;

  /** Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates*/
  disableAllTouchEventsForDisabledDays?: boolean;
  /** Disable all touch events for inactive days. can be override with disableTouchEvent in markedDates*/
  disableAllTouchEventsForInactiveDays?: boolean;
  
  /** Test ID*/
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const BasicDay = (props: BasicDayProps) => {
  const {theme, date, onPress, onLongPress, markingType, marking, state, disableAllTouchEventsForDisabledDays, disableAllTouchEventsForInactiveDays, accessibilityLabel, children, testID} = props;
  const style = styleConstructor(theme);
  const _marking = marking || {};

  const _onPress = useCallback(() => {
    onPress?.(date);
  }, [onPress]);
  
  const _onLongPress = useCallback(() => {
    onLongPress?.(date);
  }, [onLongPress]);

  const shouldDisableTouchEvent = () => {
    const {disableTouchEvent} = _marking;
    let disableTouch = false;

    if (typeof disableTouchEvent === 'boolean') {
      disableTouch = disableTouchEvent;
    } else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && isDisabled) {
      disableTouch = disableAllTouchEventsForDisabledDays;
    } else if (typeof disableAllTouchEventsForInactiveDays === 'boolean' && isInactive) {
      disableTouch = disableAllTouchEventsForInactiveDays;
    }
    return disableTouch;
  };

  const isSelected = _marking.selected || state === 'selected';
  const isDisabled = typeof _marking.disabled !== 'undefined' ? _marking.disabled : state === 'disabled';
  const isInactive = _marking?.inactive;
  const isToday = state === 'today';
  const isMultiDot = markingType === Marking.markings.MULTI_DOT;
  const isMultiPeriod = markingType === Marking.markings.MULTI_PERIOD;
  const isCustom = markingType === Marking.markings.CUSTOM;

  const getContainerStyle = () => {
    const {customStyles, selectedColor} = _marking;
    const styles = [style.base];

    if (isSelected) {
      styles.push(style.selected);
      if (selectedColor) {
        styles.push({backgroundColor: selectedColor});
      }
    } else if (isToday) {
      styles.push(style.today);
    }

    //Custom marking type
    if (isCustom && customStyles && customStyles.container) {
      if (customStyles.container.borderRadius === undefined) {
        customStyles.container.borderRadius = 16;
      }
      styles.push(customStyles.container);
    }

    return styles;
  };

  const getTextStyle = () => {
    const {customStyles, selectedTextColor} = _marking;
    const styles = [style.text];

    if (isSelected) {
      styles.push(style.selectedText);
      if (selectedTextColor) {
        styles.push({color: selectedTextColor});
      }
    } else if (isDisabled) {
      styles.push(style.disabledText);
    } else if (isToday) {
      styles.push(style.todayText);
    } else if (isInactive) {
      styles.push(style.inactiveText);
    }

    //Custom marking type
    if (isCustom && customStyles && customStyles.text) {
      styles.push(customStyles.text);
    }

    return styles;
  };

  const renderMarking = () => {
    const {marked, dotColor, dots, periods} = _marking;

    return (
      <Marking
        type={markingType}
        theme={theme}
        marked={isMultiDot ? true : marked}
        selected={isSelected}
        disabled={isDisabled}
        inactive={isInactive}
        today={isToday}
        dotColor={dotColor}
        dots={dots}
        periods={periods}
      />
    );
  };

  const renderText = () => {
    return (
      <Text allowFontScaling={false} style={getTextStyle()}>
        {String(children)}
      </Text>
    );
  };

  const renderContent = () => {
    return (
      <Fragment>
        {renderText()}
        {renderMarking()}
      </Fragment>
    );
  };

  const renderContainer = () => {
    const {activeOpacity} = _marking;

    return (
      <TouchableOpacity
        testID={testID}
        style={getContainerStyle()}
        disabled={shouldDisableTouchEvent()}
        activeOpacity={activeOpacity}
        onPress={!shouldDisableTouchEvent() ? _onPress : undefined}
        onLongPress={!shouldDisableTouchEvent() ? _onLongPress : undefined}
        accessible
        accessibilityRole={isDisabled ? undefined : 'button'}
        accessibilityLabel={accessibilityLabel}
      >
        {isMultiPeriod ? renderText() : renderContent()}
      </TouchableOpacity>
    );
  };

  const renderPeriodsContainer = () => {
    return (
      <View style={style.container}>
        {renderContainer()}
        {renderMarking()}
      </View>
    );
  };

  return isMultiPeriod ? renderPeriodsContainer() : renderContainer();
};

export default BasicDay;
BasicDay.displayName = 'BasicDay';
BasicDay.propTypes = {
  state: PropTypes.oneOf(['selected', 'disabled', 'inactive', 'today', '']),
  marking: PropTypes.any,
  markingType: PropTypes.oneOf(values(Marking.markings)),
  theme: PropTypes.object,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  date: PropTypes.object,
  disableAllTouchEventsForDisabledDays: PropTypes.bool,
  disableAllTouchEventsForInactiveDays: PropTypes.bool

};
