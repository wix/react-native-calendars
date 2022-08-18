import XDate from 'xdate';
import {Map} from 'immutable';

import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, NativeSyntheticEvent, NativeScrollEvent, FlatList} from 'react-native';

import {generateDay, sameWeek} from '../../dateutils';
import {toMarkingFormat} from '../../interface';
import {DateData} from '../../types';
import styleConstructor from '../style';
import asCalendarConsumer from '../asCalendarConsumer';
import {CalendarListProps} from '../../calendar-list';
import WeekDaysNames from '../../commons/WeekDaysNames';
import Week from '../week';
import {UpdateSources} from '../commons';
import constants from '../../commons/constants';

const NUMBER_OF_PAGES = 2; // must be a positive number
const NUM_OF_ITEMS = NUMBER_OF_PAGES * 2 + 1; // NUMBER_OF_PAGES before + NUMBER_OF_PAGES after + current

const APPLY_ANDROID_FIX = constants.isAndroid && constants.isRTL;

export interface WeekCalendarProps extends CalendarListProps {
  /** whether to have shadow/elevation for the calendar */
  allowShadow?: boolean;
  context?: any;
}

/**
 * @description: Week calendar component
 * @note: Should be wrapped with 'CalendarProvider'
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const WeekCalendar = forwardRef((props: WeekCalendarProps, ref) => {
  const {
    calendarWidth,
    firstDay = 0,
    hideDayNames,
    current,
    markedDates,
    allowShadow = true,
    context,
    theme,
    style: propsStyle,
    onDayPress,
    importantForAccessibility,
    testID,
    accessibilityElementsHidden,
  } = props;
  const {date, numberOfDays, updateSource, prevDate} = context;
  const style = useRef(styleConstructor(theme));

  const getDate = useCallback((weekIndex: number) => {
    const d = new XDate(current || date);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
      dayOfTheWeek = 7 + dayOfTheWeek;
    }
    if (weekIndex !== 0) {
      d.addDays(firstDay - dayOfTheWeek);
    }

    const newDate = numberOfDays > 1 ? generateDay(toMarkingFormat(d), weekIndex * numberOfDays) : d.addWeeks(weekIndex);

    return toMarkingFormat(newDate);
  }, [current, date, numberOfDays, firstDay]);

  useEffect(() => {
    if (updateSource !== UpdateSources.WEEK_SCROLL) {
      const pageIndex = items.findIndex(item => sameWeek(item, date, firstDay));
      const oldIndex = items.findIndex(item => sameWeek(item, prevDate, firstDay));
      if (pageIndex !== oldIndex) {
        list.current?.scrollToOffset?.({offset: pageIndex * containerWidth, animated: false});
      }
    }
  }, [date, updateSource]);

  const getDatesArray = useMemo(() => {
    return [...Array(NUM_OF_ITEMS).keys()].map((index) => {
      return getDate(index-NUMBER_OF_PAGES);
    });
  }, [getDate]);

  const [page, setPage] = useState(NUMBER_OF_PAGES);
  const [items, setItems] = useState(getDatesArray);
  const visibleWeek = useRef<string>(items[page]);

  const list = useRef<FlatList>(null);
  const [firstAndroidRTLScroll, setFirstAndroidRTLScroll] = useState(constants.isAndroid && constants.isRTL);

  const containerWidth = useMemo(() => {
    return calendarWidth ?? constants.screenWidth;
  }, [calendarWidth]);

  const onDayPressCallback = useCallback((value: DateData) => {
    if (onDayPress) {
      onDayPress(value);
    } else {
      context.setDate?.(value.dateString, UpdateSources.DAY_PRESS);
    }
  }, [onDayPress]);

  const isWeekVisible = useCallback((item: string) => {
    return sameWeek(item, visibleWeek.current, firstDay);
  }, [visibleWeek, firstDay]);

  const onScrollCallback = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (firstAndroidRTLScroll) {
      setFirstAndroidRTLScroll(false);
      return;
    }

    const overallWidth = (NUM_OF_ITEMS - 1) * containerWidth;
    const eventXOffset = event.nativeEvent.contentOffset.x;
    const x = APPLY_ANDROID_FIX ? (overallWidth - eventXOffset) : eventXOffset;
    const newPage = Math.round(x / containerWidth);
    if (page !== newPage) {
      context.setDate?.(items[newPage], UpdateSources.WEEK_SCROLL);
    }
    setPage(newPage);
  }, [context, containerWidth, page, items, firstAndroidRTLScroll, setFirstAndroidRTLScroll]);

  const getWeekStyle = useMemo(() => {
    return [{width: containerWidth}, propsStyle];
  }, []);

  const onMomentumScrollEndCallback = useCallback(() => {
    if (page === 0 || page === NUM_OF_ITEMS - 1) {
      setItems(getDatesArray);
      scrollToIndex(list);
    }
  }, [list, page, getDatesArray]);

  const renderItem = useCallback(({item}: {item: string}) => {
    const isSameWeek = sameWeek(item, date, firstDay);
    const currentContext = isSameWeek ? context : undefined;

    return (
      <Week
        visible={isSameWeek}
        selectedDay={date}
        importantForAccessibility={importantForAccessibility}
        testID={testID}
        hideDayNames={hideDayNames}
        accessibilityElementsHidden={accessibilityElementsHidden}
        theme={theme}
        current={item}
        firstDay={firstDay}
        style={getWeekStyle}
        markedDates={markedDates}
        onDayPress={onDayPressCallback}
        context={currentContext}
        numberOfDays={numberOfDays}
        timelineLeftInset={context.timelineLeftInset}
      />
    );
  },[ref, importantForAccessibility, testID, hideDayNames, accessibilityElementsHidden, theme, firstDay, containerWidth, propsStyle, markedDates, onDayPressCallback, context, date, isWeekVisible]);

  const keyExtractor = useCallback((_, index: number) => index.toString(), []);

  const renderWeekDaysNames = useMemo(() => {
    return (
      <WeekDaysNames
        firstDay={firstDay}
        style={style.current.dayHeader}
      />
    );
  },[firstDay]);

  const extraData = useMemo(() => Map({
    current,
    date,
    firstDay
  }), [current, date, firstDay]);

  const scrollToIndex = (list: React.RefObject<any>, animated = false) => {
    list?.current?.scrollToIndex({animated, index: NUMBER_OF_PAGES});
  };

  const weekCalendarStyle = useMemo(() => {
    return [
      allowShadow && style.current.containerShadow,
      !hideDayNames && style.current.containerWrapper
    ];
  }, [allowShadow, hideDayNames]);

  const containerStyle = useMemo(() => {
    return [style.current.week, style.current.weekCalendar];
  }, []);

  const flatListContainerStyle = useMemo(() => {
    return style.current.container;
  }, []);

  const getItemLayout = useCallback((_, index: number) => {
    return {
      length: containerWidth,
      offset: containerWidth * index,
      index
    };
  }, [containerWidth]);

  const onViewableItemsChanged = useCallback(({viewableItems}: any) => {
    const newVisibleWeek = viewableItems[0]?.item;
    if (!sameWeek(newVisibleWeek, visibleWeek.current, firstDay)) {
      visibleWeek.current = newVisibleWeek;
    }
  }, []);

  const viewabilityConfigCallbackPairs = useRef([{
      viewabilityConfig: {
        viewAreaCoveragePercentThreshold: 1
      },
      onViewableItemsChanged,
    }]);

  return (
    <View
      testID={props.testID}
      style={weekCalendarStyle}
    >
      {!hideDayNames && (
        <View style={containerStyle}>
          {renderWeekDaysNames}
        </View>
      )}
      <View style={flatListContainerStyle}>
          <FlatList
            ref={list}
            data={items}
            extraData={extraData}
            style={style.current.container}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            scrollEnabled
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            initialScrollIndex={NUMBER_OF_PAGES}
            initialNumToRender={items.length}
            getItemLayout={getItemLayout}
            onScroll={onScrollCallback}
            onMomentumScrollEnd={onMomentumScrollEndCallback}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          />
      </View>
    </View>
  );
});

WeekCalendar.displayName = 'WeekCalendar';

export default asCalendarConsumer<WeekCalendarProps>(WeekCalendar);
