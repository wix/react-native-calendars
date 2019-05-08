import _ from 'lodash';
import React, {Component} from 'react';
import {
  SectionList,
  Text
} from 'react-native';
import XDate from 'xdate';

import styleConstructor from './style';
import asCalendarConsumer from './asCalendarConsumer';


const commons = require('./commons');
const UPDATE_SOURCES = commons.UPDATE_SOURCES;

class AgendaList extends Component {
  static propTypes = {
    ...SectionList.propTypes
  }

  // static defaultProps = {}

  constructor(props) {
    super(props);

    this.state = {};

    this.style = styleConstructor(props.theme);
    this._topSection = undefined;
    this.didScroll = false;
    this.sectionScroll = false;
  }

  getSectionIndex(date) {
    let i;
    _.map(this.props.sections, (section, index) => {
      if (section.title === date) {
        i = index;
        return;
      }
    });
    return i;
  }

  componentDidUpdate(prevProps) {
    const {updateSource, date} = this.props.context;
    if (date !== prevProps.context.date) {
      if (updateSource !== UPDATE_SOURCES.LIST && updateSource !== UPDATE_SOURCES.CALENDAR_INIT) {
        const sectionIndex = this.getSectionIndex(date);
        this.scrollToSection(sectionIndex);
      }
    }
  }

  scrollToSection(sectionIndex) {
    if (this.list && sectionIndex !== undefined) {
      this.sectionScroll = true; // to avoid setDate() in onViewableItemsChanged
      this._topSection = this.props.sections[sectionIndex].title;

      this.list.scrollToLocation({
        animated: true,
        sectionIndex: sectionIndex,
        itemIndex: 0,
        viewPosition: 0, // position at the top
        // viewOffset: {x: 0, y: 10}
      });
    }
  }

  onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems && !this.sectionScroll) {
      const topSection = _.get(viewableItems[0], 'section.title');
      if (topSection && topSection !== this._topSection) {
        this._topSection = topSection;
        if (this.didScroll) { // only to avoid setting on first layout when setting initial context.date value
          _.invoke(this.props.context, 'setDate', this._topSection, UPDATE_SOURCES.LIST); // report date change
        }
      }
    }
  }

  onScroll = () => {
    if (!this.didScroll) {
      this.didScroll = true;
    }
  }

  onMomentumScrollEnd = () => {
    // when list momentum ends AND when scrollToSection scroll ends
    this.sectionScroll = false;
  }

  onScrollEndDrag = () => {
    // when list drag ends
  }

  renderSectionHeader = ({section: {title}}) => {
    const sectionTitle = (XDate(title).toString('dddd, MMM d')).toUpperCase();
    return (
      <Text style={this.style.sectionText}>{sectionTitle}</Text>
    );
  }

  render() {
    return (
      <SectionList
        {...this.props}
        ref={r => this.list = r}
        keyExtractor={(item, index) => String(index)}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled
        onViewableItemsChanged={this.onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 20 // 50 means if 50% of the item is visible
        }}
        renderSectionHeader={this.renderSectionHeader}
        onScroll={this.onScroll}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        onScrollEndDrag={this.onScrollEndDrag}
        // getItemLayout={this.getItemLayout} // onViewableItemsChanged is not updated when list scrolls!!!
        // onScrollToIndexFailed={(info) => { console.warn('onScrollToIndexFailed info: ', info); }}
      />
    );
  }

  // getItemLayout = (data, index) => {
  //   return {length: commons.screenWidth, offset: commons.screenWidth  * index, index};
  // }
}

export default asCalendarConsumer(AgendaList);
