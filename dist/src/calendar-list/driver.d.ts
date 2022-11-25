import React from 'react';
import { render } from '@testing-library/react-native';
export declare class CalendarListDriver {
    testID: string;
    element: React.ReactElement;
    constructor(testID: string, element: React.ReactElement);
    render(element?: React.ReactElement<any, string | React.JSXElementConstructor<any>>): ReturnType<typeof render>;
    /** List */
    getListProps(): any;
    getItemTestID(date: string): string;
    getListItem(date: string): ReactTestInstance;
    getListItemTitle(date: string): ReactTestInstance;
    /** Static header */
    get staticHeaderTestID(): string;
    getStaticHeader(): ReactTestInstance;
    getStaticHeaderTitle(): any;
    getStaticHeaderLeftArrow(): ReactTestInstance;
    getStaticHeaderRightArrow(): ReactTestInstance;
    pressLeftArrow(): void;
    pressRightArrow(): void;
    /** Day press */
    getDayTestID(date: string): string;
    getDay(date: string): ReactTestInstance;
    selectDay(date: string): void;
}
