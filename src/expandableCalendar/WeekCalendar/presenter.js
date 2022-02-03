<<<<<<< HEAD:src/expandableCalendar/WeekCalendar/presenter.js
import _ from 'lodash';
import React from 'react';
import {sameWeek} from '../../dateutils';
const commons = require('../commons');
import XDate from 'xdate';
=======
import XDate from 'xdate';

import React from 'react';
import {FlatList} from 'react-native';

>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/WeekCalendar/presenter.ts
import {toMarkingFormat} from '../../interface';

const UPDATE_SOURCES = commons.UPDATE_SOURCES;
// must be a positive number
const NUMBER_OF_PAGES = 2;

class Presenter {
  constructor() {
    this.list = React.createRef();
    this._applyAndroidRtlFix = commons.isAndroid && commons.isRTL;
    // On Android+RTL there's an initial scroll that cause issues
    this._firstAndroidRTLScrollIgnored = !this._applyAndroidRtlFix;
  }

<<<<<<< HEAD:src/expandableCalendar/WeekCalendar/presenter.js
  scrollToIndex = animated => {
    this.list.current.scrollToIndex({animated, index: NUMBER_OF_PAGES});
  };

  isSameWeek = (date, prevDate, firstDay) => {
    return sameWeek(date, prevDate, firstDay);
  };

  // Events

  onDayPressed = (context, value) => {
    _.invoke(context, 'setDate', value.dateString, UPDATE_SOURCES.DAY_PRESS);
=======
  private _applyAndroidRtlFix = commons.isAndroid && commons.isRTL;
  // On Android+RTL there's an initial scroll that cause issues
  private _firstAndroidRTLScrollIgnored = !this._applyAndroidRtlFix;
  public list: React.RefObject<FlatList> = React.createRef();

  scrollToIndex = (animated: boolean) => {
    this.list?.current?.scrollToIndex({animated, index: NUMBER_OF_PAGES});
  };

  // Events
  onDayPress = (context: any, value: DateData) => {
    context.setDate?.(value.dateString, updateSources.DAY_PRESS);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/WeekCalendar/presenter.ts
  };

  onScroll = ({context, updateState, x, page, items, width}) => {
    if (!this._firstAndroidRTLScrollIgnored) {
      this._firstAndroidRTLScrollIgnored = true;
      return;
    }

    x = this._getX(x, items?.length, width);
    const newPage = this._getNewPage(x, width);

<<<<<<< HEAD:src/expandableCalendar/WeekCalendar/presenter.js
    if (this._shouldUpdateState(page)) {
      _.invoke(context, 'setDate', items[newPage], UPDATE_SOURCES.WEEK_SCROLL);
      const data = this._getItemsForPage(page, items);
=======
    if (this._shouldUpdateState(page, newPage)) {
      context.setDate?.(items[newPage], updateSources.WEEK_SCROLL);
      const data = this._getItemsForPage(newPage, items);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/WeekCalendar/presenter.ts
      updateState(data, newPage);
    }
  };

  onMomentumScrollEnd = ({items, props, page, updateItems}) => {
    if (this._isFirstPage(page) || this._isLastPage(page, items)) {
      this.scrollToIndex(false);

      const newWeekArray = this.getDatesArray(props);
      let updatedItems;
      if (this._isLastPage(page, items)) {
        updatedItems = this._mergeArraysFromEnd(items, newWeekArray);
      } else {
        updatedItems = this._mergeArraysFromTop(items, newWeekArray);
      }

      updateItems(updatedItems);
    }
  };

  shouldComponentUpdate = (context, prevContext) => {
    const {date, updateSource} = context;
    return (
      date !== prevContext.date &&
      updateSource !== UPDATE_SOURCES.WEEK_SCROLL
    );
  };

  getDate({current, context, firstDay}, weekIndex) {
    const d = XDate(current || context.date);
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

  getDatesArray = args => {
    const array = [];
    for (let index = -NUMBER_OF_PAGES; index <= NUMBER_OF_PAGES; index++) {
      const d = this.getDate(args, index);
      array.push(d);
    }
    return array;
  };

  _shouldUpdateState = (page, newPage) => {
    return page !== newPage;
  };

  _getX = (x, itemsCount, containerWidth) => {
    if (this._applyAndroidRtlFix) {
      const numberOfPages = itemsCount - 1;
      const overallWidth = numberOfPages * containerWidth;
      return overallWidth - x;
    }
    return x;
  };

  _getNewPage = (x, containerWidth) => {
    return Math.round(x / containerWidth);
  };

  _isFirstPage = page => {
    return page === 0;
  };

<<<<<<< HEAD:src/expandableCalendar/WeekCalendar/presenter.js
  _isLastPage = (page, items) => {
    return page === items.length - 1;
  };

  _getNexPageItems = items => {
=======
  _isLastPage = (page: number, items: string[]) => {
    return page === items.length - 1;
  };

  _getNextPageItems = (items: string[]) => {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/WeekCalendar/presenter.ts
    return items.map((_, i) => {
      const index = i <= NUMBER_OF_PAGES ? i + NUMBER_OF_PAGES : i;
      return items[index];
    });
  };

<<<<<<< HEAD:src/expandableCalendar/WeekCalendar/presenter.js
  _getFirstPageItems = items => {
=======
  _getFirstPageItems = (items: string[]) => {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/WeekCalendar/presenter.ts
    return items.map((_, i) => {
      const index = i >= NUMBER_OF_PAGES ? i - NUMBER_OF_PAGES : i;
      return items[index];
    });
  };

<<<<<<< HEAD:src/expandableCalendar/WeekCalendar/presenter.js
  _mergeArraysFromEnd = (items, newArray) => {
=======
  _mergeArraysFromEnd = (items: string[], newArray: string[]) => {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/WeekCalendar/presenter.ts
    for (let i = NUMBER_OF_PAGES + 1; i < items.length; i++) {
      items[i] = newArray[i];
    }
    return items;
  };

<<<<<<< HEAD:src/expandableCalendar/WeekCalendar/presenter.js
  _mergeArraysFromTop = (items, newArray) => {
=======
  _mergeArraysFromTop = (items: string[], newArray: string[]) => {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/WeekCalendar/presenter.ts
    for (let i = 0; i < NUMBER_OF_PAGES; i++) {
      items[i] = newArray[i];
    }
    return items;
  };

<<<<<<< HEAD:src/expandableCalendar/WeekCalendar/presenter.js
  _getItemsForPage = (page, items) => {
=======
  _getItemsForPage = (page: number, items: string[]) => {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/WeekCalendar/presenter.ts
    if (this._isLastPage(page, items)) {
      return this._getNextPageItems(items);
    } else if (this._isFirstPage(page)) {
      return this._getFirstPageItems(items);
    }
    return items;
  };
}

export default Presenter;
