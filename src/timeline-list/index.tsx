import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {FlatList, Text} from 'react-native';
import _ from 'lodash';
import XDate from 'xdate';

import {toMarkingFormat} from '../interface';
import Context from '../expandableCalendar/Context';
import {screenWidth, UpdateSources} from '../expandableCalendar/commons';
import Timeline from '../timeline/Timeline';

const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 85
};
const PAGES_COUNT = 9;

const getItemLayout = (_data: any, index: number) => ({length: screenWidth, offset: screenWidth * index, index});

interface TimelineListProps {}

const TimelineList = (props: TimelineListProps) => {
  const {date, setDate} = useContext(Context);

  const generateDay = useCallback(
    (originDate, daysOffset) => {
      const baseDate = new XDate(originDate);
      return toMarkingFormat(baseDate.clone().addDays(daysOffset));
    },
    [date]
  );

  const [pages, setPages] = useState<string[]>(
    _.times(PAGES_COUNT, i => generateDay(date, i - Math.floor(PAGES_COUNT / 2)))
  );
  const pagesRef = useRef(pages);

  const listRef = useRef<FlatList>();
  const currPage = useRef(Math.floor(PAGES_COUNT / 2));
  const isLoadingPages = useRef(false);
  const ignoredInitialRender = useRef(false);

  // useEffect(() => {
  //   console.log('ethan - pages changed', pages);
  //   try {
  //     console.log('ethan - scrolling to index', currPage.current);
  //     listRef.current?.scrollToIndex({index: currPage.current, animated: false});
  //     isLoadingPages.current = false;
  //   } catch (error) {
  //     console.log('ethan - error, current page ', currPage.current);
  //   }
  // }, [pages]);

  const loadPages = useCallback(
    _.debounce(
      (currIndex: number) => {
        isLoadingPages.current = true;

        const numberOfPagesToAdd = Math.floor(PAGES_COUNT / 2);
        const movingForward = currIndex > numberOfPagesToAdd;

        let updatedPages;
        if (movingForward) {
          const newPages = _.times(numberOfPagesToAdd, i => generateDay(_.last(pagesRef.current), i + 1));
          updatedPages = [..._.slice(pagesRef.current, numberOfPagesToAdd, PAGES_COUNT), ...newPages];
          currPage.current -= numberOfPagesToAdd;
        }

        if (!movingForward) {
          const newPages = _.times(numberOfPagesToAdd, i => generateDay(_.first(pagesRef.current), -(i + 1)));

          updatedPages = [...newPages.reverse(), ..._.slice(pagesRef.current, 0, numberOfPagesToAdd + 1)];
          currPage.current += numberOfPagesToAdd;
        }

        if (updatedPages) {
          pagesRef.current = updatedPages;
          setPages(updatedPages);

          setTimeout(() => {
            listRef.current?.scrollToIndex({index: currPage.current, animated: false});
            isLoadingPages.current = false;
          }, 0);
        }
      },
      500,
      {leading: false, trailing: true}
    ),
    []
  );

  const onViewableItemsChanged = useCallback(({viewableItems}: {viewableItems: {index: number}[]}) => {
    // NOTE: Because initialScrollIndex trigger a redundant scroll on start
    if (!ignoredInitialRender.current) {
      ignoredInitialRender.current = true;
      return;
    }

    const visibleItem = _.last(viewableItems);
    if (visibleItem?.index !== undefined) {
      const movedSingleDay = Math.abs(currPage.current - visibleItem.index) === 1;
      
      if (!movedSingleDay) {
        return;
      }

      setDate(pagesRef.current[visibleItem.index], UpdateSources.PAGE_SCROLL);
      currPage.current = visibleItem.index;

      if (!isLoadingPages.current) {
        if (!_.inRange(visibleItem.index, 0.25 * PAGES_COUNT, 0.75 * PAGES_COUNT)) {
          loadPages(visibleItem.index);
        }
      }
    }
  }, []);

  const renderPage = useCallback(({item}) => {
    return (
      <>
        <Timeline key={item} date={item} events={[]} />
        <Text style={{position: 'absolute'}}>{item}</Text>
      </>
    );
  }, []);

  return (
    <FlatList
      ref={listRef}
      keyExtractor={item => item}
      horizontal
      data={pages}
      renderItem={renderPage}
      pagingEnabled
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={VIEWABILITY_CONFIG}
      getItemLayout={getItemLayout}
      initialScrollIndex={currPage.current}
      removeClippedSubviews
      scrollEventThrottle={16}
    />
  );
};

export default TimelineList;
