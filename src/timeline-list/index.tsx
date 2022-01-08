import React, {useCallback, useContext, useEffect, useRef} from 'react';
import {Text} from 'react-native';
import identity from 'lodash/identity';
import throttle from 'lodash/throttle';

import Context from '../expandableCalendar/Context';
import {UpdateSources} from '../expandableCalendar/commons';
import Timeline, {TimelineProps} from '../timeline/Timeline';
import HorizontalList from './HorizontalList';
import useTimelinePages, {INITIAL_PAGE} from './useTimelinePages';

export interface TimelineListProps {
  events: {[date: string]: TimelineProps['events']};
  timelineProps: Omit<TimelineProps, 'events'>;
}

const TimelineList = (props: TimelineListProps) => {
  const {timelineProps, events} = props;
  const {date, updateSource, setDate} = useContext(Context);
  const prevDate = useRef(date);
  const listRef = useRef<any>();

  const {
    pages,
    pagesRef,
    resetPages,
    resetPagesDebounced,
    scrollToPageDebounced,
    shouldResetPages,
    isOutOfRange,
    isNearEdges
  } = useTimelinePages({date, listRef});

  useEffect(() => {
    if (date !== prevDate.current) {
      const datePageIndex = pagesRef.current.indexOf(date);

      if (updateSource !== UpdateSources.LIST_DRAG) {
        if (isOutOfRange(datePageIndex)) {
          updateSource === UpdateSources.DAY_PRESS ? resetPages(date) : resetPagesDebounced(date);
        } else {
          scrollToPageDebounced(datePageIndex);
        }
      }

      prevDate.current = date;
    }
  }, [date, updateSource]);

  const onScroll = useCallback(() => {
    if (shouldResetPages.current) {
      resetPagesDebounced.cancel();
    }
  }, []);

  const onMomentumScrollEnd = useCallback(() => {
    if (shouldResetPages.current) {
      resetPagesDebounced(prevDate.current);
    }
  }, []);

  const onPageChange = useCallback(
    throttle((pageIndex: number) => {
      const newDate = pagesRef.current[pageIndex];
      if (newDate !== prevDate.current) {
        setDate(newDate, UpdateSources.LIST_DRAG);

        if (isNearEdges(pageIndex)) {
          shouldResetPages.current = isNearEdges(pageIndex);
        }
      }
    }, 0),
    []
  );

  const renderPage = useCallback(
    (_type, item) => {
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
    <HorizontalList
      ref={listRef}
      data={pages}
      renderItem={renderPage}
      onPageChange={onPageChange}
      onScroll={onScroll}
      extendedState={{todayEvents: events[date], pages}}
      initialPageIndex={INITIAL_PAGE}
      scrollViewProps={{
        keyExtractor: identity,
        onMomentumScrollEnd
      }}
    />
  );

  // return (
  //   <HorizontalList
  //     ref={listRef}
  //     keyExtractor={identity}
  //     horizontal
  //     data={pages}
  //     renderItem={renderPage}
  //     pagingEnabled
  //     onPageChange={onPageChange}
  //     onScroll={loadPagesDebounced.cancel}
  //     // onViewableItemsChanged={onViewableItemsChanged}
  //     // viewabilityConfig={VIEWABILITY_CONFIG}
  //     getItemLayout={getItemLayout}
  //     initialScrollIndex={INITIAL_PAGE}
  //     removeClippedSubviews
  //     scrollEventThrottle={16}
  //     bounces={false}
  //   />
  // );
};

export default TimelineList;
