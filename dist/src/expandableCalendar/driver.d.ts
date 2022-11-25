import React from 'react';
import { render } from '@testing-library/react-native';
export declare class ExpandableCalendarDriver {
    testID: string;
    element: React.ReactElement;
    renderTree: ReturnType<typeof render>;
    constructor(testID: string, element: React.ReactElement);
    render(element?: React.ReactElement<any, string | React.JSXElementConstructor<any>>): ReturnType<typeof render>;
    /** Container */
    getExpandableContainer(): ReactTestInstance;
    isCalendarExpanded(): boolean;
    /** Knob and Position */
    get knobTestID(): string;
    getKnob(): any;
    toggleKnob(): void;
    /** CalendarList */
    getCalendarList(): ReactTestInstance;
    getDayTestID(date: string): string;
    getDay(date: string): ReactTestInstance;
    selectDay(date: string): void;
    /** WeekCalendar */
    getWeekCalendar(): ReactTestInstance;
    getWeekDayTestID(date: string): string;
    getWeekDay(date: string): ReactTestInstance;
    selectWeekDay(date: string): void;
}
