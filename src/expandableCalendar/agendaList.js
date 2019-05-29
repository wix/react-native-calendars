import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {SectionList, View, TouchableOpacity, Text, Image, Animated} from 'react-native';
import XDate from 'xdate';

import styleConstructor from './style';
import asCalendarConsumer from './asCalendarConsumer';


const commons = require('./commons');
const UPDATE_SOURCES = commons.UPDATE_SOURCES;

class AgendaList extends Component {
  static propTypes = {
    ...SectionList.propTypes,
    // day format in section title. Formatting values: http://arshaw.com/xdate/#Formatting
    dayFormat: PropTypes.string,
    // style passed to the section view
    sectionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array])
  }

  static defaultProps = {
    dayFormat: 'dddd, MMM d'
  }

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);

    this.state = {
      buttonY: new Animated.Value(commons.screenHeight),
      buttonIcon: undefined
    };

    this._topSection = props.sections ? props.sections[0].title : undefined;
    this.didScroll = false;
    this.sectionScroll = false;
    this.height = 0;
  }

  isPastDate(date1, date2) {
    const d1 = XDate(date1);
    const d2 = XDate(date2);

    if (d1.getFullYear() > d2.getFullYear()) {
      return true;
    }
    if (d1.getFullYear() === d2.getFullYear()) {
      if (d1.getMonth() > d2.getMonth()) {
        return true;
      }

      if (d1.getMonth() === d2.getMonth()) {
        if (d1.getDate() > d2.getDate()) {
          return true;
        }
      }
    }
    return false;
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

  componentDidUpdate(prevProps) {
    const {updateSource, date} = this.props.context;
    if (date !== prevProps.context.date) {
      // NOTE: on first init data should set first section to the current date!!!
      if (updateSource !== UPDATE_SOURCES.LIST_DRAG && updateSource !== UPDATE_SOURCES.CALENDAR_INIT && updateSource !== UPDATE_SOURCES.LIST_TODAY_PRESS) {
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
        viewOffset: commons.isAndroid ? 10 : 0
      });
    }
  }

  onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems) {
      const topSection = _.get(viewableItems[0], 'section.title');
      this.animateTodayButton(topSection);
  
      if (!this.sectionScroll) {
        if (topSection && topSection !== this._topSection) {
          this._topSection = topSection;
          if (this.didScroll) { // to avoid setDate() on first load (while setting the initial context.date value)
            _.invoke(this.props.context, 'setDate', this._topSection, UPDATE_SOURCES.LIST_DRAG);
          }
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

  onLayout = ({nativeEvent}) => {
    this.height = nativeEvent.layout.height;
  }

  onTodayPress = () => {
    const today = XDate().toString('yyyy-MM-dd');
    const sectionIndex = this.getSectionIndex(today);
    this.scrollToSection(sectionIndex);
    _.invoke(this.props.context, 'setDate', today, UPDATE_SOURCES.LIST_TODAY_PRESS);
  }

  animateTodayButton(topSection) {
    const today = XDate().toString('yyyy-MM-dd');
    const isToday = today === topSection;
        
    const isPast = this.isPastDate(today, this._topSection);
    this.setState({buttonIcon: isPast ? require('../img/down.png') : require('../img/up.png')});

    Animated.spring(this.state.buttonY, {
      toValue: isToday ? commons.screenHeight : this.height * 0.85,
      tension: 30,
      friction: 8,
      useNativeDriver: true
    }).start();
  }

  renderTodayButton() {
    const todayString = XDate.locales[XDate.defaultLocale].today || commons.todayString;
    const today = todayString.charAt(0).toUpperCase() + todayString.slice(1);
    
    return (
      <Animated.View 
        style={{
          position: 'absolute', 
          left: 20, 
          right: 0, 
          top : 0, 
          transform: [{translateY: this.state.buttonY}]
        }}
      >
        <TouchableOpacity style={this.style.button} onPress={this.onTodayPress}>
          <Image source={this.state.buttonIcon} style={this.style.buttonImage}/>
          <Text style={this.style.buttonText}>{today}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  renderSectionHeader = ({section: {title}}) => {
    const today = XDate().toString(this.props.dayFormat).toUpperCase();
    const date = XDate(title).toString(this.props.dayFormat).toUpperCase();
    const todayString = XDate.locales[XDate.defaultLocale].today || commons.todayString;
    const sectionTitle = date === today ? `${todayString.toUpperCase()}, ${date}` : date;
    
    return (
      <Text style={[this.style.sectionText, this.props.sectionStyle]}>{sectionTitle}</Text>
    );
  }

  render() {
    return (
      <View style={{flex: 1}} onLayout={this.onLayout}>
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
          // onScrollToIndexFailed={(info) => { console.warn('onScrollToIndexFailed info: ', info); }}
          // getItemLayout={this.getItemLayout} // onViewableItemsChanged is not updated when list scrolls!!!
        />
        {this.renderTodayButton()}
      </View>
    );
  }

  // getItemLayout = (data, index) => {
  //   return {length: commons.screenWidth, offset: commons.screenWidth  * index, index};
  // }
}

export default asCalendarConsumer(AgendaList);
