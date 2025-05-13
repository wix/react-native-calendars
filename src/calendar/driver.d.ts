/// <reference types="react" />
import { render } from '@testing-library/react-native';
import { DayDriver } from './day/driver';
import { CalendarHeaderDriver } from './header/driver';
export declare class CalendarDriver {
    testID: string;
    element: React.ReactElement;
    renderTree: ReturnType<typeof render>;
    constructor(element: any);
    /** Days */
    getDay(date: string): DayDriver;
    getTextValues(elements: any): any;
    getDays(): any;
    getWeekNumbers(): any;
    /** Header */
    getHeader(): CalendarHeaderDriver;
    /** GestureRecognizer */
    queryElement(testID: string): import("react-test-renderer").ReactTestInstance;
    isRootGestureRecognizer(): boolean;
    swipe(direction: any): void;
    swipeLeft(): void;
    swipeRight(): void;
}
