import React, {Component} from 'react';
import {View} from 'react-native';
import styleConstructor from './style';

class ReservationListItem extends Component {
  constructor(props) {
    super(props);
    this.styles = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    const r1 = this.props.item;
    const r2 = nextProps.item;
    let changed = true;
    if (!r1 && !r2) {
      changed = false;
    } else if (r1 && r2) {
      if (r1.day.getTime() !== r2.day.getTime()) {
        changed = true;
      } else if (!r1.reservation && !r2.reservation) {
        changed = false;
      } else if (r1.reservation && r2.reservation) {
        if ((!r1.date && !r2.date) || (r1.date && r2.date)) {
          changed = this.props.rowHasChanged(r1.reservation, r2.reservation);
        }
      }
    }
    return changed;
  }

  render() {
    const {reservation, date} = this.props.item;
    const {previousItem} = this.props;
    const previousReservation = previousItem? previousItem.reservation : undefined;
    let content;
    if (reservation) {
      content = this.props.renderItem(reservation, previousReservation);
    } else {
      content = this.props.renderEmptyDate(date);
    }
    return (
      <View style={this.styles.container}>
        {content}
      </View>
    );
  }
}

export default ReservationListItem;
