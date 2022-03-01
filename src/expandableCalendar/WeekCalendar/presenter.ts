import XDate from 'xdate';

import React from 'react';
import {FlatList} from 'react-native';

import {toMarkingFormat} from '../../interface';
import {DateData} from '../../types';
import {WeekCalendarProps} from './index';
import constants from '../../commons/constants';

const commons = require('../commons');
const updateSources = commons.UpdateSources;
// must be a positive number
const NUMBER_OF_PAGES = 2;

class Presenter {

  private _applyAndroidRtlFix = constants.isAndroid && constants.isRTL;
  // On Android+RTL there's an initial scroll that cause issues
  private _firstAndroidRTLScrollIgnored = !this._applyAndroidRtlFix;
  public list: React.RefObject<FlatList> = React.createRef();

  scrollToIndex = (animated: boolean) => {
    this.list?.current?.scrollToIndex({animated, index: NUMBER_OF_PAGES});
  };

  // Events
  onDayPress = (context: any, value: DateData) => {
    context.setDate?.(value.dateString, updateSources.DAY_PRESS);
  };

  onScroll = ({context, updateState, x, page, items, width}: any) => {
    if (!this._firstAndroidRTLScrollIgnored) {
      this._firstAndroidRTLScrollIgnored = true;
      return;
    }

    x = this._getX(x, items?.length, width);
    const newPage = this._getNewPage(x, width);

    if (this._shouldUpdateState(page, newPage)) {
      context.setDate?.(items[newPage], updateSources.WEEK_SCROLL);
      const data = this._getItemsForPage(newPage, items);
      updateState(data, newPage);
    }
  };

  onMomentumScrollEnd = ({items, props, page, updateItems}: any) => {
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

  shouldComponentUpdate = (context: any, prevContext: any) => {
    const {date, updateSource} = context;
    return (
      date !== prevContext.date &&
      updateSource !== updateSources.WEEK_SCROLL
    );
  };

  getDate({current, context, firstDay = 0}: WeekCalendarProps, weekIndex: number) {
    const d = new XDate(current || context.date);
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

  getDatesArray = (args: WeekCalendarProps) => {
    const array = [];
    for (let index = -NUMBER_OF_PAGES; index <= NUMBER_OF_PAGES; index++) {
      const d = this.getDate(args, index);
      array.push(d);
    }
    return array;
  };

  _shouldUpdateState = (page: number, newPage: number) => {
    return page !== newPage;
  };

  _getX = (x: number, itemsCount: number, containerWidth: number) => {
    if (this._applyAndroidRtlFix) {
      const numberOfPages = itemsCount - 1;
      const overallWidth = numberOfPages * containerWidth;
      return overallWidth - x;
    }
    return x;
  };

  _getNewPage = (x: number, containerWidth: number) => {
    return Math.round(x / containerWidth);
  };

  _isFirstPage = (page: number) => {
    return page === 0;
  };

  _isLastPage = (page: number, items: string[]) => {
    return page === items.length - 1;
  };

  _getNextPageItems = (items: string[]) => {
    return items.map((_, i) => {
      const index = i <= NUMBER_OF_PAGES ? i + NUMBER_OF_PAGES : i;
      return items[index];
    });
  };

  _getFirstPageItems = (items: string[]) => {
    return items.map((_, i) => {
      const index = i >= NUMBER_OF_PAGES ? i - NUMBER_OF_PAGES : i;
      return items[index];
    });
  };

  _mergeArraysFromEnd = (items: string[], newArray: string[]) => {
    for (let i = NUMBER_OF_PAGES + 1; i < items.length; i++) {
      items[i] = newArray[i];
    }
    return items;
  };

  _mergeArraysFromTop = (items: string[], newArray: string[]) => {
    for (let i = 0; i < NUMBER_OF_PAGES; i++) {
      items[i] = newArray[i];
    }
    return items;
  };

  _getItemsForPage = (page: number, items: string[]) => {
    if (this._isLastPage(page, items)) {
      return this._getNextPageItems(items);
    } else if (this._isFirstPage(page)) {
      return this._getFirstPageItems(items);
    }
    return items;
  };
}

export default Presenter;
