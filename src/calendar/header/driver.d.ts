/// <reference types="react" />
import { render } from '@testing-library/react-native';
export declare class CalendarHeaderDriver {
    testID: string;
    element: React.ReactElement;
    renderTree: ReturnType<typeof render>;
    constructor(element: any, testID: any);
    isTextExists(text: any): boolean;
    getTitle(): any;
    getDayNames(): string[];
    getLoadingIndicator(): any;
    getLeftArrow(): any;
    getRightArrow(): any;
    tapLeftArrow(): void;
    tapRightArrow(): void;
}
