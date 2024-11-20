var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import XDate from 'xdate';
import InfiniteList from '../../infinite-list';
import Week from '../week';
import WeekDaysNames from '../../commons/WeekDaysNames';
import CalendarContext from '../../expandableCalendar/Context';
import styleConstructor from '../style';
import { toMarkingFormat } from '../../interface';
import { extractCalendarProps } from '../../componentUpdater';
import constants from '../../commons/constants';
import { UpdateSources } from '../commons';
import { sameWeek } from '../../dateutils';
const NUMBER_OF_PAGES = 50;
const DEFAULT_PAGE_HEIGHT = 48;
const WeekCalendar = (props) => {
    const { current, firstDay = 0, markedDates, allowShadow = true, hideDayNames, theme, calendarWidth, calendarHeight = DEFAULT_PAGE_HEIGHT, testID } = props;
    const context = useContext(CalendarContext);
    const { date, updateSource } = context;
    const style = useRef(styleConstructor(theme));
    const list = useRef();
    const [items, setItems] = useState(getDatesArray(current || date, firstDay, NUMBER_OF_PAGES));
    const extraData = {
        current,
        date: context.date,
        firstDay
    };
    const containerWidth = calendarWidth || constants.screenWidth;
    const weekStyle = useMemo(() => {
        return [{ width: containerWidth }, props.style];
    }, [containerWidth, props.style]);
    useEffect(() => {
        var _a, _b;
        if (updateSource !== UpdateSources.WEEK_SCROLL) {
            const pageIndex = items.findIndex(item => sameWeek(item, date, firstDay));
            // @ts-ignore
            (_b = (_a = list.current) === null || _a === void 0 ? void 0 : _a.scrollToOffset) === null || _b === void 0 ? void 0 : _b.call(_a, pageIndex * containerWidth, 0, false);
        }
    }, [date]);
    const onDayPress = useCallback((dateData) => {
        var _a, _b;
        (_a = context.setDate) === null || _a === void 0 ? void 0 : _a.call(context, dateData.dateString, UpdateSources.DAY_PRESS);
        (_b = props.onDayPress) === null || _b === void 0 ? void 0 : _b.call(props, dateData);
    }, [props.onDayPress]);
    const onPageChange = useCallback((pageIndex, _prevPage, { scrolledByUser }) => {
        if (scrolledByUser) {
            context === null || context === void 0 ? void 0 : context.setDate(items[pageIndex], UpdateSources.WEEK_SCROLL);
        }
    }, [items]);
    const reloadPages = useCallback(pageIndex => {
        const date = items[pageIndex];
        setItems(getDatesArray(date, firstDay, NUMBER_OF_PAGES));
    }, [items]);
    const renderItem = useCallback((_type, item) => {
        const { allowShadow } = props, calendarListProps = __rest(props, ["allowShadow"]);
        const /* style,  */ others = __rest(extractCalendarProps(calendarListProps), []);
        const isSameWeek = sameWeek(item, date, firstDay);
        return (<Week {...others} key={item} current={isSameWeek ? date : item} firstDay={firstDay} style={weekStyle} markedDates={markedDates} onDayPress={onDayPress} context={context}/>);
    }, [date, markedDates]);
    return (<View testID={testID} style={[allowShadow && style.current.containerShadow, !hideDayNames && style.current.containerWrapper]}>
      {!hideDayNames && (<View style={[style.current.week, style.current.weekCalendar]}>
          <WeekDaysNames firstDay={firstDay} style={style.current.dayHeader}/>
        </View>)}
      <View>
        <InfiniteList key="week-list" isHorizontal ref={list} data={items} renderItem={renderItem} reloadPages={reloadPages} onReachNearEdgeThreshold={Math.round(NUMBER_OF_PAGES * 0.4)} extendedState={extraData} style={style.current.container} initialPageIndex={NUMBER_OF_PAGES} pageHeight={calendarHeight} pageWidth={containerWidth} onPageChange={onPageChange} scrollViewProps={{
            showsHorizontalScrollIndicator: false
        }}/>
      </View>
    </View>);
};
export default WeekCalendar;
// function getDate({current, context, firstDay = 0}: WeekCalendarProps, weekIndex: number) {
function getDate(date, firstDay, weekIndex) {
    // const d = new XDate(current || context.date);
    const d = new XDate(date);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
        dayOfTheWeek = 7 + dayOfTheWeek;
    }
    // leave the current date in the visible week as is
    const dd = weekIndex === 0 ? d : d.addDays(firstDay - dayOfTheWeek);
    const newDate = dd.addWeeks(weekIndex);
    return toMarkingFormat(newDate);
}
// function getDatesArray(args: WeekCalendarProps, numberOfPages = NUMBER_OF_PAGES) => {
function getDatesArray(date, firstDay, numberOfPages = NUMBER_OF_PAGES) {
    const array = [];
    for (let index = -numberOfPages; index <= numberOfPages; index++) {
        const d = getDate(date, firstDay, index);
        array.push(d);
    }
    return array;
}
