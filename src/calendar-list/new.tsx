import XDate from 'xdate';
import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {View, ScrollViewProps, ScrollView} from 'react-native';
import constants from '../commons/constants';
import {toMarkingFormat} from '../interface';
import {extractComponentProps} from '../componentUpdater';
import Calendar, {CalendarProps} from '../calendar';
import CalendarHeader from '../calendar/header';
import InfiniteList from '../infinite-list';
import styleConstructor from './style';

export interface CalendarListProps {
  /** Initially visible month */
  initialDate?: string;
  /** Whether the scroll is horizontal */
  horizontal?: boolean;
  /** The amount of months allowed to scroll to the past and future. Default = 50 */
  scrollRange?: number;
  /** Whether to use static header that will not scroll with the list (horizontal only) */
  staticHeader?: boolean;
  /** Props to pass the list */
  scrollViewProps?: ScrollViewProps;
  /** Props to pass the list items */
  calendarProps?: CalendarProps;
  /** Identifier for testing */
  testID?: string;
}

const NUMBER_OF_PAGES = 5;
const CALENDAR_HEIGHT = 360;

const CalendarList = (props: CalendarListProps) => {
  const {
    initialDate,
    horizontal = true, 
    scrollRange = NUMBER_OF_PAGES,
    staticHeader, 
    scrollViewProps,
    calendarProps,
    testID
  } = props;
  const style = useRef(styleConstructor(calendarProps?.theme));
  const list = useRef<ScrollView>();
  const [items, setItems] = useState(getDatesArray(initialDate, scrollRange));
  const [currentMonth, setCurrentMonth] = useState(initialDate || items[scrollRange]);
  const useStaticHeader = staticHeader && horizontal;
  const headerProps = extractComponentProps(CalendarHeader, props);
  const staticHeaderStyle = useMemo(() => {
    return [style.current.staticHeader, calendarProps?.headerStyle];
  }, [calendarProps?.headerStyle]);

  useEffect(() => {
    console.log('effect: ', currentMonth);
    scrollToMonth(currentMonth);
  }, [currentMonth]);

  const getMonthIndex = useCallback((month?: XDate) => {
    console.log('getMonthIndex: ', month, items); // items no updated
    if (!month) {
      return -1;
    }
    return items.findIndex(item => item.includes(month.toString('yyyy-MM')));
  }, [items]);

  const scrollToMonth = useCallback((month?: string) => {
    if (month) {
      const index = getMonthIndex(new XDate(month));
      console.log('scrollToMonth: ', index, month);
      if (index !== -1) {
        // @ts-expect-error
        list.current?.scrollToOffset?.(index * constants.screenWidth, 0, true);
      }
    }
  }, [getMonthIndex]);

  const updateMonth = useCallback((count: number, month?: XDate) => {
    if (month) {
      const next = new XDate(month).addMonths(count, true);
      const nextNext = new XDate(month).addMonths(count * 2, true);
      const nextNextIndex = getMonthIndex(nextNext);
      console.log('next: ', nextNextIndex, nextNext);
      if (nextNextIndex !== -1) {
        setCurrentMonth(toMarkingFormat(next));
      }
    }
  }, [getMonthIndex]);

  const scrollToNextMonth = useCallback((method: () => void, month?: XDate) => {
    console.log('monthForScroll: ', month);
    if (calendarProps?.onPressArrowLeft) {
      calendarProps?.onPressArrowLeft?.(method, month);
    } else {
      updateMonth(1, month);
    }
  }, [updateMonth]);

  const scrollToPreviousMonth = useCallback((method: () => void, month?: XDate) => {
    if (calendarProps?.onPressArrowRight) {
      calendarProps?.onPressArrowRight?.(method, month);
    } else {
      updateMonth(-1, month);
    }
  }, [updateMonth]);

  const reloadPages = useCallback(
    pageIndex => {
      console.log('reloading: ', pageIndex, items[pageIndex]);
      const newItems = getDatesArray(items[pageIndex], scrollRange);
      setItems(newItems);
    },
    [items]
  );

  const onPageChange = useCallback((pageIndex: number, prevPageIndex: number, info: {scrolledByUser: boolean}) => {
    if (useStaticHeader && info.scrolledByUser) {
      setCurrentMonth(items[pageIndex]);
    }
  }, [items]);

  const renderStaticHeader = () => {
    if (useStaticHeader) {
      return (
        <CalendarHeader
          {...headerProps}
          month={new XDate(currentMonth)}
          onPressArrowRight={scrollToNextMonth}
          onPressArrowLeft={scrollToPreviousMonth}
          style={staticHeaderStyle}
          accessibilityElementsHidden // iOS
          importantForAccessibility={'no-hide-descendants'} // Android
          testID={'static-header'}
        />
      );
    }
  };

  const renderItem = useCallback((_type: any, item: string) => {
    return (
      <Calendar
        {...calendarProps}
        {...headerProps}
        initialDate={item}
        disableMonthChange
        onPressArrowRight={scrollToNextMonth}
        onPressArrowLeft={scrollToPreviousMonth} 
        hideExtraDays={calendarProps?.hideExtraDays || true}
        style={[style.current.calendar, calendarProps?.style]}
        headerStyle={horizontal ? calendarProps?.headerStyle : undefined}
        testID={`${testID}_${item}`}
        // context={context}
      />
    );
  }, [calendarProps]);

  return (
    <View style={style.current.flatListContainer}>
      <InfiniteList
        key="calendar-list"
        ref={list}
        data={items}
        renderItem={renderItem}
        reloadPages={reloadPages}
        onReachNearEdgeThreshold={Math.round(NUMBER_OF_PAGES * 0.4)}
        extendedState={calendarProps?.markedDates}
        // horizontal={horizontal}
        style={style.current.container}
        initialPageIndex={scrollRange}
        pageHeight={CALENDAR_HEIGHT}
        pageWidth={constants.screenWidth}
        onPageChange={onPageChange}
        scrollViewProps={{
          ...scrollViewProps,
          showsHorizontalScrollIndicator: false,
          showsVerticalScrollIndicator: false
        }}
      />
      {renderStaticHeader()}
    </View>
  );
};
export default CalendarList;


function getDate(date: string, index: number) {
  const d = new XDate(date);
  d.addMonths(index);
  
  // if (index !== 0) {
    d.setDate(1);
  // }
  return toMarkingFormat(d);
}

function getDatesArray(date?: string, numberOfPages = NUMBER_OF_PAGES) {
  const d = date || new XDate().toString();
  const array = [];
  for (let index = -numberOfPages; index <= numberOfPages; index++) {
    const newDate = getDate(d, index);
    array.push(newDate);
  }
  return array;
}
