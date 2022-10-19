import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';

export class ExpandableCalendarDriver {
  testID: string;
  element: React.ReactElement;
  renderTree: ReturnType<typeof render>;

  constructor(testID: string, element: React.ReactElement) {
    this.testID = testID;
    this.element = element;
    this.renderTree = this.render(element);
  }

  get knobTestID() {
    return `${this.testID}.knob`;
  }

  getDayTestID(date: string) {
    const [year, month] = date.split('-');
    return `${this.testID}.calendarList.item_${year}-${month}.day_${date}`;
  }

  render(element = this.element): ReturnType<typeof render> {
    if (!element) throw 'Element is missing';
    this.renderTree = render(element);
    return this.renderTree;
  }

  getKnob() {
    return this.renderTree?.getByTestId(`${this.testID}.knob`);
  }

  getExpandableContainer() {
    return this.renderTree.getByTestId(`${this.testID}.expandableContainer`);
  }

  getDay(date: string) {
    return this.renderTree?.getByTestId(this.getDayTestID(date));
  }

  toggleKnob() {
    fireEvent(this.getKnob(), 'onPress');
  }

  isCalendarExpanded() {
    const calendarHeight = this.getExpandableContainer().props?.style?.height;
    return calendarHeight > 145;
  }

  selectDay(date: string) {
    fireEvent(this.getDay(date), 'onPress');
  }
}
