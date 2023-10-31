import findIndex from 'lodash/findIndex';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {FlatList, FlatListProps, View, ViewStyle} from 'react-native';

import {extractCalendarProps, extractHeaderProps} from '../componentUpdater';
import {parseDate, toMarkingFormat, xdateToData} from '../interface';
import {page, sameDate, sameMonth} from '../dateutils';
import constants from '../commons/constants';
import {useDidUpdate} from '../hooks';
import {ContextProp} from '../types';
import styleConstructor from './style';
import Calendar, {CalendarProps} from '../calendar';
import CalendarListItem from './item';
import CalendarHeader from '../calendar/header/index';
import isEqual from 'lodash/isEqual';

const CALENDAR_WIDTH = constants.screenWidth;
const CALENDAR_HEIGHT = 360;
const PAST_SCROLL_RANGE = 50;
const FUTURE_SCROLL_RANGE = 50;

export interface CalendarListProps extends CalendarProps, Omit<FlatListProps<any>, 'data' | 'renderItem'> {
  /** Max amount of months allowed to scroll to the past. Default = 50 */
  pastScrollRange?: number;
  /** Max amount of months allowed to scroll to the future. Default = 50 */
  futureScrollRange?: number;
  /** Used when calendar scroll is horizontal, default is device width, pagination should be disabled */
  calendarWidth?: number;
  /** Dynamic calendar height */
  calendarHeight?: number;
  /** Style for the List item (the calendar) */
  calendarStyle?: ViewStyle;
  /** Whether to use static header that will not scroll with the list (horizontal only) */
  staticHeader?: boolean;
  /** Enable or disable vertical / horizontal scroll indicator. Default = false */
  showScrollIndicator?: boolean;
  /** Whether to animate the auto month scroll */
  animateScroll?: boolean;
}

export interface CalendarListImperativeMethods {
  scrollToDay: (date: XDate | string, offset: number, animated: boolean) => void;
  scrollToMonth: (date: XDate | string) => void;
}

/**
 * @description: Calendar List component for both vertical and horizontal calendars
 * @extends: Calendar
 * @extendslink: docs/Calendar
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendarsList.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar-list.gif
 */
const CalendarList = (props: CalendarListProps & ContextProp, ref: any) => {
  useImperativeHandle(ref, () => ({
    scrollToDay: (date: XDate | string, offset: number, animated: boolean) => {
      scrollToDay(date, offset, animated);
    },
    scrollToMonth: (date: XDate | string) => {
      scrollToMonth(date);
    }
  }));

  const {
    /** Calendar props */
    theme,
    current,
    firstDay,
    markedDates,
    headerStyle,
    onMonthChange,
    onVisibleMonthsChange,
    /** CalendarList props */
    pastScrollRange = PAST_SCROLL_RANGE,
    futureScrollRange = FUTURE_SCROLL_RANGE,
    calendarHeight = CALENDAR_HEIGHT,
    calendarWidth = CALENDAR_WIDTH,
    calendarStyle,
    animateScroll = false,
    showScrollIndicator = false,
    staticHeader,
    /** View props */
    testID,
    style: propsStyle,
    onLayout,
    removeClippedSubviews,
    /** ScrollView props */
    horizontal = false,
    pagingEnabled,
    scrollEnabled = true,
    nestedScrollEnabled = true,
    scrollsToTop = false,
    keyExtractor = (_: any, index: number) => String(index),
    keyboardShouldPersistTaps,
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    /** FlatList props */
    onEndReachedThreshold,
    onEndReached
  } = props;

  const calendarProps = extractCalendarProps(props);
  const headerProps = extractHeaderProps(props);
  const calendarSize = horizontal ? calendarWidth : calendarHeight;

  const [currentMonth, setCurrentMonth] = useState(parseDate(current));

  const shouldUseAndroidRTLFix = useMemo(() => constants.isAndroidRTL && horizontal, [horizontal]);

  const style = useRef(styleConstructor(theme));
  const list = useRef();
  const range = useRef(horizontal ? 1 : 3);
  const initialDate = useRef(parseDate(current) || new XDate());
  const visibleMonth = useRef(currentMonth);

  const items: XDate[] = useMemo(() => {
    const months: any[] = [];
    for (let i = 0; i <= pastScrollRange + futureScrollRange; i++) {
      const rangeDate = initialDate.current?.clone().addMonths(i - pastScrollRange, true);
      months.push(rangeDate);
    }
    return months;
  }, [pastScrollRange, futureScrollRange]);

  const staticHeaderStyle = useMemo(() => {
    return [style.current.staticHeader, headerStyle];
  }, [headerStyle]);

  const listStyle = useMemo(() => {
    return [style.current.container, propsStyle];
  }, [propsStyle]);

  const initialDateIndex = useMemo(() => {
    return findIndex(items, function(item) {
      return item.toString() === initialDate.current?.toString();
    });
  }, [items]);

  const getDateIndex = useCallback((date: string) => {
    return findIndex(items, function(item) {
      return item.toString() === date.toString();
    });
  }, [items]);

  useEffect(() => {
    if (current) {
      scrollToMonth(new XDate(current));
    }
  }, [current]);

  useDidUpdate(() => {
    const currMont = currentMonth?.clone();
    if (currMont) {
      const data = xdateToData(currMont);
      onMonthChange?.(data);
      onVisibleMonthsChange?.([data]);
    }
  }, [currentMonth]);

  const scrollToDay = (date: XDate | string, offset: number, animated: boolean) => {
    const scrollTo = parseDate(date);
    const diffMonths = Math.round(initialDate?.current?.clone().setDate(1).diffMonths(scrollTo?.clone().setDate(1)));
    let scrollAmount = calendarSize * pastScrollRange + diffMonths * calendarSize + (offset || 0);

    if (!horizontal) {
      let week = 0;
      const days = page(scrollTo, firstDay);
      for (let i = 0; i < days.length; i++) {
        week = Math.floor(i / 7);
        if (sameDate(days[i], scrollTo)) {
          scrollAmount += 46 * week;
          break;
        }
      }
    }

    if (scrollAmount !== 0) {
      // @ts-expect-error
      list?.current?.scrollToOffset({offset: scrollAmount, animated});
    }
  };

  const scrollToMonth = useCallback((date: XDate | string) => {
    const scrollTo = parseDate(date);
    const diffMonths = Math.round(initialDate?.current?.clone().setDate(1).diffMonths(scrollTo?.clone().setDate(1)));
    const scrollAmount = calendarSize * (shouldUseAndroidRTLFix ? pastScrollRange - diffMonths : pastScrollRange + diffMonths);

    if (scrollAmount !== 0) {
      // @ts-expect-error
      list?.current?.scrollToOffset({offset: scrollAmount, animated: animateScroll});
    }
  }, [calendarSize, shouldUseAndroidRTLFix, pastScrollRange, animateScroll]);

  const addMonth = useCallback((count: number) => {
    const day = currentMonth?.clone().addMonths(count, true);
    if (sameMonth(day, currentMonth) || getDateIndex(day) === -1) {
      return;
    }
    scrollToMonth(day);
    setCurrentMonth(day);
  }, [currentMonth, scrollToMonth]);

  const getMarkedDatesForItem = useCallback((item?: XDate) => {
    if (markedDates && item) {
      for (const [key, _] of Object.entries(markedDates)) {
        if (sameMonth(new XDate(key), new XDate(item))) {
          return markedDates;
        }
      }
    }
  }, [markedDates]);

  const getItemLayout = useCallback((_: Array<XDate> | undefined | null, index: number) => {
    return {
      length: calendarSize,
      offset: calendarSize * index,
      index
    };
  }, []);

  const isDateInRange = useCallback((date) => {
    for(let i = -range.current; i <= range.current; i++) {
      const newMonth = currentMonth?.clone().addMonths(i, true);
      if (sameMonth(date, newMonth)) {
        return true;
      }
    }
    return false;
  }, [currentMonth]);

  const renderItem = useCallback(({item}: {item: XDate}) => {
    const dateString = toMarkingFormat(item);
    const [year, month] = dateString.split('-');
    const testId = `${testID}.item_${year}-${month}`;
    return (
      <CalendarListItem
        {...calendarProps}
        testID={testId}
        markedDates={getMarkedDatesForItem(item)}
        item={item}
        style={calendarStyle}
        // @ts-expect-error - type mismatch - ScrollView's 'horizontal' is nullable
        horizontal={horizontal}
        calendarWidth={calendarWidth}
        calendarHeight={calendarHeight}
        scrollToMonth={scrollToMonth}
        visible={isDateInRange(item)}
      />
    );
  }, [horizontal, calendarStyle, calendarWidth, testID, getMarkedDatesForItem, isDateInRange, calendarProps]);

  const renderStaticHeader = () => {
    if (staticHeader && horizontal) {
      return (
        <CalendarHeader
          {...headerProps}
          testID={`${testID}.staticHeader`}
          style={staticHeaderStyle}
          month={currentMonth}
          addMonth={addMonth}
          accessibilityElementsHidden={true} // iOS
          importantForAccessibility={'no-hide-descendants'} // Android
        />
      );
    }
  };

  /** Viewable month */

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 20
  });

  const onViewableItemsChanged = useCallback(({viewableItems}: any) => {
    const newVisibleMonth = parseDate(viewableItems[0]?.item);
    if (shouldUseAndroidRTLFix) {
      const centerIndex = items.findIndex((item) => isEqual(parseDate(current), item));
      const adjustedOffset = centerIndex - items.findIndex((item) => isEqual(newVisibleMonth, item));
      visibleMonth.current = items[centerIndex + adjustedOffset];
      setCurrentMonth(visibleMonth.current);
    } else {
      if (!sameDate(visibleMonth?.current, newVisibleMonth)) {
        visibleMonth.current = newVisibleMonth;
        setCurrentMonth(visibleMonth.current);
      }
    }
  }, [items, shouldUseAndroidRTLFix, current]);

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: viewabilityConfig.current,
      onViewableItemsChanged
    },
  ]);

  return (
    <View style={style.current.flatListContainer} testID={testID}>
      <FlatList
        // @ts-expect-error
        ref={list}
        windowSize={shouldUseAndroidRTLFix ? pastScrollRange + futureScrollRange + 1 : undefined}
        style={listStyle}
        showsVerticalScrollIndicator={showScrollIndicator}
        showsHorizontalScrollIndicator={showScrollIndicator}
        data={items}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={range.current}
        initialScrollIndex={initialDateIndex}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        testID={`${testID}.list`}
        onLayout={onLayout}
        removeClippedSubviews={removeClippedSubviews}
        pagingEnabled={pagingEnabled}
        scrollEnabled={scrollEnabled}
        scrollsToTop={scrollsToTop}
        horizontal={horizontal}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={onEndReachedThreshold}
        onEndReached={onEndReached}
        nestedScrollEnabled={nestedScrollEnabled}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
      />
      {renderStaticHeader()}
    </View>
  );
};

export default forwardRef(CalendarList);
CalendarList.displayName = 'CalendarList';
CalendarList.propTypes = {
  ...Calendar.propTypes,
  pastScrollRange: PropTypes.number,
  futureScrollRange: PropTypes.number,
  calendarWidth: PropTypes.number,
  calendarHeight: PropTypes.number,
  calendarStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  staticHeader: PropTypes.bool,
  showScrollIndicator: PropTypes.bool,
  animateScroll: PropTypes.bool,
  scrollEnabled: PropTypes.bool,
  scrollsToTop: PropTypes.bool,
  pagingEnabled: PropTypes.bool,
  horizontal: PropTypes.bool,
  keyboardShouldPersistTaps: PropTypes.oneOf(['never', 'always', 'handled']),
  keyExtractor: PropTypes.func,
  onEndReachedThreshold: PropTypes.number,
  onEndReached: PropTypes.func,
  nestedScrollEnabled: PropTypes.bool
};
