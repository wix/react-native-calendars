import isEqual from 'lodash/isEqual'

import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import XDate from 'xdate';

import InfiniteList from '../../infinite-list';
import Week from '../week';
import WeekDaysNames from '../../commons/WeekDaysNames';
import {CalendarListProps} from '../../calendar-list';
import CalendarContext from '../../expandableCalendar/Context';
import styleConstructor from '../style';
import {toMarkingFormat} from '../../interface';
import {extractCalendarProps} from '../../componentUpdater';
import constants from '../../commons/constants';
import {UpdateSources} from '../commons';
import {sameWeek} from '../../dateutils';
import {DateData} from '../../types';

export interface WeekCalendarProps extends CalendarListProps {
  /** whether to have shadow/elevation for the calendar */
  allowShadow?: boolean;
}

const NUMBER_OF_PAGES = 50;
const DEFAULT_PAGE_HEIGHT = 48;

const WeekCalendar = (props: WeekCalendarProps) => {
  const {current, firstDay = 0, markedDates, allowShadow = true, hideDayNames, theme, calendarWidth, calendarHeight = DEFAULT_PAGE_HEIGHT, testID, minDate, maxDate} = props;
  const context = useContext(CalendarContext);
  const {date, updateSource} = context;
  const style = useRef(styleConstructor(theme));
  const list = useRef();
  const [items, setItems] = useState(getDatesArray(current || date, firstDay, NUMBER_OF_PAGES, minDate, maxDate));

  const extraData = {
    current,
    date: context.date,
    firstDay
  };

  const containerWidth = calendarWidth || constants.screenWidth;
  const weekStyle = useMemo(() => {
    return [{width: containerWidth}, props.style];
  }, [containerWidth, props.style]);

  useEffect(() => {
    if (updateSource !== UpdateSources.WEEK_SCROLL) {
      const pageIndex = items.findIndex(item => sameWeek(item, date, firstDay));
      // @ts-expect-error
      list.current?.scrollToOffset?.(pageIndex * containerWidth, 0, false);
    }
  }, [date]);

  const onDayPress = useCallback(
    (dateData: DateData) => {
      context.setDate?.(dateData.dateString, UpdateSources.DAY_PRESS);
      props.onDayPress?.(dateData);
    },
    [props.onDayPress]
  );

  const onPageChange = useCallback(
    (pageIndex: number, _prevPage, {scrolledByUser}) => {
      if (scrolledByUser) {
        context?.setDate(items[pageIndex], UpdateSources.WEEK_SCROLL);
      }
    },
    [items]
  );

  const reloadPages = useCallback(
    pageIndex => {
      const date = items[pageIndex];
      const newDatesArray = getDatesArray(date, firstDay, NUMBER_OF_PAGES, minDate, maxDate);
      //setItems(getDatesArray(date, firstDay, NUMBER_OF_PAGES, minDate, maxDate));
      if (!isEqual(items ,newDatesArray)){
        setItems(newDatesArray);
      }
    },
    [items]
  );

  const renderItem = useCallback(
    (_type: any, item: string) => {
      const {allowShadow, ...calendarListProps} = props;
      const {/* style,  */ ...others} = extractCalendarProps(calendarListProps);

      const isSameWeek = sameWeek(item, date, firstDay);

      return (
        <Week
          {...others}
          key={item}
          current={isSameWeek ? date : item}
          firstDay={firstDay}
          style={weekStyle}
          markedDates={markedDates}
          onDayPress={onDayPress}
          context={context}
        />
      );
    },
    [date, markedDates]
  );

  return (
    <View
      testID={testID}
      style={[allowShadow && style.current.containerShadow, !hideDayNames && style.current.containerWrapper]}
    >
      {!hideDayNames && (
        <View style={[style.current.week, style.current.weekCalendar]}>
          <WeekDaysNames firstDay={firstDay} style={style.current.dayHeader}/>
        </View>
      )}
      <View>
        <InfiniteList
          key="week-list"
          isHorizontal
          ref={list}
          data={items}
          renderItem={renderItem}
          reloadPages={reloadPages}
          onReachNearEdgeThreshold={getNearEdgeThreshold(items.length)}
          extendedState={extraData}
          style={style.current.container}
          initialPageIndex={getInitialIndex(date, items, firstDay)}
          pageHeight={calendarHeight}
          pageWidth={containerWidth}
          onPageChange={onPageChange}
          scrollViewProps={{
            showsHorizontalScrollIndicator: false
          }}
          autoScroll={items.length > 2}
        />
      </View>
    </View>
  );
};

export default WeekCalendar;

function getNearEdgeThreshold(elements: number){
  const threshold = Math.round((elements / 2) * 0.5)
  return threshold;
}

function getInitialIndex(date: string, elements: string[], firstDay: number){
  let index;
  if (elements.length < 3) {
      elements.forEach((element, i) => {
        if (sameWeek(date, element, firstDay))
        {
          index = i;
        }
      })
  }
  return index !== undefined ? index : Math.round((elements.length - 1) / 2)
}

function countWeekDaysBetween(weekDay: number, startDate: string, endDate: string){
  const start = XDate(startDate);
  const end = XDate(endDate);
  const diff = 1 +  Math.abs(end.diffDays(start));
  let weekDaysBetween =  Math.abs(Math.floor( (diff+(start.getDay()+6-weekDay) % 7 ) / 7 ));
  return weekDaysBetween;
}

// function getDate({current, context, firstDay = 0}: WeekCalendarProps, weekIndex: number) {
function getDate(date: string, firstDay: number, weekIndex: number) {
  // const d = new XDate(current || context.date);
  const d = new XDate(date);
  // get the first day of the week as date (for the on scroll mark)
  let dayOfTheWeek = d.getDay();
  if (dayOfTheWeek < firstDay && firstDay > 0) {
    dayOfTheWeek = 7 + dayOfTheWeek;
  }

  // leave the current date in the visible week as is
  const dd = weekIndex === 0 ? d : d.addDays(firstDay - dayOfTheWeek);
  const newDate = dd.addWeeks(weekIndex);
  return toMarkingFormat(newDate);
}

// function getDatesArray(args: WeekCalendarProps, numberOfPages = NUMBER_OF_PAGES) => {
function getDatesArray(date: string, firstDay: number, numberOfPages = NUMBER_OF_PAGES,  minDate: string | null = null, maxDate: string | null = null) {
  let pages = numberOfPages

  let countFirstDays = minDate ?  countWeekDaysBetween(firstDay, date, minDate) : null;
  let countLastDays = maxDate ? countWeekDaysBetween(firstDay === 0 ? firstDay + 6 : 0, date, maxDate) : null;

  countFirstDays = minDate && countFirstDays === 1 && sameWeek(minDate, date, firstDay) ? 0 : countFirstDays
  countLastDays = maxDate && countLastDays === 1 && sameWeek(maxDate, date, firstDay) ? 0 : countLastDays

  const pageFilters = [countFirstDays, countLastDays].filter(c => c !== null)

  if (pageFilters.length > 0) {
      if (numberOfPages > Math.min(...pageFilters)){
          pages = Math.min(...pageFilters);
      }
  }

  const array = [];
  for (let index = -pages; index <= pages; index++) {
      let d = getDate(date, firstDay, index);
      const reachMinValue = pages === countFirstDays && index === -pages;
      if (reachMinValue){
          d = toMarkingFormat(new XDate(minDate));
      }

      array.push(d);
  }

  // add an aditional page if the smallest value between countFirstDays and countLastDays is 0
  if (pages === 0 && countFirstDays !== countLastDays) {
      if (countLastDays === null || countFirstDays < countLastDays){
          const d = getDate(date, firstDay, 1);
          array.push(d);
      } else {
          const d = getDate(date, firstDay, -1);
          array.unshift(d)
      }
  }
  return array;
}
