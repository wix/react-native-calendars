import {RefObject, useCallback, useRef, useState} from 'react';

import inRange from 'lodash/inRange';
import times from 'lodash/times';
import debounce from 'lodash/debounce';

import constants from '../commons/constants';
import {generateDay} from '../dateutils';

const PAGES_COUNT = 100;
export const NEAR_EDGE_THRESHOLD = 10;
export const INITIAL_PAGE = Math.floor(PAGES_COUNT / 2);


interface UseTimelinePagesProps {
  date: string;
  listRef: RefObject<any>;
}

const UseTimelinePages = ({date, listRef}: UseTimelinePagesProps) => {
  const pagesRef = useRef(times(PAGES_COUNT, i => generateDay(date, i - Math.floor(PAGES_COUNT / 2))));
  const [pages, setPages] = useState<string[]>(pagesRef.current);
  const shouldResetPages = useRef(false);

  const isOutOfRange = useCallback((index: number) => {
    return !inRange(index, 0, PAGES_COUNT);
  }, []);

  const isNearEdges = useCallback(index => {
    return !inRange(index, NEAR_EDGE_THRESHOLD, PAGES_COUNT - NEAR_EDGE_THRESHOLD);
  }, []);

  const isOnEdgePages = useCallback(index => {
    return !inRange(index, 1, PAGES_COUNT - 1);
  }, []);

  const scrollToPage = (pageIndex: number) => {
    listRef.current?.scrollToOffset(pageIndex * constants.screenWidth, 0, false);
  };

  const resetPages = (date: string) => {
    pagesRef.current = times(PAGES_COUNT, i => generateDay(date, i - Math.floor(PAGES_COUNT / 2)));
    setPages(pagesRef.current);

    setTimeout(() => {
      scrollToPage(INITIAL_PAGE);
      shouldResetPages.current = false;
    }, 0);
  };

  return {
    resetPages: useCallback(resetPages, []),
    resetPagesDebounce: useCallback(debounce(resetPages, 500, {leading: false, trailing: true}), []),
    scrollToPage: useCallback(scrollToPage, []),
    scrollToPageDebounce: useCallback(debounce(scrollToPage, 250, {leading: false, trailing: true}), []),
    pagesRef,
    pages,
    shouldResetPages,
    isOutOfRange,
    isNearEdges,
    isOnEdgePages
  };
};

export default UseTimelinePages;
