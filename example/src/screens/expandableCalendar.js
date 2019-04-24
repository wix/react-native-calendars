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


const data = [
  {date: '2019-05-22', items: [{hour: '4pm', duration: '1h', title: 'Pilates ABC'}, {hour: '5pm', duration: '1h', title: 'Vinyasa Yoga'}]},
  {date: '2019-05-23', items: [{hour: '1pm', duration: '1h', title: 'Ashtanga Yoga'}, {hour: '2pm', duration: '1h', title: 'Deep Streches'}, {hour: '3pm', duration: '1h', title: 'Private Yoga'}]},
  {date: '2019-05-24', items: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]},
  {date: '2019-05-25', items: [{}]},
  {date: '2019-05-26', items: [{hour: '9pm', duration: '1h', title: 'Pilates Reformer'}, {hour: '10pm', duration: '1h', title: 'Ashtanga'}, {hour: '11pm', duration: '1h', title: 'TRX'}, {hour: '12pm', duration: '1h', title: 'Running Group'}]},
];

export default class ExpandableCalendarScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {};
  }

  onDateChanged = (date) => {
    // console.warn('INBAL screen onDateChanged: ', date);
    // get data for date + week
  }

  getSections() {
    const sections = _.compact(_.map(data, (item) => {
      return {title: item.date, data: item.items};
    }));
    return sections;
  }

  renderEmptyItem() {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>Empty date</Text>
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
          onDateChanged={this.onDateChanged}
          currentDate={'2019-06-08'} 
          // markedDates={{'2019-04-08': {marked: true, selected: true}, '2019-04-09': {marked: true}}}
        />
        <AgendaList
          data={data}
          renderItem={this.renderItem}
          sections={this.getSections()}
        />
      </CalendarProvider>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 12, 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderBottomColor: 'grey', 
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
    height: 70, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#d9e1e8'
  },
  emptyItemText: {
    fontWeight: 'bold', 
    fontStyle: 'italic', 
    fontSize: 16
  }
});
