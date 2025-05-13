import PropTypes from 'prop-types';
import isUndefined from 'lodash/isUndefined';
import debounce from 'lodash/debounce';
import InfiniteList from '../../infinite-list';
import XDate from 'xdate';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDidUpdate } from '../../hooks';
import { getMoment } from '../../momentResolver';
import { isGTE, isToday } from '../../dateutils';
import { getDefaultLocale } from '../../services';
import { UpdateSources, todayString } from '../commons';
import styleConstructor from '../style';
import Context from '../Context';
import constants from '../../commons/constants';
import { parseDate } from '../../interface';
import { LayoutProvider } from 'recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider';
import { AgendaSectionHeader } from './commons';
/**
 * @description: AgendaList component that use InfiniteList to improve performance
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: InfiniteList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const InfiniteAgendaList = ({ theme, sections, scrollToNextEvent, avoidDateUpdates, onScroll, renderSectionHeader, sectionStyle, dayFormatter, dayFormat = 'dddd, MMM d', useMoment, markToday = true, infiniteListProps, renderItem, onEndReached, onEndReachedThreshold, ...others }) => {
    const { date, updateSource, setDate } = useContext(Context);
    const style = useRef(styleConstructor(theme));
    const list = useRef();
    const _topSection = useRef(sections[0]?.title);
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
        const sectionIndex = scrollToNextEvent ? getNextSectionIndex(requestedDate) : getSectionIndex(requestedDate);
        if (isUndefined(sectionIndex)) {
            return;
        }
        if (list?.current && sectionIndex !== undefined) {
            sectionScroll.current = true; // to avoid setDate() in _onVisibleIndicesChanged
            if (requestedDate !== _topSection.current) {
                _topSection.current = sections[findItemTitleIndex(sectionIndex)]?.title;
                list.current?.scrollToIndex(sectionIndex, true);
            }
            setTimeout(() => {
                _onMomentumScrollEnd(); // the RecyclerListView doesn't trigger onMomentumScrollEnd when calling scrollToSection
            }, 500);
        }
    }, 1000, { leading: true, trailing: true }), [sections]);
    const layoutProvider = useMemo(() => new LayoutProvider((index) => dataRef.current[index]?.isTitle ? 'title' : dataRef.current[index]?.itemCustomHeightType ?? 'page', (type, dim) => {
        dim.width = constants.screenWidth;
        switch (type) {
            case 'title':
                dim.height = infiniteListProps?.titleHeight ?? 60;
                break;
            case 'page':
                dim.height = infiniteListProps?.itemHeight ?? 80;
                break;
            default:
                dim.height = infiniteListProps?.itemHeightByType?.[type] ?? infiniteListProps?.itemHeight ?? 80;
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
                contentSize: rawEvent.nativeEvent.contentSize
            }
        };
        onScroll?.(event);
    }, [onScroll]);
    const _onVisibleIndicesChanged = useCallback((all) => {
        if (all && all.length && !sectionScroll.current) {
            const topItemIndex = all[0];
            const topSection = data[findItemTitleIndex(topItemIndex)];
            if (topSection && topSection !== _topSection.current) {
                _topSection.current = topSection.title;
                if (didScroll.current && !avoidDateUpdates) {
                    // to avoid setDate() on first load (while setting the initial context.date value)
                    setDate?.(topSection.title, UpdateSources.LIST_DRAG);
                }
            }
        }
    }, [avoidDateUpdates, setDate, data]);
    const findItemTitleIndex = useCallback((itemIndex) => {
        let titleIndex = itemIndex;
        while (titleIndex > 0 && !data[titleIndex]?.isTitle) {
            titleIndex--;
        }
        return titleIndex;
    }, [data]);
    const _onMomentumScrollEnd = useCallback(() => {
        sectionScroll.current = false;
    }, []);
    const headerTextStyle = useMemo(() => [style.current.sectionText, sectionStyle], [sectionStyle]);
    const _renderSectionHeader = useCallback((info) => {
        const title = info?.section?.title;
        if (renderSectionHeader) {
            return renderSectionHeader(title);
        }
        const headerTitle = getSectionTitle(title);
        return <AgendaSectionHeader title={headerTitle} style={headerTextStyle}/>;
    }, [headerTextStyle]);
    const _renderItem = useCallback((_type, item) => {
        if (item?.isTitle) {
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
    return (<InfiniteList ref={list} renderItem={_renderItem} data={data} style={style.current.container} layoutProvider={layoutProvider} onScroll={_onScroll} onVisibleIndicesChanged={_onVisibleIndicesChanged} scrollViewProps={{ nestedScrollEnabled: true, ...others, onMomentumScrollEnd: _onMomentumScrollEnd }} onEndReached={_onEndReached} onEndReachedThreshold={onEndReachedThreshold} disableScrollOnDataChange renderFooter={infiniteListProps?.renderFooter}/>);
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
