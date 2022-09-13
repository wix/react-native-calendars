import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react-native';

export class CalendarListDriver {
  testID: string;
  element: React.ReactElement;

  constructor(testID: string, element: React.ReactElement) {
    this.testID = testID;
    this.element = element;
    this.render(element);
  }

  render(element = this.element): ReturnType<typeof render> {
    if (!element) throw 'Element is missing';
    return render(element);
  }

  /** List item */

  getItemTestID(date: string) {
    const [year, month] = date.split('-');
    return `${this.testID}.item_${year}-${month}`;
  }

  getCalendarListItem(date: string) {
    return screen.getByTestId(this.getItemTestID(date));
  }

  getCalendarItemTitle(date: string, title: string) {
    return within(this.getCalendarListItem(date)).getByText(title);
  }

  /** Static header */

  get staticHeaderTestID() {
    return `${this.testID}.staticHeader`;
  }

  getStaticHeader() {
    return screen.getByTestId(this.staticHeaderTestID);
  }

  getStaticHeaderTitle() {
    return screen.getByTestId(`${this.staticHeaderTestID}.title`).children[0];
  }

  getStaticHeaderLeftArrow() {
    return screen.getByTestId(`${this.staticHeaderTestID}.leftArrow`);
  }

  getStaticHeaderRightArrow() {
    return screen.getByTestId(`${this.staticHeaderTestID}.rightArrow`);
  }

  pressLeftArrow() {
    fireEvent(this.getStaticHeaderLeftArrow(), 'onPress');
  }

  pressRightArrow() {
    fireEvent(this.getStaticHeaderRightArrow(), 'onPress');
  }

  /** Day press */

  getDayTestID(date: string) {
    const [year, month] = date.split('-');
    return `${this.testID}.item_${year}-${month}.day_${date}`;
  }

  getDay(date: string) {
    return screen.getByTestId(this.getDayTestID(date));
  }

  selectDay(date: string) {
    fireEvent(this.getDay(date), 'onPress');
  }
}
