import XDate from 'xdate';

import {toMarkingFormat} from '../../interface';
import {WeekCalendarProps} from './index';
import constants from '../../commons/constants';
import {generateDay} from '../../dateutils';
import {UpdateSources} from '../commons';

// must be a positive number
const NUMBER_OF_PAGES = 2;

export const onScroll = ({context, x, page, items, width, firstAndroidRTLScroll, setFirstAndroidRTLScroll}: any) => {
  if (firstAndroidRTLScroll) {
    setFirstAndroidRTLScroll(false);
    return page;
  }

  x = getX(x, items?.length, width);
  const newPage = Math.round(x / width);
  if (page !== newPage) {
    context.setDate?.(items[newPage], UpdateSources.WEEK_SCROLL);
  }
  return newPage;
};

export const shouldComponentUpdate = (context: any, prevContext: any) => {
  if (!context) {
    return true;
  }
  const {date, updateSource, numberOfDays} = context;
  return (
    (date !== prevContext.date && updateSource !== UpdateSources.WEEK_SCROLL) ||
    numberOfDays !== prevContext.numberOfDays
  );
};

export const getDate = ({current, context, firstDay = 0}: WeekCalendarProps, weekIndex: number) => {
  const d = new XDate(current || context.date);
  const numberOfDays = context.numberOfDays;
  // get the first day of the week as date (for the on scroll mark)
  let dayOfTheWeek = d.getDay();
  if (dayOfTheWeek < firstDay && firstDay > 0) {
    dayOfTheWeek = 7 + dayOfTheWeek;
  }

  let newDate;
  if (numberOfDays > 1) {
    newDate = generateDay(toMarkingFormat(d), weekIndex * numberOfDays);
  } else {
    // leave the current date in the visible week as is
    const dd = weekIndex === 0 ? d : d.addDays(firstDay - dayOfTheWeek);
    newDate = dd.addWeeks(weekIndex);
  }
  return toMarkingFormat(newDate);
};

export const getDatesArray = (args: WeekCalendarProps) => {
  const array = [];
  for (let index = -NUMBER_OF_PAGES; index <= NUMBER_OF_PAGES; index++) {
    const d = getDate(args, index);
    array.push(d);
  }
  return array;
};

const getX = (x: number, itemsCount: number, containerWidth: number) => {
  if (APPLY_ANDROID_FIX) {
    const numberOfPages = itemsCount - 1;
    const overallWidth = numberOfPages * containerWidth;
    return overallWidth - x;
  }
  return x;
};

const APPLY_ANDROID_FIX = constants.isAndroid && constants.isRTL;
