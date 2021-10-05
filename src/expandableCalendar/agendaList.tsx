import get from 'lodash/get';
import map from 'lodash/map';
import omit from 'lodash/omit';
import invoke from 'lodash/invoke';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {Component} from 'react';
import {
  Text,
  SectionList,
  SectionListProps,
  DefaultSectionT,
  SectionListData,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  ViewToken
} from 'react-native';

// @ts-expect-error
import {isToday, isGTE, sameDate} from '../dateutils';
// @ts-expect-error
import {getMoment} from '../momentResolver';
// @ts-expect-error
import {parseDate} from '../interface';
import {Theme} from '../types';
import styleConstructor from './style';
import asCalendarConsumer from './asCalendarConsumer';

const commons = require('./commons');
const updateSources = commons.UpdateSources;

interface Props extends SectionListProps<any, DefaultSectionT> {
  /** day format in section title. Formatting values: http://arshaw.com/xdate/#Formatting */
  dayFormat?: string;
  /** a function to custom format the section header's title */
  dayFormatter?: (arg0: string) => string;
  /** whether to use moment.js for date string formatting
   * (remember to pass 'dayFormat' with appropriate format, like 'dddd, MMM D') */
  useMoment?: boolean;
  /** whether to mark today's title with the "Today, ..." string. Default = true */
  markToday?: boolean;
  /** style passed to the section view */
  sectionStyle?: ViewStyle;
  /** whether to block the date change in calendar (and calendar context provider) when agenda scrolls */
  avoidDateUpdates?: boolean;
  /** offset scroll to section */
  viewOffset?: number;
  /** enable scrolling the agenda list to the next date with content when pressing a day without content */
  scrollToNextEvent?: boolean;
  theme?: Theme;
  context?: any;
}
export type AgendaListProps = Props;

/**
 * @description: AgendaList component
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: SectionList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
class AgendaList extends Component<Props> {
  static displayName = 'AgendaList';

  static propTypes = {
    // ...SectionList.propTypes,
    /** day format in section title. Formatting values: http://arshaw.com/xdate/#Formatting */
    dayFormat: PropTypes.string,
    /** a function to custom format the section header's title */
    dayFormatter: PropTypes.func,
    /** whether to use moment.js for date string formatting
     * (remember to pass 'dayFormat' with appropriate format, like 'dddd, MMM D') */
    useMoment: PropTypes.bool,
    /** whether to mark today's title with the "Today, ..." string. Default = true */
    markToday: PropTypes.bool,
    /** style passed to the section view */
    sectionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    /** whether to block the date change in calendar (and calendar context provider) when agenda scrolls */
    avoidDateUpdates: PropTypes.bool
  };

  static defaultProps = {
    dayFormat: 'dddd, MMM d',
    stickySectionHeadersEnabled: true,
    markToday: true
  };

  style = styleConstructor(this.props.theme);
  _topSection = get(this.props, 'sections[0].title');
  didScroll = false;
  sectionScroll = false;
  viewabilityConfig = {
    itemVisiblePercentThreshold: 20 // 50 means if 50% of the item is visible
  };
  list: React.RefObject<any> = React.createRef();
  sectionHeight = 0;

  componentDidMount() {
    const {date} = this.props.context;
    if (date !== this._topSection) {
      setTimeout(() => {
        this.scrollToSection();
      }, 500);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {updateSource, date} = this.props.context;
    if (date !== prevProps.context.date) {
      // NOTE: on first init data should set first section to the current date!!!
      if (updateSource !== updateSources.LIST_DRAG && updateSource !== updateSources.CALENDAR_INIT) {
        this.scrollToSection();
      }
    }
  }

  getSectionIndex(date: Date) {
    let i;
    map(this.props.sections, (section, index) => {
      // NOTE: sections titles should match current date format!!!
      if (section.title === date) {
        i = index;
        return;
      }
    });
    return i;
  }

  getNextSectionIndex(date: Date) {
    let i = 0;
    const {sections} = this.props;
    for (let j = 1; j < sections.length; j++) {
      const prev = parseDate(sections[j - 1].title);
      const next = parseDate(sections[j].title);
      const cur = parseDate(date);
      if (isGTE(cur, prev) && isGTE(next, cur)) {
        i = sameDate(prev, cur) ? j - 1 : j;
        break;
      } else if (isGTE(cur, next)) {
        i = j;
      }
    }
    return i;
  }

  getSectionTitle(title: string) {
    if (!title) return;

    const {dayFormatter, dayFormat, useMoment, markToday} = this.props;
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
      // @ts-expect-error
      const todayString = XDate.locales[XDate.defaultLocale].today || commons.todayString;
      const today = isToday(new XDate(title));
      sectionTitle = today ? `${todayString}, ${sectionTitle}` : sectionTitle;
    }

    return sectionTitle;
  }

  scrollToSection() {
    const {date} = this.props.context;
    const {scrollToNextEvent, sections, viewOffset = 0} = this.props;
    const sectionIndex = scrollToNextEvent ? this.getNextSectionIndex(date) : this.getSectionIndex(date);
    if (isUndefined(sectionIndex)) {
      return;
    }
    if (this.list?.current && sectionIndex !== undefined) {
      this.sectionScroll = true; // to avoid setDate() in onViewableItemsChanged
      this._topSection = sections[sectionIndex].title;

      this.list.current.scrollToLocation({
        animated: true,
        sectionIndex: sectionIndex,
        itemIndex: 0,
        viewPosition: 0, // position at the top
        viewOffset: (commons.isAndroid ? this.sectionHeight : 0) + viewOffset
      });
    }
  }

  onViewableItemsChanged = (info: {viewableItems: Array<ViewToken>; changed: Array<ViewToken>}) => {
    if (info?.viewableItems && !this.sectionScroll) {
      const topSection = get(info?.viewableItems[0], 'section.title');
      if (topSection && topSection !== this._topSection) {
        this._topSection = topSection;
        if (this.didScroll && !this.props.avoidDateUpdates) {
          // to avoid setDate() on first load (while setting the initial context.date value)
          invoke(this.props.context, 'setDate', this._topSection, updateSources.LIST_DRAG);
        }
      }
    }
  };

  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!this.didScroll) {
      this.didScroll = true;
    }
    invoke(this.props, 'onScroll', event);
  };

  onMomentumScrollBegin = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    invoke(this.props.context, 'setDisabled', true);
    invoke(this.props, 'onMomentumScrollBegin', event);
  };

  onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // when list momentum ends AND when scrollToSection scroll ends
    this.sectionScroll = false;
    invoke(this.props.context, 'setDisabled', false);
    invoke(this.props, 'onMomentumScrollEnd', event);
  };

  onScrollToIndexFailed = (info: {index: number; highestMeasuredFrameIndex: number; averageItemLength: number}) => {
    if (this.props.onScrollToIndexFailed) {
      this.props.onScrollToIndexFailed(info);
    } else {
      console.warn('onScrollToIndexFailed info: ', info);
    }
  };

  onHeaderLayout = (event: LayoutChangeEvent) => {
    this.sectionHeight = event.nativeEvent.layout.height;
  };

  renderSectionHeader = (info: {section: SectionListData<any, DefaultSectionT>}) => {
    const {renderSectionHeader, sectionStyle} = this.props;
    const title = info?.section?.title;

    if (renderSectionHeader) {
      return renderSectionHeader(title);
    }

    return (
      <Text allowFontScaling={false} style={[this.style.sectionText, sectionStyle]} onLayout={this.onHeaderLayout}>
        {this.getSectionTitle(title)}
      </Text>
    );
  };

  keyExtractor = (item: any, index: number) => {
    const {keyExtractor} = this.props;
    return isFunction(keyExtractor) ? keyExtractor(item, index) : String(index);
  };

  render() {
    const props = omit(this.props, 'context');

    return (
      <SectionList
        {...props}
        ref={this.list}
        keyExtractor={this.keyExtractor}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={this.onViewableItemsChanged}
        viewabilityConfig={this.viewabilityConfig}
        renderSectionHeader={this.renderSectionHeader}
        onScroll={this.onScroll}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        onScrollToIndexFailed={this.onScrollToIndexFailed}
        // getItemLayout={this.getItemLayout} // onViewableItemsChanged is not updated when list scrolls!!!
      />
    );
  }

  // getItemLayout = (data, index) => {
  //   return {length: commons.screenWidth, offset: commons.screenWidth  * index, index};
  // }
}

export default asCalendarConsumer(AgendaList);
