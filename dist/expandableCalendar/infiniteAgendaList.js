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
import PropTypes from 'prop-types';
import isUndefined from 'lodash/isUndefined';
import debounce from 'lodash/debounce';
import InfiniteList from '../infinite-list';
import XDate from 'xdate';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDidUpdate } from '../hooks';
import { getMoment } from '../momentResolver';
import { isGTE, isToday } from '../dateutils';
import { getDefaultLocale } from '../services';
import { UpdateSources, todayString } from './commons';
import styleConstructor from './style';
import Context from './Context';
import constants from "../commons/constants";
import { parseDate } from "../interface";
import { LayoutProvider } from "recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider";
import { AgendaSectionHeader } from "./AgendaListsCommon";
/**
 * @description: AgendaList component that use InfiniteList to improve performance
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: InfiniteList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const InfiniteAgendaList = (_a) => {
    var _b, _c;
    var { theme, sections, scrollToNextEvent, avoidDateUpdates, onScroll, renderSectionHeader, sectionStyle, dayFormatter, dayFormat = 'dddd, MMM d', useMoment, markToday = true, infiniteListProps, renderItem, onEndReached, onEndReachedThreshold } = _a, others = __rest(_a, ["theme", "sections", "scrollToNextEvent", "avoidDateUpdates", "onScroll", "renderSectionHeader", "sectionStyle", "dayFormatter", "dayFormat", "useMoment", "markToday", "infiniteListProps", "renderItem", "onEndReached", "onEndReachedThreshold"]);
    const { date, updateSource, setDate } = useContext(Context);
    const style = useRef(styleConstructor(theme));
    const list = useRef();
    const _topSection = useRef((_b = sections[0]) === null || _b === void 0 ? void 0 : _b.title);
    const didScroll = useRef(false);
    const sectionScroll = useRef(false);
    const [data, setData] = useState([]);
    const dataRef = useRef(data);
    useEffect(() => {
        const items = sections.reduce((acc, cur) => {
            return [...acc, { title: cur.title, isTitle: true }, ...cur.data];
        }, []);
        setData(items);
        dataRef.current = items;
        if (date !== _topSection.current) {
            setTimeout(() => {
                scrollToSection(date);
            }, 500);
        }
    }, [sections]);
    useDidUpdate(() => {
        // NOTE: on first init data should set first section to the current date!!!
        if (updateSource !== UpdateSources.LIST_DRAG && updateSource !== UpdateSources.CALENDAR_INIT) {
            scrollToSection(date);
        }
    }, [date]);
    const getSectionIndex = (date) => {
        let dataIndex = 0;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].title === date) {
                return dataIndex;
            }
            dataIndex += sections[i].data.length + 1;
        }
    };
    const getNextSectionIndex = (date) => {
        const cur = new XDate(date);
        let dataIndex = 0;
        for (let i = 0; i < sections.length; i++) {
            const titleDate = parseDate(sections[i].title);
            if (isGTE(titleDate, cur)) {
                return dataIndex;
            }
            dataIndex += sections[i].data.length + 1;
        }
    };
    const getSectionTitle = useCallback((title) => {
        if (!title)
            return;
        let sectionTitle = title;
        if (dayFormatter) {
            sectionTitle = dayFormatter(title);
        }
        else if (dayFormat) {
            if (useMoment) {
                const moment = getMoment();
                sectionTitle = moment(title).format(dayFormat);
            }
            else {
                sectionTitle = new XDate(title).toString(dayFormat);
            }
        }
        if (markToday) {
            const string = getDefaultLocale().today || todayString;
            const today = isToday(title);
            sectionTitle = today ? `${string}, ${sectionTitle}` : sectionTitle;
        }
        return sectionTitle;
    }, []);
    const scrollToSection = useCallback(debounce((requestedDate) => {
        var _a, _b;
        const sectionIndex = scrollToNextEvent ? getNextSectionIndex(requestedDate) : getSectionIndex(requestedDate);
        if (isUndefined(sectionIndex)) {
            return;
        }
        if ((list === null || list === void 0 ? void 0 : list.current) && sectionIndex !== undefined) {
            sectionScroll.current = true; // to avoid setDate() in _onVisibleIndicesChanged
            if (requestedDate !== _topSection.current) {
                _topSection.current = (_a = sections[findItemTitleIndex(sectionIndex)]) === null || _a === void 0 ? void 0 : _a.title;
                (_b = list.current) === null || _b === void 0 ? void 0 : _b.scrollToIndex(sectionIndex, true);
            }
            setTimeout(() => {
                _onMomentumScrollEnd(); // the RecyclerListView doesn't trigger onMomentumScrollEnd when calling scrollToSection
            }, 500);
        }
    }, 1000, { leading: false, trailing: true }), [sections]);
    const layoutProvider = useMemo(() => new LayoutProvider((index) => { var _a, _b, _c; return ((_a = dataRef.current[index]) === null || _a === void 0 ? void 0 : _a.isTitle) ? 'title' : (_c = (_b = dataRef.current[index]) === null || _b === void 0 ? void 0 : _b.itemCustomHeightType) !== null && _c !== void 0 ? _c : 'page'; }, (type, dim) => {
        var _a, _b, _c, _d, _e;
        dim.width = constants.screenWidth;
        switch (type) {
            case 'title':
                dim.height = (_a = infiniteListProps === null || infiniteListProps === void 0 ? void 0 : infiniteListProps.titleHeight) !== null && _a !== void 0 ? _a : 60;
                break;
            case 'page':
                dim.height = (_b = infiniteListProps === null || infiniteListProps === void 0 ? void 0 : infiniteListProps.itemHeight) !== null && _b !== void 0 ? _b : 80;
                break;
            default:
                dim.height = (_e = (_d = (_c = infiniteListProps === null || infiniteListProps === void 0 ? void 0 : infiniteListProps.itemHeightByType) === null || _c === void 0 ? void 0 : _c[type]) !== null && _d !== void 0 ? _d : infiniteListProps === null || infiniteListProps === void 0 ? void 0 : infiniteListProps.itemHeight) !== null && _e !== void 0 ? _e : 80;
        }
    }), []);
    const _onScroll = useCallback((rawEvent) => {
        if (!didScroll.current) {
            didScroll.current = true;
            scrollToSection.cancel();
        }
        // Convert to a format similar to NativeSyntheticEvent<NativeScrollEvent>
        const event = {
            nativeEvent: {
                contentOffset: rawEvent.nativeEvent.contentOffset,
                layoutMeasurement: rawEvent.nativeEvent.layoutMeasurement,
                contentSize: rawEvent.nativeEvent.contentSize,
            },
        };
        onScroll === null || onScroll === void 0 ? void 0 : onScroll(event);
    }, [onScroll]);
    const _onVisibleIndicesChanged = useCallback(debounce((all) => {
        if (all && all.length && !sectionScroll.current) {
            const topItemIndex = all[0];
            const topSection = data[findItemTitleIndex(topItemIndex)];
            if (topSection && topSection !== _topSection.current) {
                _topSection.current = topSection.title;
                if (didScroll.current && !avoidDateUpdates) {
                    // to avoid setDate() on first load (while setting the initial context.date value)
                    setDate === null || setDate === void 0 ? void 0 : setDate(topSection.title, UpdateSources.LIST_DRAG);
                }
            }
        }
    }, (_c = infiniteListProps === null || infiniteListProps === void 0 ? void 0 : infiniteListProps.visibleIndicesChangedDebounce) !== null && _c !== void 0 ? _c : 1000, { leading: false, trailing: true }), [avoidDateUpdates, setDate, data]);
    const findItemTitleIndex = useCallback((itemIndex) => {
        var _a;
        let titleIndex = itemIndex;
        while (titleIndex > 0 && !((_a = data[titleIndex]) === null || _a === void 0 ? void 0 : _a.isTitle)) {
            titleIndex--;
        }
        return titleIndex;
    }, [data]);
    const _onMomentumScrollEnd = useCallback(() => {
        sectionScroll.current = false;
    }, []);
    const headerTextStyle = useMemo(() => [style.current.sectionText, sectionStyle], [sectionStyle]);
    const _renderSectionHeader = useCallback((info) => {
        var _a;
        const title = (_a = info === null || info === void 0 ? void 0 : info.section) === null || _a === void 0 ? void 0 : _a.title;
        if (renderSectionHeader) {
            return renderSectionHeader(title);
        }
        const headerTitle = getSectionTitle(title);
        return <AgendaSectionHeader title={headerTitle} style={headerTextStyle}/>;
    }, [headerTextStyle]);
    const _renderItem = useCallback((_type, item) => {
        if (item === null || item === void 0 ? void 0 : item.isTitle) {
            return _renderSectionHeader({ section: item });
        }
        if (renderItem) {
            return renderItem({ item });
        }
        return <></>;
    }, [renderItem]);
    const _onEndReached = useCallback(() => {
        if (onEndReached) {
            onEndReached({ distanceFromEnd: 0 }); // The RecyclerListView doesn't provide the distanceFromEnd, so we just pass 0
        }
    }, [onEndReached]);
    return (<InfiniteList ref={list} renderItem={_renderItem} data={data} style={style.current.container} layoutProvider={layoutProvider} onScroll={_onScroll} onVisibleIndicesChanged={_onVisibleIndicesChanged} scrollViewProps={Object.assign(Object.assign({ nestedScrollEnabled: true }, others), { onMomentumScrollEnd: _onMomentumScrollEnd })} onEndReached={_onEndReached} onEndReachedThreshold={onEndReachedThreshold} disableScrollOnDataChange renderFooter={infiniteListProps === null || infiniteListProps === void 0 ? void 0 : infiniteListProps.renderFooter}/>);
};
export default InfiniteAgendaList;
InfiniteAgendaList.displayName = 'InfiniteAgendaList';
InfiniteAgendaList.propTypes = {
    dayFormat: PropTypes.string,
    dayFormatter: PropTypes.func,
    useMoment: PropTypes.bool,
    markToday: PropTypes.bool,
    sectionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    avoidDateUpdates: PropTypes.bool
};
