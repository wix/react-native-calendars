import _ from 'lodash';
import React, {Component} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button
} from 'react-native';
import {ExpandableCalendar, AgendaList, CalendarProvider} from 'react-native-calendars';


const START_DATE = '2019-05-31';
const items = [
  {title: START_DATE, data: [{hour: '4pm', duration: '1h', title: 'Pilates ABC'}, {hour: '5pm', duration: '1h', title: 'Vinyasa Yoga'}]},
  {title: '2019-06-01', data: [{hour: '1pm', duration: '1h', title: 'Ashtanga Yoga'}, {hour: '2pm', duration: '1h', title: 'Deep Streches'}, {hour: '3pm', duration: '1h', title: 'Private Yoga'}]},
  {title: '2019-06-02', data: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]},
  {title: '2019-06-03', data: [{}]},
  {title: '2019-06-04', data: [{hour: '9pm', duration: '1h', title: 'Pilates Reformer'}, {hour: '10pm', duration: '1h', title: 'Ashtanga'}, {hour: '11pm', duration: '1h', title: 'TRX'}, {hour: '12pm', duration: '1h', title: 'Running Group'}]},
  {title: '2019-06-05', data: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]},
  {title: '2019-06-06', data: [{}]},
  {title: '2019-06-07', data: [{hour: '9pm', duration: '1h', title: 'Pilates Reformer'}, {hour: '10pm', duration: '1h', title: 'Ashtanga'}, {hour: '11pm', duration: '1h', title: 'TRX'}, {hour: '12pm', duration: '1h', title: 'Running Group'}]},
  {title: '2019-06-08', data: [{hour: '1pm', duration: '1h', title: 'Ashtanga Yoga'}, {hour: '2pm', duration: '1h', title: 'Deep Streches'}, {hour: '3pm', duration: '1h', title: 'Private Yoga'}]},
  {title: '2019-06-09', data: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]},
];

export default class ExpandableCalendarScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {};
  }

  onDateChanged = (date) => {
    // console.warn('INBAL screen onDateChanged: ', date);
    // fetch and set data for date + week ahead
  }

  getSections() {
    const sections = _.compact(_.map(items, (item) => {
      return {title: item.title, data: item.data};
    }));
    return sections;
  }

  renderEmptyItem() {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned</Text>
      </View>
    );
  }

  renderItem = ({item}) => {
    if (_.isEmpty(item)) {
      return this.renderEmptyItem();
    }
    const id = item.title;
    const props = {
      hour: item.hour,
      duration: item.duration,
      title: item.title,
      button: {label: 'info', onPress: () => Alert.alert('show more')},
      onPress: () => Alert.alert(id)
    };
    return (
      <TouchableOpacity 
        onPress={props.onPress} 
        style={styles.item}
      >
        <View>
          <Text style={styles.itemHourText}>{props.hour}</Text>
          <Text style={styles.itemDurationText}>{props.duration}</Text>
        </View>
        <Text style={styles.itemTitleText}>{props.title}</Text>
        <View style={styles.itemButtonContainer}>
          <Button title={props.button.label} onPress={props.button.onPress}/>
        </View>
      </TouchableOpacity>
    );
  }

  render() {    
    return (
      <CalendarProvider>
        <ExpandableCalendar 
          // horizontal={false}
          // hideArrows
          // disablePan
          // hideKnob
          // initialPosition={ExpandableCalendar.positions.OPEN} // can't find static positions
          onDateChanged={this.onDateChanged}
          currentDate={START_DATE} 
          markedDates={{'2019-06-08': {marked: true}, '2019-06-09': {marked: true}, '2019-05-01': {marked: true}}}
          // firstDay={1}
          theme={{todayTextColor: 'red'}}
        />
        <AgendaList
          data={items}
          renderItem={this.renderItem}
          sections={this.getSections()}
        />
      </CalendarProvider>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 20, 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e8ecf0', 
    flexDirection: 'row'
  },
  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey', 
    fontSize: 12, 
    marginTop: 4,
    marginLeft: 4
  },
  itemTitleText: {
    color: 'black', 
    marginLeft: 16, 
    fontWeight: 'bold', 
    fontSize: 16
  },
  itemButtonContainer: {
    flex: 1, 
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52, 
    justifyContent: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: '#e8ecf0', 
  },
  emptyItemText: {
    color: '#79838a',
    fontSize: 14
  }
});
