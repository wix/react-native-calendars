import {useCallback, useRef, useState} from 'react';
import _ from 'lodash';
import XDate from 'xdate';
import {toMarkingFormat} from '../interface';

export const PAGES_COUNT = 9;
export const INITIAL_PAGE = Math.floor(PAGES_COUNT / 2);

const generateDay = (originDate: string, daysOffset: number) => {
  const baseDate = new XDate(originDate);
  return toMarkingFormat(baseDate.clone().addDays(daysOffset));
};

interface UseTimelinePagesProps {
  date: string;

  scrollToPage: (index: number) => void;
}

const UseTimelinePages = ({date, scrollToPage}: UseTimelinePagesProps) => {
  const ignoredInitialRender = useRef(false);
  const isLoadingPages = useRef(false);
  const pagesRef = useRef(_.times(PAGES_COUNT, i => generateDay(date, i - Math.floor(PAGES_COUNT / 2))));
  const [pages, setPages] = useState<string[]>(pagesRef.current);

  const resetPages = (date: string) => {
    pagesRef.current = _.times(PAGES_COUNT, i => generateDay(date, i - Math.floor(PAGES_COUNT / 2)));
    setPages(pagesRef.current);
    ignoredInitialRender.current = false;
    setTimeout(() => {
      scrollToPage(INITIAL_PAGE);
    }, 0);
  };

  const loadPages = useCallback(
    _.debounce(
      (currIndex: number) => {
        isLoadingPages.current = true;

        const numberOfPagesToAdd = Math.floor(PAGES_COUNT / 2);
        const movingForward = currIndex > numberOfPagesToAdd;

        let updatedPages;
        let newIndex = currIndex;
        if (movingForward) {
          const newPages = _.times(numberOfPagesToAdd, i => generateDay(_.last(pagesRef.current) as string, i + 1));
          updatedPages = [..._.slice(pagesRef.current, numberOfPagesToAdd, PAGES_COUNT), ...newPages];
          newIndex -= numberOfPagesToAdd;
        }

        if (!movingForward) {
          const newPages = _.times(numberOfPagesToAdd, i => generateDay(_.first(pagesRef.current) as string, -(i + 1)));
          updatedPages = [...newPages.reverse(), ..._.slice(pagesRef.current, 0, numberOfPagesToAdd + 1)];
          newIndex += numberOfPagesToAdd;
        }

        if (updatedPages) {
          pagesRef.current = updatedPages;
          setPages(updatedPages);

          setTimeout(() => {
            scrollToPage(newIndex);
            isLoadingPages.current = false;
          }, 0);
        }
      },
      500,
      {leading: false, trailing: true}
    ),
    []
  );

  return {
    resetPages: useCallback(resetPages, []),
    resetPagesDebounced: useCallback(_.debounce(resetPages, 500, {leading: false, trailing: true}), []),
    loadPages,
    ignoredInitialRender,
    pagesRef,
    pages
  };
};

export default UseTimelinePages;
