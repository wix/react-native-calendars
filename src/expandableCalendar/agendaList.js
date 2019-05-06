import _ from 'lodash';
// import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  SectionList,
  Text
} from 'react-native';
import XDate from 'xdate';

import styleConstructor from './style';
import asCalendarConsumer from './asCalendarConsumer';


class AgendaList extends Component {
  static propTypes = {
    ...SectionList.propTypes
  }

  // static defaultProps = {}

  constructor(props) {
    super(props);

    this.state = {};

    this.style = styleConstructor(props.theme);
  }

  onViewableItemsChanged = (data) => {
    const {context} = this.props;

    if (data) {
      const topSection = _.get(data.viewableItems[0], 'section.title');
      if (topSection !== this._topSection) {
        this._topSection = topSection;
        if (this.scrolled) { // to avoid setting on first layout
          _.invoke(context, 'setDate', this._topSection); // report date change
        }
      }
    }
  }

  onScroll = () => {
    if (!this.scrolled) {
      this.scrolled = true;
    }
  }

  renderSectionHeader = ({section: {title}}) => {
    const sectionTitle = XDate(title).toDateString();
    return (
      <Text style={this.style.sectionText}>{sectionTitle}</Text>
    );
  }

  render() {
    return (
      <SectionList
        {...this.props}
        keyExtractor={(item, index) => String(index)}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled
        onViewableItemsChanged={this.onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 20 // 50 means if 50% of the item is visible
        }}
        renderSectionHeader={this.renderSectionHeader}
        onScroll={this.onScroll}
      />
    );
  }
}

export default asCalendarConsumer(AgendaList);
