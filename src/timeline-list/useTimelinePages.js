import { useCallback, useEffect, useRef, useState } from 'react';
import inRange from 'lodash/inRange';
import times from 'lodash/times';
import debounce from 'lodash/debounce';
import constants from '../commons/constants';
import { generateDay } from '../dateutils';
export const PAGES_COUNT = 100;
export const NEAR_EDGE_THRESHOLD = 10;
export const INITIAL_PAGE = Math.floor(PAGES_COUNT / 2);
const UseTimelinePages = ({ date, listRef, numberOfDays, shouldFixRTL }) => {
    const pagesRef = useRef(times(PAGES_COUNT, i => {
        return generateDay(date, numberOfDays * (i - Math.floor(PAGES_COUNT / 2)));
    }));
    const [pages, setPages] = useState(pagesRef.current);
    const shouldResetPages = useRef(false);
    useEffect(() => {
        const updatedDays = times(PAGES_COUNT, i => {
            return generateDay(date, numberOfDays * (i - Math.floor(PAGES_COUNT / 2)));
        });
        pagesRef.current = updatedDays;
        setPages(updatedDays);
    }, [numberOfDays]);
    const isOutOfRange = useCallback((index) => {
        return !inRange(index, 0, PAGES_COUNT);
    }, []);
    const isNearEdges = useCallback(index => {
        return !inRange(index, NEAR_EDGE_THRESHOLD, PAGES_COUNT - NEAR_EDGE_THRESHOLD);
    }, []);
    const isOnEdgePages = useCallback(index => {
        return !inRange(index, 1, PAGES_COUNT - 1);
    }, []);
    const scrollToPage = (pageIndex) => {
        listRef.current?.scrollToOffset(shouldFixRTL ? ((PAGES_COUNT - 1 - pageIndex) * constants.screenWidth) : (pageIndex * constants.screenWidth), 0, false);
    };
    const resetPages = (date) => {
        pagesRef.current = times(PAGES_COUNT, i => {
            return generateDay(date, numberOfDays * (i - Math.floor(PAGES_COUNT / 2)));
        });
        setPages(pagesRef.current);
        setTimeout(() => {
            scrollToPage(INITIAL_PAGE);
            shouldResetPages.current = false;
        }, 0);
    };
    return {
        resetPages: useCallback(resetPages, []),
        resetPagesDebounce: useCallback(debounce(resetPages, 500, { leading: false, trailing: true }), []),
        scrollToPage: useCallback(scrollToPage, []),
        scrollToPageDebounce: useCallback(debounce(scrollToPage, 250, { leading: false, trailing: true }), []),
        pagesRef,
        pages,
        shouldResetPages,
        isOutOfRange,
        isNearEdges,
        isOnEdgePages
    };
};
export default UseTimelinePages;
