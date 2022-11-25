import min from 'lodash/min';
import map from 'lodash/map';
import times from 'lodash/times';
import groupBy from 'lodash/groupBy';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import constants from '../commons/constants';
import { generateDay } from '../dateutils';
import { getCalendarDateString } from '../services';
import styleConstructor from './style';
import { populateEvents, HOUR_BLOCK_HEIGHT } from './Packer';
import { calcTimeOffset } from './helpers/presenter';
import TimelineHours from './TimelineHours';
import EventBlock from './EventBlock';
import NowIndicator from './NowIndicator';
import useTimelineOffset from './useTimelineOffset';
const Timeline = (props) => {
    const { format24h = true, start = 0, end = 24, date = '', events, onEventPress, onBackgroundLongPress, onBackgroundLongPressOut, renderEvent, theme, scrollToFirst, scrollToNow, initialTime, showNowIndicator, scrollOffset, onChangeOffset, overlapEventsSpacing = 0, rightEdgeSpacing = 0, unavailableHours, unavailableHoursColor, eventTapped, numberOfDays = 1, timelineLeftInset = 0 } = props;
    const pageDates = useMemo(() => {
        return typeof date === 'string' ? [date] : date;
    }, [date]);
    const groupedEvents = useMemo(() => {
        return groupBy(events, e => getCalendarDateString(e.start));
    }, [events]);
    const pageEvents = useMemo(() => {
        return map(pageDates, d => groupedEvents[d] || []);
    }, [pageDates, groupedEvents]);
    const scrollView = useRef();
    const calendarHeight = useRef((end - start) * HOUR_BLOCK_HEIGHT);
    const styles = useRef(styleConstructor(theme || props.styles, calendarHeight.current));
    const { scrollEvents } = useTimelineOffset({ onChangeOffset, scrollOffset, scrollViewRef: scrollView });
    const width = useMemo(() => {
        return constants.screenWidth - timelineLeftInset;
    }, [timelineLeftInset]);
    const packedEvents = useMemo(() => {
        return map(pageEvents, (_e, i) => {
            return populateEvents(pageEvents[i], {
                screenWidth: width / numberOfDays,
                dayStart: start,
                overlapEventsSpacing: overlapEventsSpacing / numberOfDays,
                rightEdgeSpacing: rightEdgeSpacing / numberOfDays
            });
        });
    }, [pageEvents, start, numberOfDays]);
    useEffect(() => {
        let initialPosition = 0;
        if (scrollToNow) {
            initialPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT);
        }
        else if (scrollToFirst && packedEvents[0].length > 0) {
            initialPosition = min(map(packedEvents[0], 'top')) ?? 0;
        }
        else if (initialTime) {
            initialPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT, initialTime.hour, initialTime.minutes);
        }
        if (initialPosition) {
            setTimeout(() => {
                scrollView?.current?.scrollTo({
                    y: Math.max(0, initialPosition - HOUR_BLOCK_HEIGHT),
                    animated: true
                });
            }, 0);
        }
    }, []);
    const _onEventPress = useCallback((dateIndex, eventIndex) => {
        const event = packedEvents[dateIndex][eventIndex];
        if (eventTapped) {
            //TODO: remove after deprecation
            eventTapped(event);
        }
        else {
            onEventPress?.(event);
        }
    }, [onEventPress, eventTapped]);
    const renderEvents = (dayIndex) => {
        const events = packedEvents[dayIndex].map((event, eventIndex) => {
            const onEventPress = () => _onEventPress(dayIndex, eventIndex);
            return (<EventBlock key={eventIndex} index={eventIndex} event={event} styles={styles.current} format24h={format24h} onPress={onEventPress} renderEvent={renderEvent}/>);
        });
        return (<View pointerEvents={'box-none'} style={[{ marginLeft: dayIndex === 0 ? timelineLeftInset : undefined }, styles.current.eventsContainer]}>
        {events}
      </View>);
    };
    const renderTimelineDay = (dayIndex) => {
        const indexOfToday = pageDates.indexOf(generateDay(new Date().toString()));
        const left = timelineLeftInset + indexOfToday * width / numberOfDays;
        return (<React.Fragment key={dayIndex}>
        {renderEvents(dayIndex)}
        {indexOfToday !== -1 && showNowIndicator && <NowIndicator width={width / numberOfDays} left={left} styles={styles.current}/>}
      </React.Fragment>);
    };
    return (<ScrollView 
    // @ts-expect-error
    ref={scrollView} style={styles.current.container} contentContainerStyle={[styles.current.contentStyle, { width: constants.screenWidth }]} showsVerticalScrollIndicator={false} {...scrollEvents}>
      <TimelineHours start={start} end={end} date={pageDates[0]} format24h={format24h} styles={styles.current} unavailableHours={unavailableHours} unavailableHoursColor={unavailableHoursColor} onBackgroundLongPress={onBackgroundLongPress} onBackgroundLongPressOut={onBackgroundLongPressOut} width={width} numberOfDays={numberOfDays} timelineLeftInset={timelineLeftInset}/>
      {times(numberOfDays, renderTimelineDay)}
    </ScrollView>);
};
export default React.memo(Timeline);
