import React, {useCallback, useContext, useEffect, useRef} from 'react';
import {FlatList, Text} from 'react-native';
import _ from 'lodash';

import Context from '../expandableCalendar/Context';
import {screenWidth, UpdateSources} from '../expandableCalendar/commons';
import Timeline from '../timeline/Timeline';
import useTimelinePages, {PAGES_COUNT} from './useTimelinePages';

const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 85
};

const getItemLayout = (_data: any, index: number) => ({length: screenWidth, offset: screenWidth * index, index});

const TimelineList = () => {
  const {date, updateSource, setDate} = useContext(Context);
  const prevDate = useRef(date);
  const listRef = useRef<FlatList>();
  const scrollToPage = useCallback(
    _.debounce((pageIndex: number) => {
      listRef.current?.scrollToIndex({index: pageIndex, animated: false});
    }),
    []
  );

  const {currPage, pages, pagesRef, ignoredInitialRender, loadPages, resetPages, resetPagesDebounced} =
    useTimelinePages({
      date,
      scrollToPage
    });

  useEffect(() => {
    if (date !== prevDate.current) {
      const datePageIndex = pagesRef.current.indexOf(date);
      if (updateSource !== UpdateSources.LIST_DRAG) {
        if (datePageIndex >= 0) {
          scrollToPage(datePageIndex);
        } else {
          updateSource === UpdateSources.DAY_PRESS ? resetPages(date) : resetPagesDebounced(date);
        }
      } else {
        if (!_.inRange(datePageIndex, 2, PAGES_COUNT - 3)) {
          loadPages(datePageIndex);
        }
      }
      prevDate.current = date;
    }
  }, [date, updateSource]);

  const onViewableItemsChanged = useCallback(({viewableItems}: {viewableItems: {index: number; item: string}[]}) => {
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

      setDate(visibleItem.item, UpdateSources.LIST_DRAG);
      currPage.current = visibleItem.index;
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
