import React from 'react';
import { render } from '@testing-library/react-native';
export declare class CalendarListDriver {
    testID: string;
    element: React.ReactElement;
    constructor(testID: string, element: React.ReactElement);
    render(element?: React.ReactElement<any, string | React.JSXElementConstructor<any>>): ReturnType<typeof render>;
    /** List */
    getListProps(): {
        [propName: string]: any;
    };
    getItemTestID(date: string): string;
    getListItem(date: string): import("react-test-renderer").ReactTestInstance;
    getListItemTitle(date: string): import("react-test-renderer").ReactTestInstance;
    /** Static header */
    get staticHeaderTestID(): string;
    getStaticHeader(): import("react-test-renderer").ReactTestInstance;
    getStaticHeaderTitle(): string | import("react-test-renderer").ReactTestInstance;
    getStaticHeaderLeftArrow(): import("react-test-renderer").ReactTestInstance;
    getStaticHeaderRightArrow(): import("react-test-renderer").ReactTestInstance;
    pressLeftArrow(): void;
    pressRightArrow(): void;
    /** Day press */
    getDayTestID(date: string): string;
    getDay(date: string): import("react-test-renderer").ReactTestInstance;
    selectDay(date: string): void;
}
