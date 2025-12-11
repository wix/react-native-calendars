import React from 'react';
import { render } from '@testing-library/react-native';
export declare class WeekCalendarDriver {
    testID: string;
    element: React.ReactElement;
    renderTree: ReturnType<typeof render>;
    constructor(testID: string, element: React.ReactElement);
    render(element?: React.ReactElement<any, string | React.JSXElementConstructor<any>>): ReturnType<typeof render>;
    getWeekCalendar(): import("react-test-renderer").ReactTestInstance;
    /** List */
    getListProps(): {
        [propName: string]: any;
    };
    getItemTestID(date: string): string;
    getListItem(date: string): import("react-test-renderer").ReactTestInstance;
    /** Day */
    getDayTestID(date: string): string;
    getDay(date: string): import("react-test-renderer").ReactTestInstance;
    selectDay(date: string): void;
}
