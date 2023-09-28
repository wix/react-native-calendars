import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';

export class WeekCalendarDriver {
  testID: string;
  element: React.ReactElement;
  renderTree: ReturnType<typeof render>;

  constructor(testID: string, element: React.ReactElement) {
    this.testID = testID;
    this.element = element;
    this.renderTree = this.render(element);
  }

  render(element = this.element): ReturnType<typeof render> {
    if (!element) throw 'Element is missing';
    this.renderTree = render(element);
    return this.renderTree;
  }

  getWeekCalendar() {
    return this.renderTree.getByTestId(`${this.testID}.weekCalendar.list`);
  }

  /** List */

  getListProps() {
    const props = screen.getByTestId(`${this.testID}.list`).props;
    return props;
  }

  getItemTestID(date: string) {
    return `${this.testID}.week_${date}`;
  }

  getListItem(date: string) {
    return screen.getByTestId(this.getItemTestID(date));
  }

  /** Day */

  getDayTestID(date: string) {
    return `${this.testID}.day_${date}`;
  }

  getDay(date: string) {
    return this.renderTree?.getByTestId(this.getDayTestID(date));
  }

  selectDay(date: string) {
    fireEvent(this.getDay(date), 'onPress');
  }
}
