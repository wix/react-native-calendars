import XDate from 'xdate';
import {Map} from 'immutable';

import {forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
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

  const style = useRef(styleConstructor(theme));

  const getDate = useCallback((weekIndex: number) => {
    const d = new XDate(current || context.date);
    const numberOfDays = context.numberOfDays;
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
      dayOfTheWeek = 7 + dayOfTheWeek;
    }
    const dd = weekIndex === 0 ? d : d.addDays(firstDay - dayOfTheWeek);

    const newDate = numberOfDays > 1 ? generateDay(toMarkingFormat(d), weekIndex * numberOfDays) : dd.addWeeks(weekIndex);

    return toMarkingFormat(newDate);
  }, [current, context.date, firstDay]);

  const getDatesArray = useMemo(() => {
    return [...Array(NUMBER_OF_PAGES + 1).keys()].map((index) => {
      return getDate(index-NUMBER_OF_PAGES);
    });
  }, [getDate]);

  const [page, setPage] = useState(NUMBER_OF_PAGES);
  const [items, setItems] = useState(getDatesArray);

  const list = useRef<FlatList>(null);
  const [firstAndroidRTLScroll, setFirstAndroidRTLScroll] = useState(constants.isAndroid && constants.isRTL);

  useEffect(() => {
    setItems(getDatesArray);
  }, []);

  const containerWidth = useMemo(() => {
    return calendarWidth ?? constants.screenWidth;
  }, [calendarWidth]);

  const onDayPressCallback = useCallback((value: DateData) => {
    if (onDayPress) {
      onDayPress(value);
    } else {
      context.setDate?.(value.dateString, UpdateSources.DAY_PRESS);
    }
  }, [context, onDayPress]);

  const onScrollCallback = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (firstAndroidRTLScroll) {
      setFirstAndroidRTLScroll(false);
      return;
    }

    const overallWidth = (items?.length - 1) * containerWidth;
    const eventXOffset = event.nativeEvent.contentOffset.x;
    const x = APPLY_ANDROID_FIX ? (overallWidth - eventXOffset) : eventXOffset;
    const newPage = Math.round(x / containerWidth);
    if (page !== newPage) {
      context.setDate?.(items[newPage], UpdateSources.WEEK_SCROLL);
    }
    setPage(newPage);
  }, [context, containerWidth, page, items, firstAndroidRTLScroll, setFirstAndroidRTLScroll]);

  const getWeekStyle = useCallback((width, style) => {
    return [{width}, style];
  }, []);

  const isFirstPage = useCallback((page: number) => {
    return page === 0;
  }, []);

  const isLastPage = useCallback((page: number, items: string[]) => {
    return page === items.length - 1;
  }, []);

  const onMomentumScrollEndCallback = useCallback(() => {
    if (isFirstPage(page) || isLastPage(page, items)) {
      setItems(getDatesArray);
      scrollToIndex(list);
    }
  }, [isFirstPage, isLastPage, list, page, getDatesArray]);

  const renderItem = useCallback(({item}: {item: string}) => {
    const isSameWeek = sameWeek(item, context.date, firstDay);
    const currentContext = isSameWeek ? context : undefined;
    return (
      <Week
        importantForAccessibility={importantForAccessibility}
        testID={testID}
        hideDayNames={hideDayNames}
        accessibilityElementsHidden={accessibilityElementsHidden}
        theme={theme}
        current={item}
        firstDay={firstDay}
        style={getWeekStyle(containerWidth, propsStyle)}
        markedDates={markedDates}
        onDayPress={onDayPressCallback}
        context={currentContext}
        numberOfDays={context.numberOfDays}
        timelineLeftInset={context.timelineLeftInset}
      />
    );
  },[ref, importantForAccessibility, testID, hideDayNames, accessibilityElementsHidden, theme, firstDay, containerWidth, propsStyle, markedDates, onDayPressCallback, context]);

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
    date: context.date,
    firstDay
  }), [current, context.date, firstDay]);

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
  const flashListContainerStyle = useMemo(() => {
    return style.current.container;
  }, []);

  const getItemLayout = useCallback((_, index: number) => {
    return {
      length: containerWidth,
      offset: containerWidth * index,
      index
    };
  }, [containerWidth]);
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
      <View style={flashListContainerStyle}>
          <FlatList
            ref={list as React.RefObject<FlatList>}
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
            getItemLayout={getItemLayout}
            onScroll={onScrollCallback}
            onMomentumScrollEnd={onMomentumScrollEndCallback}
          />
      </View>
    </View>
  );
});

WeekCalendar.displayName = 'WeekCalendar';

function shouldUpdate(prevProps: WeekCalendarProps, nextProps: WeekCalendarProps) {
  if (!nextProps.context || !prevProps.context) {
    return true;
  }

  const contextRequireUpdate = nextProps.context?.date !== prevProps.context?.date && nextProps.context.updateSource !== UpdateSources.WEEK_SCROLL ||
    nextProps.context.numberOfDays !== prevProps.context.numberOfDays;

  return contextRequireUpdate && !sameWeek(
    nextProps.context?.date,
    prevProps.context?.date,
    nextProps.firstDay ?? 0);
}

export default asCalendarConsumer(memo(WeekCalendar, shouldUpdate));
