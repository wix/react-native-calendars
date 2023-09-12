import XDate from 'xdate';

import React, {useCallback, useContext, useMemo, useRef, useState} from 'react';
import {FlatList, View, ViewToken} from 'react-native';

import {sameWeek, onSameDateRange, getWeekDates} from '../../dateutils';
import {toMarkingFormat} from '../../interface';
import {DateData, MarkedDates} from '../../types';
import styleConstructor from '../style';
import {CalendarListProps} from '../../calendar-list';
import WeekDaysNames from '../../commons/WeekDaysNames';
import Week from '../week';
import {UpdateSources} from '../commons';
import constants from '../../commons/constants';
import {extractCalendarProps} from '../../componentUpdater';
import CalendarContext from '../Context';
import {useDidUpdate} from '../../hooks';

export const NUMBER_OF_PAGES = 6;
const NUM_OF_ITEMS = NUMBER_OF_PAGES * 2 + 1; // NUMBER_OF_PAGES before + NUMBER_OF_PAGES after + current

export interface WeekCalendarProps extends CalendarListProps {
  /** whether to have shadow/elevation for the calendar */
  allowShadow?: boolean;
}

/**
 * @description: Week calendar component
 * @note: Should be wrapped with 'CalendarProvider'
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const WeekCalendar = (props: WeekCalendarProps) => {
  const {
    calendarWidth,
    hideDayNames,
    current,
    theme,
    testID,
    markedDates,
  } = props;
  const context = useContext(CalendarContext);
  const {allowShadow = true, ...calendarListProps} = props;
  const {style: propsStyle, onDayPress, firstDay = 0, ...others} = extractCalendarProps(calendarListProps);
  const {date, numberOfDays, updateSource, setDate, timelineLeftInset} = context;
  const visibleWeek = useRef(date);
  const style = useRef(styleConstructor(theme));
  const items = useRef<string[]>(getDatesArray(current ?? date, firstDay, numberOfDays));
  const [listData, setListData] = useState(items.current);
  const changedItems = useRef(constants.isRTL);
  const list = useRef<FlatList>(null);
  const currentIndex = useRef(NUMBER_OF_PAGES);

  useDidUpdate(() => {
    items.current = getDatesArray(date, firstDay, numberOfDays);
    setListData(items.current);
    visibleWeek.current = date;
    list?.current?.scrollToIndex({index: NUMBER_OF_PAGES, animated: false});
  }, [numberOfDays]);

  useDidUpdate(() => {
    if (updateSource !== UpdateSources.WEEK_SCROLL) {
      const pageIndex = items.current.findIndex(
        item => isCustomNumberOfDays(numberOfDays) ?
          onSameDateRange({
            firstDay: item,
            secondDay: date,
            numberOfDays: numberOfDays as number,
            firstDateInRange: item
          }) :
          sameWeek(item, date, firstDay));
      if (pageIndex !== currentIndex.current) {
        const adjustedIndexFrScroll = constants.isAndroidRTL ? NUM_OF_ITEMS - 1 - pageIndex : pageIndex;
        if (pageIndex >= 0) {
          visibleWeek.current = items.current[adjustedIndexFrScroll];
          currentIndex.current = adjustedIndexFrScroll;
        } else {
          visibleWeek.current = date;
          currentIndex.current = NUMBER_OF_PAGES;
        }
        pageIndex <= 0 ? onEndReached() : list?.current?.scrollToIndex({index: adjustedIndexFrScroll, animated: false});
      }
    }
  }, [date, updateSource]);

  const containerWidth = useMemo(() => {
    return calendarWidth ?? constants.screenWidth;
  }, [calendarWidth]);

  const _onDayPress = useCallback((value: DateData) => {
    if (onDayPress) {
      onDayPress(value);
    } else {
      setDate?.(value.dateString, UpdateSources.DAY_PRESS);
    }
  }, [onDayPress]);

  const getCurrentWeekMarkings = useCallback((date: string, markings?: MarkedDates): MarkedDates | undefined => {
    if (!markings) {
      return;
    }
    const dates = getWeekDates(date, firstDay) as XDate[] | undefined;
    return dates?.reduce((acc, date) => {
      const dateString = toMarkingFormat(date);
      return {
        ...acc,
      ...(
        markings[dateString] && {[dateString]: markings[dateString]}
      ),
      };
    }, {});
  }, []);

  const weekStyle = useMemo(() => {
    return [{width: containerWidth}, propsStyle];
  }, [containerWidth, propsStyle]);

  const renderItem = useCallback(({item}: {item: string}) => {
    const currentContext = sameWeek(date, item, firstDay) ? context : undefined;
    const markings = getCurrentWeekMarkings(item, markedDates);

    return (
      <Week
        {...others}
        markedDates={markings}
        current={item}
        firstDay={firstDay}
        style={weekStyle}
        context={currentContext}
        onDayPress={_onDayPress}
        numberOfDays={numberOfDays}
        timelineLeftInset={timelineLeftInset}
      />
    );
  },[firstDay, _onDayPress, context, date, markedDates]);

  const keyExtractor = useCallback((item) => item, []);

  const renderWeekDaysNames = useMemo(() => {
    return (
      <WeekDaysNames
        firstDay={firstDay}
        style={style.current.dayHeader}
      />
    );
  },[firstDay]);

  const weekCalendarStyle = useMemo(() => {
    return [
      allowShadow && style.current.containerShadow,
      !hideDayNames && style.current.containerWrapper
    ];
  }, [allowShadow, hideDayNames]);

  const containerStyle = useMemo(() => {
    return [style.current.week, style.current.weekCalendar];
  }, []);

  const getItemLayout = useCallback((_, index: number) => {
    return {
      length: containerWidth,
      offset: containerWidth * index,
      index
    };
  }, [containerWidth]);

  const onEndReached = useCallback(() => {
    changedItems.current = true;
    items.current = (getDatesArray(visibleWeek.current, firstDay, numberOfDays));
    setListData(items.current);
    currentIndex.current = NUMBER_OF_PAGES;
    list?.current?.scrollToIndex({index: NUMBER_OF_PAGES, animated: false});
  }, [firstDay, numberOfDays]);

  const onViewableItemsChanged = useCallback(({viewableItems}: { viewableItems: Array<ViewToken>}) => {
    if (changedItems.current || viewableItems.length === 0) {
      changedItems.current = false;
      return;
    }
    const currItems = items.current;
    const newDate = viewableItems[0]?.item;
    if (newDate !== visibleWeek.current) {
      if (constants.isAndroidRTL) {
        //in android RTL the item we see is the one in the opposite direction
        const newDateOffset = -1 * (NUMBER_OF_PAGES - currItems.indexOf(newDate));
        const adjustedNewDate = currItems[NUMBER_OF_PAGES - newDateOffset];
        visibleWeek.current = adjustedNewDate;
        currentIndex.current = currItems.indexOf(adjustedNewDate);
        setDate(adjustedNewDate, UpdateSources.WEEK_SCROLL);
        if (visibleWeek.current === currItems[currItems.length - 1]) {
          onEndReached();
        }
      } else {
        currentIndex.current = currItems.indexOf(newDate);
        visibleWeek.current = newDate;
        setDate(newDate, UpdateSources.WEEK_SCROLL);
        if (visibleWeek.current === currItems[0]) {
          onEndReached();
        }
      }
    }
  }, [onEndReached]);

  const viewabilityConfigCallbackPairs = useRef([{
      viewabilityConfig: {
        itemVisiblePercentThreshold: 20,
      },
      onViewableItemsChanged,
    }]);

  return (
    <View
      testID={testID}
      style={weekCalendarStyle}
    >
      {!hideDayNames && (
        <View style={containerStyle}>
          {renderWeekDaysNames}
        </View>
      )}
      <View style={style.current.container}>
          <FlatList
            testID={`${testID}.list`}
            ref={list}
            style={style.current.container}
            data={listData}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            scrollEnabled
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            initialScrollIndex={NUMBER_OF_PAGES}
            getItemLayout={getItemLayout}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            onEndReached={onEndReached}
            onEndReachedThreshold={1/NUM_OF_ITEMS}
          />
      </View>
    </View>
  );
};

function getDateForDayRange(date: string, weekIndex: number, numberOfDays: number) {
  const d = new XDate(date);
  if (weekIndex !== 0) {
    d.addDays(numberOfDays * weekIndex);
  }
  return toMarkingFormat(d);
}

function getDate(date: string, firstDay: number, weekIndex: number, numberOfDays?: number) {
  const d = new XDate(date);
  // get the first day of the week as date (for the on scroll mark)
  let dayOfTheWeek = d.getDay();
  if (dayOfTheWeek < firstDay && firstDay > 0) {
    dayOfTheWeek = 7 + dayOfTheWeek;
  }
  if (weekIndex !== 0) {
    d.addDays(firstDay - dayOfTheWeek);
  }
  const newDate = numberOfDays && numberOfDays > 1 ? d.addDays(weekIndex * numberOfDays) : d.addWeeks(weekIndex);
  const today = new XDate();
  const offsetFromNow = newDate.diffDays(today);
  const isSameWeek = offsetFromNow > 0 && offsetFromNow < (numberOfDays ?? 7);
  return toMarkingFormat(isSameWeek ? today : newDate);
}

function getDatesArray(date: string, firstDay: number, numberOfDays?: number) {
  return [...Array(NUM_OF_ITEMS).keys()].map((index) => {
    if(isCustomNumberOfDays(numberOfDays)) {
      return getDateForDayRange(date, index - NUMBER_OF_PAGES, numberOfDays as number);
    }
    return getDate(date, firstDay, index - NUMBER_OF_PAGES);
  });
}

function isCustomNumberOfDays(numberOfDays?: number) {
  return numberOfDays && numberOfDays > 1;
}

WeekCalendar.displayName = 'WeekCalendar';

export default WeekCalendar;
