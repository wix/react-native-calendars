import React from 'react';
import { render } from '@testing-library/react-native';
export declare class ExpandableCalendarDriver {
    testID: string;
    element: React.ReactElement;
    renderTree: ReturnType<typeof render>;
    constructor(testID: string, element: React.ReactElement);
    render(element?: React.ReactElement<any, string | React.JSXElementConstructor<any>>): ReturnType<typeof render>;
    /** Container */
    getExpandableContainer(): import("react-test-renderer").ReactTestInstance;
    isCalendarExpanded(): boolean;
    /** Header */
    getRightArrow(): import("react-test-renderer").ReactTestInstance;
    getLeftArrow(): import("react-test-renderer").ReactTestInstance;
    /** Knob and Position */
    get knobTestID(): string;
    getKnob(): import("react-test-renderer").ReactTestInstance | null;
    toggleKnob(): void;
    /** CalendarList */
    getCalendarList(): import("react-test-renderer").ReactTestInstance;
    getDayTestID(date: string): string;
    getDay(date: string): import("react-test-renderer").ReactTestInstance;
    selectDay(date: string): void;
    /** WeekCalendar */
    getWeekCalendar(): import("react-test-renderer").ReactTestInstance;
    getWeekDayTestID(date: string): string;
    getWeekDay(date: string): import("react-test-renderer").ReactTestInstance;
    selectWeekDay(date: string): void;
    /** today button */
    getTodayButton(): import("react-test-renderer").ReactTestInstance | undefined;
    /** actions */
    pressOnTodayButton(): void;
    pressOnHeaderArrow({ left }?: {
        left?: boolean;
    }): void;
}
