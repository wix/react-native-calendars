import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import type React from 'react';
import {Component} from 'react';
import {Text, View} from 'react-native';

import {type CustomDate, getDateInMs, getDay, isToday} from '../../dateutils';
import {getDefaultLocale} from '../../services';
import {RESERVATION_DATE} from '../../testIDs';
import type {AgendaEntry, Theme} from '../../types';
import styleConstructor from './style';

export interface ReservationProps {
  date?: CustomDate;
  item?: AgendaEntry;
  /** Specify theme properties to override specific styles for item's parts. Default = {} */
  theme?: Theme;
  /** specify your item comparison function for increased performance */
  rowHasChanged?: (a: AgendaEntry, b: AgendaEntry) => boolean;
  /** specify how each date should be rendered. date can be undefined if the item is not first in that day */
  renderDay?: (date?: CustomDate, item?: AgendaEntry) => JSX.Element;
  /** specify how each item should be rendered in agenda */
  renderItem?: (reservation: AgendaEntry, isFirst: boolean) => React.Component | JSX.Element;
  /** specify how empty date content with no items should be rendered */
  renderEmptyDate?: (date?: CustomDate) => React.Component | JSX.Element;
}

class Reservation extends Component<ReservationProps> {
  static displayName = 'Reservation';

  static propTypes = {
    date: PropTypes.any,
    item: PropTypes.any,
    theme: PropTypes.object,
    rowHasChanged: PropTypes.func,
    renderDay: PropTypes.func,
    renderItem: PropTypes.func,
    renderEmptyDate: PropTypes.func
  };

  style;

  constructor(props: ReservationProps) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps: ReservationProps) {
    const d1 = this.props.date;
    const d2 = nextProps.date;
    const r1 = this.props.item;
    const r2 = nextProps.item;

    let changed = true;
    if (!d1 && !d2) {
      changed = false;
    } else if (d1 && d2) {
      if (getDateInMs(d1) !== getDateInMs(d2)) {
        changed = true;
      } else if (!r1 && !r2) {
        changed = false;
      } else if (r1 && r2) {
        if ((!d1 && !d2) || (d1 && d2)) {
          if (isFunction(this.props.rowHasChanged)) {
            changed = this.props.rowHasChanged(r1, r2);
          }
        }
      }
    }
    return changed;
  }

  renderDate() {
    const {item, date, renderDay} = this.props;

    if (isFunction(renderDay)) {
      return renderDay(date, item);
    }

    const today = date && isToday(date) ? this.style.today : undefined;
    const dayNames = getDefaultLocale().dayNamesShort;

    if (date) {
      return (
        <View style={this.style.day} testID={RESERVATION_DATE}>
          <Text allowFontScaling={false} style={[this.style.dayNum, today]}>
            {getDay(date)}
          </Text>
          <Text allowFontScaling={false} style={[this.style.dayText, today]}>
            {dayNames ? dayNames[getDay(date)] : undefined}
          </Text>
        </View>
      );
    }
    return <View style={this.style.day} />;
  }

  render() {
    const {item, date, renderItem, renderEmptyDate} = this.props;

    let content;
    if (item) {
      const firstItem = date ? true : false;
      if (isFunction(renderItem)) {
        content = renderItem(item, firstItem);
      }
    } else if (isFunction(renderEmptyDate)) {
      content = renderEmptyDate(date);
    }

    return (
      <View style={this.style.container}>
        {this.renderDate()}
        <View style={this.style.innerContainer}>{content}</View>
      </View>
    );
  }
}

export default Reservation;
