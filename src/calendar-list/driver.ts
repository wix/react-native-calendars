import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react-native';
import {getMonthTitle} from '../testUtils';

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

  /** List */

  // fireOnViewableItemsChanged(changed: any[], visibleItems: any[]) {
  //   fireEvent(screen.getByTestId(this.testID), 'viewabilityConfigCallbackPairs.onViewableItemsChanged', {info: {changed: changed, viewableItems: visibleItems}});
  // }

  getListProps() {
    const props = screen.getByTestId(`${this.testID}.list`).props;
    return props;
  }

  getItemTestID(date: string) {
    const [year, month] = date.split('-');
    return `${this.testID}.item_${year}-${month}`;
  }

  getListItem(date: string) {
    return screen.getByTestId(this.getItemTestID(date));
  }

  getListItemTitle(date: string) {
    return within(this.getListItem(date)).getByText(getMonthTitle(date));
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
