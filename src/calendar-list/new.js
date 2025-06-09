import XDate from 'xdate';
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { View } from 'react-native';
import constants from '../commons/constants';
import { toMarkingFormat } from '../interface';
import { extractHeaderProps } from '../componentUpdater';
import Calendar from '../calendar';
import CalendarHeader from '../calendar/header';
import InfiniteList from '../infinite-list';
import styleConstructor from './style';
const NUMBER_OF_PAGES = 50;
const CALENDAR_HEIGHT = 360;
const CalendarList = (props) => {
    const { initialDate, horizontal, scrollRange = NUMBER_OF_PAGES, staticHeader, scrollViewProps, calendarProps, testID } = props;
    const style = useRef(styleConstructor(calendarProps?.theme));
    const list = useRef();
    const [items, setItems] = useState(getDatesArray(initialDate, scrollRange));
    const [positionIndex, setPositionIndex] = useState(scrollRange);
    /** Static Header */
    const [currentMonth, setCurrentMonth] = useState(initialDate || items[scrollRange]);
    const shouldRenderStaticHeader = staticHeader && horizontal;
    const headerProps = extractHeaderProps(props);
    const staticHeaderStyle = useMemo(() => {
        return [style.current.staticHeader, calendarProps?.headerStyle];
    }, [calendarProps?.headerStyle]);
    useEffect(() => {
        scrollToMonth(currentMonth);
    }, [currentMonth]);
    const getMonthIndex = useCallback((month) => {
        if (!month) {
            return -1;
        }
        return items.findIndex(item => item.includes(month.toString('yyyy-MM')));
    }, [items]);
    const scrollToMonth = useCallback((month) => {
        if (month) {
            const index = getMonthIndex(new XDate(month));
            if (index !== -1) {
                const shouldAnimate = constants.isAndroid && !horizontal ? false : true;
                // @ts-expect-error
                list.current?.scrollToOffset?.(index * constants.screenWidth, 0, shouldAnimate);
            }
        }
    }, [getMonthIndex]);
    const updateMonth = useCallback((count, month) => {
        if (month) {
            const next = new XDate(month).addMonths(count, true);
            const nextNext = new XDate(month).addMonths(count * 2, true);
            const nextNextIndex = getMonthIndex(nextNext);
            if (nextNextIndex !== -1) {
                setCurrentMonth(toMarkingFormat(next));
            }
        }
    }, [getMonthIndex]);
    const scrollToNextMonth = useCallback((method, month) => {
        if (calendarProps?.onPressArrowLeft) {
            calendarProps?.onPressArrowLeft?.(method, month);
        }
        else {
            updateMonth(1, month);
        }
    }, [updateMonth]);
    const scrollToPreviousMonth = useCallback((method, month) => {
        if (calendarProps?.onPressArrowRight) {
            calendarProps?.onPressArrowRight?.(method, month);
        }
        else {
            updateMonth(-1, month);
        }
    }, [updateMonth]);
    const onPageChange = useCallback((pageIndex, _, info) => {
        if (shouldRenderStaticHeader && info.scrolledByUser) {
            setCurrentMonth(items[pageIndex]);
        }
    }, [items]);
    const renderStaticHeader = () => {
        if (shouldRenderStaticHeader) {
            return (<CalendarHeader {...headerProps} month={new XDate(currentMonth)} onPressArrowRight={scrollToNextMonth} onPressArrowLeft={scrollToPreviousMonth} style={staticHeaderStyle} accessibilityElementsHidden // iOS
             importantForAccessibility={'no-hide-descendants'} // Android
             testID={'static-header'}/>);
        }
    };
    /** Data */
    const reloadPages = useCallback(pageIndex => {
        horizontal ? replaceItems(pageIndex) : addItems(pageIndex);
    }, [items]);
    const replaceItems = (index) => {
        const newItems = getDatesArray(items[index], scrollRange);
        setItems(newItems);
    };
    const addItems = (index) => {
        const array = [...items];
        const startingDate = items[index];
        const shouldAppend = index > scrollRange;
        if (startingDate) {
            if (shouldAppend) {
                for (let i = 2; i <= scrollRange; i++) {
                    const newDate = getDate(startingDate, i);
                    array.push(newDate);
                }
            }
            else {
                for (let i = -1; i > -scrollRange; i--) {
                    const newDate = getDate(startingDate, i);
                    array.unshift(newDate);
                }
            }
            setPositionIndex(shouldAppend ? index : scrollRange - 1);
            setItems(array);
        }
    };
    /** List */
    const listContainerStyle = useMemo(() => {
        return [style.current.flatListContainer, { flex: horizontal ? undefined : 1 }];
    }, [style, horizontal]);
    const scrollProps = useMemo(() => {
        return {
            ...scrollViewProps,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false
        };
    }, [scrollViewProps]);
    const renderItem = useCallback((_type, item) => {
        return (<Calendar {...calendarProps} {...headerProps} initialDate={item} disableMonthChange hideArrows={!horizontal} onPressArrowRight={scrollToNextMonth} onPressArrowLeft={scrollToPreviousMonth} hideExtraDays={calendarProps?.hideExtraDays || true} style={[style.current.calendar, calendarProps?.style]} headerStyle={horizontal ? calendarProps?.headerStyle : undefined} testID={`${testID}_${item}`}/>);
    }, [calendarProps, scrollToNextMonth, scrollToPreviousMonth]);
    return (<View style={listContainerStyle}>
      <InfiniteList key="calendar-list" ref={list} data={items} renderItem={renderItem} reloadPages={reloadPages} onReachNearEdgeThreshold={Math.round(NUMBER_OF_PAGES * 0.4)} extendedState={calendarProps?.markedDates} isHorizontal={horizontal} style={style.current.container} initialPageIndex={scrollRange} positionIndex={positionIndex} pageHeight={CALENDAR_HEIGHT} pageWidth={constants.screenWidth} onPageChange={onPageChange} scrollViewProps={scrollProps}/>
      {renderStaticHeader()}
    </View>);
};
export default CalendarList;
function getDate(date, index) {
    const d = new XDate(date);
    d.addMonths(index, true);
    // if (index !== 0) {
    d.setDate(1);
    // }
    return toMarkingFormat(d);
}
function getDatesArray(date, numberOfPages = NUMBER_OF_PAGES) {
    const d = date || new XDate().toString();
    const array = [];
    for (let index = -numberOfPages; index <= numberOfPages; index++) {
        const newDate = getDate(d, index);
        array.push(newDate);
    }
    return array;
}
