import React, {Fragment, useCallback, useRef} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {xdateToData} from '../../../interface';
import styleConstructor from './style';
import Marking from '../marking';
const BasicDay = props => {
  const {
    theme,
    date,
    onPress,
    onLongPress,
    markingType,
    marking,
    state,
    disableAllTouchEventsForDisabledDays,
    disableAllTouchEventsForInactiveDays,
    accessibilityLabel,
    children,
    testID,
    limiteDate
  } = props;
  const style = useRef(styleConstructor(theme));
  const _marking = marking || {};
  const isSelected = _marking.selected || state === 'selected';
  const isDisabled = typeof _marking.disabled !== 'undefined' ? _marking.disabled : state === 'disabled';
  const isInactive = _marking?.inactive;
  const isToday = state === 'today';
  const isMultiDot = markingType === Marking.markings.MULTI_DOT;
  const isMultiPeriod = markingType === Marking.markings.MULTI_PERIOD;
  const isCustom = markingType === Marking.markings.CUSTOM;
  const dateData = date ? xdateToData(date) : undefined;
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
  const getContainerStyle = () => {
    const {customStyles, selectedColor} = _marking;
    const styles = [style.current.base];
    if (isSelected) {
      styles.push(style.current.selected);
      if (selectedColor) {
        styles.push({backgroundColor: selectedColor});
      }
    } else if (isToday) {
      styles.push(style.current.today);
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
    const styles = [style.current.text];
    if (isSelected) {
      styles.push(style.current.selectedText);
      if (selectedTextColor) {
        styles.push({color: selectedTextColor});
      }
    } else if (isDisabled) {
      styles.push(style.current.disabledText);
    } else if (isToday) {
      styles.push(style.current.todayText);
    } else if (isInactive) {
      styles.push(style.current.inactiveText);
    }
    //Custom marking type
    if (isCustom && customStyles && customStyles.text) {
      styles.push(customStyles.text);
    }
    return styles;
  };
  const _onPress = useCallback(() => {
    onPress?.(dateData);
  }, [onPress, date]);
  const _onLongPress = useCallback(() => {
    onLongPress?.(dateData);
  }, [onLongPress, date]);
  const isBeforeLimitDate = useCallback((dateString, limitDateString) => {
    const givenDate = new Date(dateString);
    const limiteDateCopie = new Date(limitDateString || '2023-01-01'); // par défaut à '2023-01-01' si non fourni
    return givenDate < limiteDateCopie;
  }, []);
  // if (isBeforeLimitDate(date, limiteDate)) {
  //   return null;
  // }
  if (isBeforeLimitDate(date, limiteDate)) {
    return <View style={{backgroundColor: 'red', width: 32, height: 32}} />;
  }
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
      <View style={style.current.container}>
        {renderContainer()}
        {renderMarking()}
      </View>
    );
  };
  return isMultiPeriod ? renderPeriodsContainer() : renderContainer();
};
export default BasicDay;
BasicDay.displayName = 'BasicDay';
