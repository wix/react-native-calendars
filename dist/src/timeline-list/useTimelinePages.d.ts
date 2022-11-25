/// <reference types="lodash" />
import { RefObject } from 'react';
export declare const PAGES_COUNT = 100;
export declare const NEAR_EDGE_THRESHOLD = 10;
export declare const INITIAL_PAGE: number;
interface UseTimelinePagesProps {
    date: string;
    listRef: RefObject<any>;
    numberOfDays: number;
}
declare const UseTimelinePages: ({ date, listRef, numberOfDays }: UseTimelinePagesProps) => {
    resetPages: (date: string) => void;
    resetPagesDebounce: import("lodash").DebouncedFunc<(date: string) => void>;
    scrollToPage: (pageIndex: number) => void;
    scrollToPageDebounce: import("lodash").DebouncedFunc<(pageIndex: number) => void>;
    pagesRef: import("react").MutableRefObject<any[]>;
    pages: string[];
    shouldResetPages: import("react").MutableRefObject<boolean>;
    isOutOfRange: (index: number) => boolean;
    isNearEdges: (index: any) => boolean;
    isOnEdgePages: (index: any) => boolean;
};
export default UseTimelinePages;
