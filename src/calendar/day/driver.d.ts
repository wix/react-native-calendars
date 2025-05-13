/// <reference types="react" />
import { render } from '@testing-library/react-native';
export declare class DayDriver {
    testID: string;
    element: React.ReactElement;
    renderTree: ReturnType<typeof render>;
    constructor(element: any, testID: any);
    getStyle(): any;
    getDayText(): string;
    getTextStyle(): any;
    getAccessibilityLabel(): any;
    tap(): void;
}
