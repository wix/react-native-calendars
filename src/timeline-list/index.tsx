import React, {useCallback, useContext, useEffect, useRef} from 'react';
import {FlatList, Text, ViewToken} from 'react-native';
import _ from 'lodash';

import Context from '../expandableCalendar/Context';
import {screenWidth, UpdateSources} from '../expandableCalendar/commons';
import Timeline, {TimelineProps} from '../timeline/Timeline';
import useTimelinePages, {PAGES_COUNT} from './useTimelinePages';

const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 85
};

const getItemLayout = (_data: any, index: number) => ({length: screenWidth, offset: screenWidth * index, index});

export interface TimelineListProps {
  events: {[date: string]: TimelineProps['events']};
  timelineProps: Omit<TimelineProps, 'events'>;
}

const TimelineList = (props: TimelineListProps) => {
  const {timelineProps, events} = props;
  const {date, updateSource, setDate} = useContext(Context);
  const prevDate = useRef(date);
  const listRef = useRef<FlatList>();
  const scrollToPage = useCallback((pageIndex: number) => {
    listRef.current?.scrollToIndex({index: pageIndex, animated: false});
  }, []);

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

  const onViewableItemsChanged = useCallback((info: {viewableItems: Array<ViewToken>; changed: Array<ViewToken>}) => {
    const {viewableItems} = info;
    // NOTE: Because initialScrollIndex trigger a redundant scroll on start
    if (!ignoredInitialRender.current) {
      ignoredInitialRender.current = true;
      return;
    }

    const visibleItem = _.last(viewableItems);

    if (visibleItem?.index || visibleItem?.index === 0) {
      const movedSingleDay = Math.abs(currPage.current - visibleItem.index) === 1;
      if (!movedSingleDay) {
        return;
      }

      setDate(visibleItem.item, UpdateSources.LIST_DRAG);
      currPage.current = visibleItem.index;
    }
  }, []);

  const renderPage = useCallback(
    ({item}) => {
      const timelineEvent = events[item];

      return (
        <>
          <Timeline {...timelineProps} key={item} date={item} events={timelineEvent} />
          <Text style={{position: 'absolute'}}>{item}</Text>
        </>
      );
    },
    [events]
  );

  return (
    <FlatList
      // @ts-expect-error
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
