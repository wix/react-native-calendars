<<<<<<< HEAD:src/expandableCalendar/agendaList.js
import _ from 'lodash';
import React, {Component} from 'react';
import {SectionList, Text} from 'react-native';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import dateutils from '../dateutils';
import styleConstructor from './style';
import asCalendarConsumer from './asCalendarConsumer';
import {getMoment} from '../momentResolver';

const commons = require('./commons');
const UPDATE_SOURCES = commons.UPDATE_SOURCES;
=======
import get from 'lodash/get';
import map from 'lodash/map';
import omit from 'lodash/omit';
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

import {isToday, isGTE, sameDate} from '../dateutils';
import {getMoment} from '../momentResolver';
import {parseDate} from '../interface';
import {getDefaultLocale} from '../services';
import {Theme} from '../types';
import styleConstructor from './style';
import asCalendarConsumer from './asCalendarConsumer';

const commons = require('./commons');
const updateSources = commons.UpdateSources;

export interface AgendaListProps extends SectionListProps<any, DefaultSectionT> {
  /** Specify theme properties to override specific styles for calendar parts */
  theme?: Theme;
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
  
  context?: any;
}
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx

/**
 * @description: AgendaList component
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: SectionList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
<<<<<<< HEAD:src/expandableCalendar/agendaList.js
class AgendaList extends Component {
  static displayName = 'AgendaList';

  static propTypes = {
    ...SectionList.propTypes,
    /** day format in section title. Formatting values: http://arshaw.com/xdate/#Formatting */
=======
class AgendaList extends Component<AgendaListProps> {
  static displayName = 'AgendaList';

  static propTypes = {
    // ...SectionList.propTypes,
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx
    dayFormat: PropTypes.string,
    dayFormatter: PropTypes.func,
    useMoment: PropTypes.bool,
    markToday: PropTypes.bool,
    sectionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    avoidDateUpdates: PropTypes.bool
  };

  static defaultProps = {
    dayFormat: 'dddd, MMM d',
    stickySectionHeadersEnabled: true,
    markToday: true
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);

    this._topSection = _.get(props, 'sections[0].title');
    this.didScroll = false;
    this.sectionScroll = false;

    this.viewabilityConfig = {
      itemVisiblePercentThreshold: 20 // 50 means if 50% of the item is visible
    };
    this.list = React.createRef();
  }

  getSectionIndex(date) {
    let i;
    _.map(this.props.sections, (section, index) => {
      // NOTE: sections titles should match current date format!!!
      if (section.title === date) {
        i = index;
        return;
      }
    });
    return i;
  }

  componentDidMount() {
    const {date} = this.props.context;
    if (date !== this._topSection) {
      setTimeout(() => {
<<<<<<< HEAD:src/expandableCalendar/agendaList.js
        const sectionIndex = this.getSectionIndex(date);
        this.scrollToSection(sectionIndex);
=======
        this.scrollToSection();
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx
      }, 500);
    }
  }

<<<<<<< HEAD:src/expandableCalendar/agendaList.js
  componentDidUpdate(prevProps) {
    const {updateSource, date} = this.props.context;
    if (date !== prevProps.context.date) {
      // NOTE: on first init data should set first section to the current date!!!
      if (updateSource !== UPDATE_SOURCES.LIST_DRAG && updateSource !== UPDATE_SOURCES.CALENDAR_INIT) {
        const sectionIndex = this.getSectionIndex(date);
        this.scrollToSection(sectionIndex);
=======
  componentDidUpdate(prevProps: AgendaListProps) {
    const {updateSource, date} = this.props.context;
    if (date !== prevProps.context.date) {
      // NOTE: on first init data should set first section to the current date!!!
      if (updateSource !== updateSources.LIST_DRAG && updateSource !== updateSources.CALENDAR_INIT) {
        this.scrollToSection();
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx
      }
    }
  }

<<<<<<< HEAD:src/expandableCalendar/agendaList.js
  getSectionTitle(title) {
=======
  getSectionIndex(date: string) {
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

  getNextSectionIndex(date: string) {
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
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx
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
        sectionTitle = XDate(title).toString(dayFormat);
      }
    }

    if (markToday) {
<<<<<<< HEAD:src/expandableCalendar/agendaList.js
      const todayString = XDate.locales[XDate.defaultLocale].today || commons.todayString;
      const isToday = dateutils.isToday(XDate(title));
      sectionTitle = isToday ? `${todayString}, ${sectionTitle}` : sectionTitle;
=======
      const todayString = getDefaultLocale().today || commons.todayString;
      const today = isToday(new XDate(title));
      sectionTitle = today ? `${todayString}, ${sectionTitle}` : sectionTitle;
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx
    }

    return sectionTitle;
  }

<<<<<<< HEAD:src/expandableCalendar/agendaList.js
  scrollToSection(sectionIndex) {
    if (this.list.current && sectionIndex !== undefined) {
=======
  scrollToSection() {
    const {date} = this.props.context;
    const {scrollToNextEvent, sections, viewOffset = 0} = this.props;
    const sectionIndex = scrollToNextEvent ? this.getNextSectionIndex(date) : this.getSectionIndex(date);
    if (isUndefined(sectionIndex)) {
      return;
    }
    if (this.list?.current && sectionIndex !== undefined) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx
      this.sectionScroll = true; // to avoid setDate() in onViewableItemsChanged
      this._topSection = this.props.sections[sectionIndex].title;

      this.list.current.scrollToLocation({
        animated: true,
        sectionIndex: sectionIndex,
        itemIndex: 0,
        viewPosition: 0, // position at the top
        viewOffset: (commons.isAndroid ? this.sectionHeight : 0) + this.props.viewOffset
      });
    }
  }

<<<<<<< HEAD:src/expandableCalendar/agendaList.js
  onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems && !this.sectionScroll) {
      const topSection = _.get(viewableItems[0], 'section.title');
=======
  onViewableItemsChanged = (info: {viewableItems: Array<ViewToken>; changed: Array<ViewToken>}) => {
    if (info?.viewableItems && !this.sectionScroll) {
      const topSection = get(info?.viewableItems[0], 'section.title');
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx
      if (topSection && topSection !== this._topSection) {
        this._topSection = topSection;
        if (this.didScroll && !this.props.avoidDateUpdates) {
          // to avoid setDate() on first load (while setting the initial context.date value)
<<<<<<< HEAD:src/expandableCalendar/agendaList.js
          _.invoke(this.props.context, 'setDate', this._topSection, UPDATE_SOURCES.LIST_DRAG);
=======
          this.props.context.setDate?.(this._topSection, updateSources.LIST_DRAG);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx
        }
      }
    }
  };

  onScroll = event => {
    if (!this.didScroll) {
      this.didScroll = true;
    }
<<<<<<< HEAD:src/expandableCalendar/agendaList.js
    _.invoke(this.props, 'onScroll', event);
  };

  onMomentumScrollBegin = event => {
    _.invoke(this.props.context, 'setDisabled', true);
    _.invoke(this.props, 'onMomentumScrollBegin', event);
=======
    this.props.onScroll?.(event);
  };

  onMomentumScrollBegin = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.props.context.setDisabled?.(true);
    this.props.onMomentumScrollBegin?.(event);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx
  };

  onMomentumScrollEnd = event => {
    // when list momentum ends AND when scrollToSection scroll ends
    this.sectionScroll = false;
<<<<<<< HEAD:src/expandableCalendar/agendaList.js
    _.invoke(this.props.context, 'setDisabled', false);
    _.invoke(this.props, 'onMomentumScrollEnd', event);
  };

  onScrollToIndexFailed = info => {
    console.warn('onScrollToIndexFailed info: ', info);
=======
    this.props.context.setDisabled?.(false);
    this.props.onMomentumScrollEnd?.(event);
  };

  onScrollToIndexFailed = (info: {index: number; highestMeasuredFrameIndex: number; averageItemLength: number}) => {
    if (this.props.onScrollToIndexFailed) {
      this.props.onScrollToIndexFailed(info);
    } else {
      console.warn('onScrollToIndexFailed info: ', info);
    }
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx
  };

  onHeaderLayout = ({nativeEvent}) => {
    this.sectionHeight = nativeEvent.layout.height;
  };

  renderSectionHeader = ({section: {title}}) => {
    const {renderSectionHeader, sectionStyle} = this.props;
<<<<<<< HEAD:src/expandableCalendar/agendaList.js
=======
    const title = info?.section?.title;
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/agendaList.tsx

    if (renderSectionHeader) {
      return renderSectionHeader(title);
    }

    return (
      <Text allowFontScaling={false} style={[this.style.sectionText, sectionStyle]} onLayout={this.onHeaderLayout}>
        {this.getSectionTitle(title)}
      </Text>
    );
  };

  keyExtractor = (item, index) => {
    const {keyExtractor} = this.props;
    return _.isFunction(keyExtractor) ? keyExtractor(item, index) : String(index);
  };

  render() {
    const props = _.omit(this.props, 'context');

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

export default asCalendarConsumer<AgendaListProps>(AgendaList);
