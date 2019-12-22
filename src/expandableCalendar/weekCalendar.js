import _ from 'lodash';
import React, {Component} from 'react';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import styleConstructor from './style';
import CalendarList from '../calendar-list';
import Week from '../expandableCalendar/week';

const commons = require('./commons');
const UPDATE_SOURCES = commons.UPDATE_SOURCES;
const NUMBER_OF_PAGES = 2; // must be a positive number

class WeekCalendar extends Component {
  static propTypes = {
    ...CalendarList.propTypes,
    // the current date
    current: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);

    this.viewabilityConfig = {
      itemVisiblePercentThreshold: 90,
    };
    this.visibleItem = undefined;
    // this.items = this.getDatesArray();
    this.list = React.createRef();
    this.page = NUMBER_OF_PAGES;

    this.state = {
      items: this.getDatesArray(),
    };
  }

  // componentDidUpdate() {
  //   if (this.props.context.updateSource === UPDATE_SOURCES.WEEK_SCROLL) {
  //     // to avoid new items render from changing the visible week
  //     // this.list.current.scrollToIndex({animated: false, index: NUMBER_OF_PAGES});
  //   }
  // }

  getDatesArray() {
    const array = [];
    for (let index = -NUMBER_OF_PAGES; index <= NUMBER_OF_PAGES; index++) {
      const d = this.getDate(index);
      array.push(d);
    }
    return array;
  }

  getDate(weekIndex) {
    const {current, firstDay} = this.props;
    const d = XDate(current);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
      dayOfTheWeek = 7 + dayOfTheWeek;
    }
    // leave the current date in the visible week as is
    const dd = weekIndex === 0 ? d : d.addDays(firstDay - dayOfTheWeek);
    const newDate = dd.addWeeks(weekIndex);
    const dateString = newDate.toString('yyyy-MM-dd');
    return dateString;
  }

  onScroll = ({
    nativeEvent: {
      contentOffset: {x},
    },
  }) => {
    const newPage = Math.round(x / commons.screenWidth);
    if (this.page !== newPage) {
      const {items} = this.state;
      this.page = newPage;

      _.invoke(
        this.props.context,
        'setDate',
        items[this.page],
        UPDATE_SOURCES.WEEK_SCROLL,
      );

      if (this.page === items.length - 1) {
        for (let i = 0; i <= NUMBER_OF_PAGES; i++) {
          items[i] = items[i + NUMBER_OF_PAGES];
        }
        this.setState({items: [...items]});
      } else if (this.page === 0) {

        for (let i = NUMBER_OF_PAGES; i < items.length; i++) {
          items[i] = items[i - NUMBER_OF_PAGES];
        }

        this.setState({items: [...items]});
      }
    }
  };

  onMomentumScrollEnd = () => {
    const {items} = this.state;
    const isFirstPage = this.page === 0;
    const isLastPage = this.page === items.length - 1;

    if (isFirstPage || isLastPage) {
      this.list.current.scrollToIndex({
        animated: false,
        index: NUMBER_OF_PAGES,
      });
      this.page = NUMBER_OF_PAGES;
      const newWeekArray = this.getDatesArray();

      if (isLastPage) {

        for (let i = NUMBER_OF_PAGES + 1; i < items.length; i++) {
          items[i] = newWeekArray[i];
        }
      } else {
        for (let i = 0 + 1; i < NUMBER_OF_PAGES; i++) {
          items[i] = newWeekArray[i];
        }
      }

      setTimeout(() => {
        this.setState({items: [...items]});
      }, 100);
    }
  };

  // onViewableItemsChanged = ({viewableItems}) => {
  //   // NOTE: gets called only on week scroll (so might be un-synced with displayed week) !!!
  //   if (viewableItems.length > 0) {
  //     const viweableItem = _.first(viewableItems);
  //     if (viweableItem.isViewable && this.visibleItem !== viweableItem.item) {
  //       if (this.visibleItem) {
  //         // to avoid invoke on first init
  //         _.invoke(
  //           this.props.context,
  //           'setDate',
  //           viweableItem.item,
  //           UPDATE_SOURCES.WEEK_SCROLL,
  //         );
  //       }
  //       this.visibleItem = viweableItem.item;
  //     }
  //   }
  // };

  renderItem = ({item}) => {
    return <Week {...this.props} current={item} key={item} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    // this.items = this.getDatesArray();
    // const items = this.getDatesArray();
    const {items} = this.state;

    return (
      <FlatList
        ref={this.list}
        data={items}
        style={this.style.container}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEnabled
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        // onViewableItemsChanged={this.onViewableItemsChanged}
        // viewabilityConfig={this.viewabilityConfig}
        initialScrollIndex={NUMBER_OF_PAGES}
        getItemLayout={this.getItemLayout}
        onScroll={this.onScroll}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
      />
    );
  }

  getItemLayout = (data, index) => {
    return {
      length: commons.screenWidth,
      offset: commons.screenWidth * index,
      index,
    };
  };
}

export default WeekCalendar;
