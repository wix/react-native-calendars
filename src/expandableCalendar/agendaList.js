import _ from 'lodash';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, { Component } from 'react';
import { Text, SectionList } from 'react-native';
// @ts-expect-error
import { isToday } from '../dateutils';
// @ts-expect-error
import { getMoment } from '../momentResolver';
import styleConstructor from './style';
import asCalendarConsumer from './asCalendarConsumer';
const commons = require('./commons');
const updateSources = commons.UpdateSources;
/**
 * @description: AgendaList component
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: SectionList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
class AgendaList extends Component {
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
    _topSection = _.get(this.props, 'sections[0].title');
    didScroll = false;
    sectionScroll = false;
    viewabilityConfig = {
        itemVisiblePercentThreshold: 20 // 50 means if 50% of the item is visible
    };
    list = React.createRef();
    sectionHeight = 0;
    componentDidMount() {
        const { date } = this.props.context;
        if (date !== this._topSection) {
            setTimeout(() => {
                const sectionIndex = this.getSectionIndex(date);
                if (sectionIndex) {
                    this.scrollToSection(sectionIndex);
                }
            }, 500);
        }
    }
    componentDidUpdate(prevProps) {
        const { updateSource, date } = this.props.context;
        if (date !== prevProps.context.date) {
            // NOTE: on first init data should set first section to the current date!!!
            if (updateSource !== updateSources.LIST_DRAG && updateSource !== updateSources.CALENDAR_INIT) {
                const sectionIndex = this.getSectionIndex(date);
                if (sectionIndex) {
                    this.scrollToSection(sectionIndex);
                }
            }
        }
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
    getSectionTitle(title) {
        if (!title)
            return;
        const { dayFormatter, dayFormat, useMoment, markToday } = this.props;
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
            // @ts-expect-error
            const todayString = XDate.locales[XDate.defaultLocale].today || commons.todayString;
            const today = isToday(new XDate(title));
            sectionTitle = today ? `${todayString}, ${sectionTitle}` : sectionTitle;
        }
        return sectionTitle;
    }
    scrollToSection(sectionIndex) {
        if (this.list?.current && sectionIndex !== undefined) {
            const { sections, viewOffset = 0 } = this.props;
            this.sectionScroll = true; // to avoid setDate() in onViewableItemsChanged
            this._topSection = sections[sectionIndex].title;
            this.list.current.scrollToLocation({
                animated: true,
                sectionIndex: sectionIndex,
                itemIndex: 0,
                viewPosition: 0,
                viewOffset: (commons.isAndroid ? this.sectionHeight : 0) + viewOffset
            });
        }
    }
    onViewableItemsChanged = ((info) => {
        if (info?.viewableItems && !this.sectionScroll) {
            const topSection = _.get(info?.viewableItems[0], 'section.title');
            if (topSection && topSection !== this._topSection) {
                this._topSection = topSection;
                if (this.didScroll && !this.props.avoidDateUpdates) {
                    // to avoid setDate() on first load (while setting the initial context.date value)
                    _.invoke(this.props.context, 'setDate', this._topSection, updateSources.LIST_DRAG);
                }
            }
        }
    });
    onScroll = (event) => {
        if (!this.didScroll) {
            this.didScroll = true;
        }
        _.invoke(this.props, 'onScroll', event);
    };
    onMomentumScrollBegin = (event) => {
        _.invoke(this.props.context, 'setDisabled', true);
        _.invoke(this.props, 'onMomentumScrollBegin', event);
    };
    onMomentumScrollEnd = (event) => {
        // when list momentum ends AND when scrollToSection scroll ends
        this.sectionScroll = false;
        _.invoke(this.props.context, 'setDisabled', false);
        _.invoke(this.props, 'onMomentumScrollEnd', event);
    };
    onScrollToIndexFailed = (info) => {
        if (this.props.onScrollToIndexFailed) {
            this.props.onScrollToIndexFailed(info);
        }
        else {
            console.warn('onScrollToIndexFailed info: ', info);
        }
    };
    onHeaderLayout = (event) => {
        this.sectionHeight = event.nativeEvent.layout.height;
    };
    renderSectionHeader = (info) => {
        const { renderSectionHeader, sectionStyle } = this.props;
        const title = info?.section?.title;
        if (renderSectionHeader) {
            return renderSectionHeader(title);
        }
        return (<Text allowFontScaling={false} style={[this.style.sectionText, sectionStyle]} onLayout={this.onHeaderLayout}>
        {this.getSectionTitle(title)}
      </Text>);
    };
    keyExtractor = (item, index) => {
        const { keyExtractor } = this.props;
        return _.isFunction(keyExtractor) ? keyExtractor(item, index) : String(index);
    };
    render() {
        const props = _.omit(this.props, 'context');
        return (<SectionList {...props} ref={this.list} keyExtractor={this.keyExtractor} showsVerticalScrollIndicator={false} onViewableItemsChanged={this.onViewableItemsChanged} viewabilityConfig={this.viewabilityConfig} renderSectionHeader={this.renderSectionHeader} onScroll={this.onScroll} onMomentumScrollBegin={this.onMomentumScrollBegin} onMomentumScrollEnd={this.onMomentumScrollEnd} onScrollToIndexFailed={this.onScrollToIndexFailed}/>);
    }
}
export default asCalendarConsumer(AgendaList);
