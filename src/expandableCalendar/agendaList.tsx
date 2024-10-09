import PropTypes from 'prop-types';

import get from 'lodash/get';
import map from 'lodash/map';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import debounce from 'lodash/debounce';

import XDate from 'xdate';

import React, {useCallback, useContext, useEffect, useMemo, useRef} from 'react';
import {
  SectionList,
  DefaultSectionT,
  SectionListData,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  ViewToken,
} from 'react-native';

import {useDidUpdate} from '../hooks';
import {getMoment} from '../momentResolver';
import {isToday, isGTE, sameDate} from '../dateutils';
import {parseDate} from '../interface';
import {getDefaultLocale} from '../services';
import {UpdateSources, todayString} from './commons';
import constants from '../commons/constants';
import styleConstructor from './style';
import Context from './Context';
import InfiniteAgendaList from './infiniteAgendaList';
import {AgendaListProps, AgendaSectionHeader} from './AgendaListsCommon';

const viewabilityConfig = {
  itemVisiblePercentThreshold: 20 // 50 means if 50% of the item is visible
};

/**
 * @description: AgendaList component
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: SectionList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const AgendaList = (props: AgendaListProps) => {
  if (props.infiniteListProps) {
    return <InfiniteAgendaList {...props} />;
  }

  const {
    theme,
    sections,
    scrollToNextEvent,
    viewOffset = 0,
    avoidDateUpdates,
    onScroll,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    onScrollToIndexFailed,
    renderSectionHeader,
    sectionStyle,
    keyExtractor,
    dayFormatter,
    dayFormat = 'dddd, MMM d',
    useMoment,
    markToday = true,
    onViewableItemsChanged,
  } = props;

  const {date, updateSource, setDate, setDisabled} = useContext(Context);

  const style = useRef(styleConstructor(theme));
  const list = useRef<any>();
  const _topSection = useRef(sections[0]?.title);
  const didScroll = useRef(false);
  const sectionScroll = useRef(false);
  const sectionHeight = useRef(0);

  useEffect(() => {
    if (date !== _topSection.current) {
      setTimeout(() => {
        scrollToSection(date);
      }, 500);
    }
  }, []);

  useEffect(() => {
    style.current = styleConstructor(theme);
  }, [theme]);

  useDidUpdate(() => {
    // NOTE: on first init data should set first section to the current date!!!
    if (updateSource !== UpdateSources.LIST_DRAG && updateSource !== UpdateSources.CALENDAR_INIT) {
      scrollToSection(date);
    }
  }, [date]);

  const getSectionIndex = (date: string) => {
    let i;
    map(sections, (section, index) => {
      // NOTE: sections titles should match current date format!!!
      if (section.title === date) {
        i = index;
      }
    });
    return i;
  };

  const getNextSectionIndex = (date: string) => {
    let i = 0;
    for (let j = 1; j < sections.length; j++) {
      const prev = parseDate(sections[j - 1]?.title);
      const next = parseDate(sections[j]?.title);
      const cur = new XDate(date);
      if (isGTE(cur, prev) && isGTE(next, cur)) {
        i = sameDate(prev, cur) ? j - 1 : j;
        break;
      } else if (isGTE(cur, next)) {
        i = j;
      }
    }
    return i;
  };

  const getSectionTitle = useCallback((title: string) => {
    if (!title) return;

    let sectionTitle = title;

    if (dayFormatter) {
      sectionTitle = dayFormatter(title);
    } else if (dayFormat) {
      if (useMoment) {
        const moment = getMoment();
        sectionTitle = moment(title).format(dayFormat);
      } else {
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

  const scrollToSection = useCallback(debounce((d) => {
    const sectionIndex = scrollToNextEvent ? getNextSectionIndex(d) : getSectionIndex(d);
    if (isUndefined(sectionIndex)) {
      return;
    }
    if (list?.current && sectionIndex !== undefined) {
      sectionScroll.current = true; // to avoid setDate() in onViewableItemsChanged
      _topSection.current = sections[sectionIndex]?.title;

      list?.current.scrollToLocation({
        animated: true,
        sectionIndex: sectionIndex,
        itemIndex: 1,
        viewPosition: 0, // position at the top
        viewOffset: (constants.isAndroid ? sectionHeight.current : 0) + viewOffset
      });
    }
  }, 1000, {leading: false, trailing: true}), [viewOffset, sections]);

  const _onViewableItemsChanged = useCallback((info: {viewableItems: Array<ViewToken>; changed: Array<ViewToken>}) => {
    if (info?.viewableItems && !sectionScroll.current) {
      const topSection = get(info?.viewableItems[0], 'section.title');
      if (topSection && topSection !== _topSection.current) {
        _topSection.current = topSection;
        if (didScroll.current && !avoidDateUpdates) {
          // to avoid setDate() on first load (while setting the initial context.date value)
          setDate?.(_topSection.current, UpdateSources.LIST_DRAG);
        }
      }
    }
    onViewableItemsChanged?.(info);
  }, [avoidDateUpdates, setDate, onViewableItemsChanged]);

  const _onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!didScroll.current) {
      didScroll.current = true;
      scrollToSection.cancel();
    }
    onScroll?.(event);
  }, [onScroll]);

  const _onMomentumScrollBegin = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setDisabled?.(true);
    onMomentumScrollBegin?.(event);
  }, [onMomentumScrollBegin, setDisabled]);

  const _onMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // when list momentum ends AND when scrollToSection scroll ends
    sectionScroll.current = false;
    setDisabled?.(false);
    onMomentumScrollEnd?.(event);
  }, [onMomentumScrollEnd, setDisabled]);

  const headerTextStyle = useMemo(() => [style.current.sectionText, sectionStyle], [sectionStyle]);

  const _onScrollToIndexFailed = useCallback((info: {index: number; highestMeasuredFrameIndex: number; averageItemLength: number}) => {
    if (onScrollToIndexFailed) {
      onScrollToIndexFailed(info);
    } else {
      console.log('onScrollToIndexFailed info: ', info);
    }
  }, [onScrollToIndexFailed]);

  const onHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    sectionHeight.current = event.nativeEvent.layout.height;
  }, []);

  const _renderSectionHeader = useCallback((info: {section: SectionListData<any, DefaultSectionT>}) => {
    const title = info?.section?.title;

    if (renderSectionHeader) {
      return renderSectionHeader(title);
    }

    const headerTitle = getSectionTitle(title);
    return <AgendaSectionHeader title={headerTitle} style={headerTextStyle} onLayout={onHeaderLayout}/>;
  }, [headerTextStyle]);

  const _keyExtractor = useCallback((item: any, index: number) => {
    return isFunction(keyExtractor) ? keyExtractor(item, index) : String(index);
  }, [keyExtractor]);

  return (
    <SectionList
      stickySectionHeadersEnabled
      {...props}
      ref={list}
      keyExtractor={_keyExtractor}
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={_onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      renderSectionHeader={_renderSectionHeader}
      onScroll={_onScroll}
      onMomentumScrollBegin={_onMomentumScrollBegin}
      onMomentumScrollEnd={_onMomentumScrollEnd}
      onScrollToIndexFailed={_onScrollToIndexFailed}
      // getItemLayout={_getItemLayout} // onViewableItemsChanged is not updated when list scrolls!!!
    />
  );

  // _getItemLayout = (data, index) => {
  //   return {length: constants.screenWidth, offset: constants.screenWidth * index, index};
  // }
};

export default AgendaList;

AgendaList.displayName = 'AgendaList';
AgendaList.propTypes = {
  dayFormat: PropTypes.string,
  dayFormatter: PropTypes.func,
  useMoment: PropTypes.bool,
  markToday: PropTypes.bool,
  sectionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  avoidDateUpdates: PropTypes.bool
};
