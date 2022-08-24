import XDate from 'xdate';

import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, View, ViewToken} from 'react-native';

import {generateDay, sameWeek} from '../../dateutils';
import {toMarkingFormat} from '../../interface';
import {DateData} from '../../types';
import styleConstructor from '../style';
import {CalendarListProps} from '../../calendar-list';
import WeekDaysNames from '../../commons/WeekDaysNames';
import Week from '../week';
import {UpdateSources} from '../commons';
import constants from '../../commons/constants';
import {extractCalendarProps} from '../../componentUpdater';
import CalendarContext from '../Context';

const NUMBER_OF_PAGES = 6; // must be a positive number
const NUM_OF_ITEMS = NUMBER_OF_PAGES * 2 + 1; // NUMBER_OF_PAGES before + NUMBER_OF_PAGES after + current
// const APPLY_ANDROID_FIX = constants.isAndroid && constants.isRTL;

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
  } = props;
  const context = useContext(CalendarContext);
  const {allowShadow = true, ...calendarListProps} = props;
  const {style: propsStyle, onDayPress, firstDay = 0, ...others} = extractCalendarProps(calendarListProps);
  const {date, numberOfDays, updateSource, prevDate, setDate, timelineLeftInset} = context;
  const style = useRef(styleConstructor(theme));

  useEffect(() => {
    console.log(updateSource);
    if (updateSource !== UpdateSources.WEEK_SCROLL) {
      const pageIndex = items.findIndex(item => sameWeek(item, date, firstDay));
      const oldIndex = items.findIndex(item => sameWeek(item, prevDate, firstDay));
      if (pageIndex !== oldIndex) {
        list?.current?.scrollToIndex({index: pageIndex, animated: false});
      }
    }
  }, [date, updateSource]);

  const [items, setItems] = useState(getDatesArray(current ?? date, firstDay, numberOfDays));
  const list = useRef<FlatList>(null);
  // const [firstAndroidRTLScroll, setFirstAndroidRTLScroll] = useState(constants.isAndroid && constants.isRTL);

  const containerWidth = useMemo(() => {
    return calendarWidth ?? constants.screenWidth;
  }, [calendarWidth]);

  const onDayPressCallback = useCallback((value?: DateData) => {
    if (onDayPress) {
      onDayPress(value);
    } else if (value) {
      setDate?.(value.dateString, UpdateSources.DAY_PRESS);
    }
  }, [onDayPress]);

  const getWeekStyle = useMemo(() => {
    return [{width: containerWidth}, propsStyle];
  }, [containerWidth, propsStyle]);

  const renderItem = useCallback(({item}: {item: string}) => {
    const currentContext = date === item ? context : undefined;

    return (
      <Week
        {...others}
        key={item}
        current={item}
        firstDay={firstDay}
        style={getWeekStyle}
        context={currentContext}
        onDayPress={onDayPressCallback}
        numberOfDays={numberOfDays}
        timelineLeftInset={timelineLeftInset}
      />
    );
  },[firstDay, onDayPressCallback, context, date]);

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

  const viewabilityConfigCallbackPairs = useMemo(() => {
    return [{
      viewabilityConfig: {
        itemVisiblePercentThreshold: 20,
      },
      onViewableItemsChanged: ({viewableItems}: { viewableItems: Array<ViewToken>}) => {
        const newDate = viewableItems[0]?.item;
        if (newDate !== date) {
          setDate(newDate, UpdateSources.WEEK_SCROLL);
        }
      }
    }];
  }, []);

  const onEndReached = useCallback(() => {
    setItems(getDatesArray(date, firstDay, numberOfDays));
    list?.current?.scrollToIndex({index: NUMBER_OF_PAGES, animated: false});
  }, [date, firstDay, numberOfDays]);

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
            style={style.current.container}
            data={items}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            scrollEnabled
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            initialScrollIndex={NUMBER_OF_PAGES}
            getItemLayout={getItemLayout}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
            onEndReached={onEndReached}
            onEndReachedThreshold={2}
          />
      </View>
    </View>
  );
};

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

  const newDate = numberOfDays && numberOfDays > 1 ? generateDay(d, weekIndex * numberOfDays) : d.addWeeks(weekIndex);

  return toMarkingFormat(newDate);
}

function getDatesArray (date: string, firstDay: number, numberOfDays?: number) {
  return [...Array(NUM_OF_ITEMS).keys()].map((index) => {
    return getDate(date, firstDay, index-NUMBER_OF_PAGES, numberOfDays);
  });
}

WeekCalendar.displayName = 'WeekCalendar';

export default WeekCalendar;
