import React from 'react';
import { render } from '@testing-library/react-native';
import { ReactTestInstance } from 'react-test-renderer';
export declare class ExpandableCalendarDriver {
    testID: string;
    element: React.ReactElement;
    renderTree: ReturnType<typeof render>;
    constructor(testID: string, element: React.ReactElement);
    render(element?: React.ReactElement<any, string | React.JSXElementConstructor<any>>): ReturnType<typeof render>;
    /** Container */
    getExpandableContainer(): ReactTestInstance;
    isCalendarExpanded(): boolean;
    /** Header */
    getRightArrow(): ReactTestInstance;
    getLeftArrow(): ReactTestInstance;
    /** Knob and Position */
    get knobTestID(): string;
    getKnob(): ReactTestInstance | null;
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
    /** today button */
    getTodayButton(): ReactTestInstance | undefined;
    /** actions */
    pressOnTodayButton(): void;
    pressOnHeaderArrow({ left }?: {
        left?: boolean;
    }): void;
}
